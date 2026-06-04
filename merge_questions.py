import os
import sys
import re
import json

# Force UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Paths
QUESTIONS_JS_PATH = "questions.js"
MAPPED_JSON_PATH = "aloc_mapped_questions.json"

# Import taggers from the import script
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from import_aloc_questions import tag_topic, tag_difficulty, parse_existing_questions, SUBJECTS
except ImportError:
    print("[ERROR] Could not import from import_aloc_questions.py")
    sys.exit(1)

def is_incomplete(q):
    # Clean HTML tags to count words in the question text accurately
    q_text = q.get("question", "")
    text_clean = re.sub(r'<[^>]+>', ' ', q_text)
    words = text_clean.split()
    
    # 1. question text is fewer than 15 words
    if len(words) >= 15:
        return False
        
    # 2. question text contains: "above", "diagram", "table below", "figure above", "following diagram", "chart above", "graph above"
    phrases = ["above", "diagram", "table below", "figure above", "following diagram", "chart above", "graph above"]
    text_lower = text_clean.lower()
    has_phrase = any(p in text_lower for p in phrases)
    if not has_phrase:
        return False
        
    # 3. question has no image field OR image field is empty string
    img = q.get("image")
    if img and img.strip() != "":
        return False
        
    return True

def main():
    print("=" * 60)
    print("ExamEdge - Question Merger & Standardizer")
    print("=" * 60)

    # 1. Parse existing questions from questions.js
    existing_qs = parse_existing_questions()
    
    # 2. Load mapped questions from aloc_mapped_questions.json
    mapped_qs = []
    if os.path.exists(MAPPED_JSON_PATH):
        print(f"[INFO] Reading mapped questions from {MAPPED_JSON_PATH}...")
        try:
            with open(MAPPED_JSON_PATH, "r", encoding="utf-8") as f:
                mapped_qs = json.load(f)
            print(f"[SUCCESS] Loaded {len(mapped_qs)} mapped questions.")
        except Exception as e:
            print(f"[ERROR] Could not read mapped questions: {e}")
    else:
        print(f"[WARNING] {MAPPED_JSON_PATH} not found.")

    # Combined sources
    # We prioritize existing questions.js, then mapped_qs
    combined = existing_qs + mapped_qs
    
    seen_texts = set()
    seen_ids = set()
    merged = []
    
    discarded_dup_text = 0
    discarded_dup_id = 0
    discarded_year = 0

    for q in combined:
        qid = q.get("id")
        q_text = q.get("question", "")
        q_subject = q.get("subject", "")
        q_year = q.get("year", 2024)
        
        # Filter: let the questions be from 2000 to 2025
        try:
            year_val = int(q_year)
        except:
            year_val = 2024
            
        if not (2000 <= year_val <= 2025):
            discarded_year += 1
            continue

        # Deduplicate by ALOC ID (aloc-XXX format)
        if qid and qid.startswith("aloc-"):
            if qid in seen_ids:
                discarded_dup_id += 1
                continue
        
        # Deduplicate by question text (lowercase + trim comparison)
        normalized_text = q_text.lower().strip()
        # Remove HTML tags during normalization to prevent tagging differences
        normalized_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', normalized_text)).strip()
        if normalized_text in seen_texts:
            discarded_dup_text += 1
            continue

        # Add to seen sets
        if qid and qid.startswith("aloc-"):
            seen_ids.add(qid)
        seen_texts.add(normalized_text)

        # Standardize topic if topic is "General" or ""
        topic = q.get("topic", "")
        if topic == "General" or not topic:
            topic = tag_topic(q_text, q_subject)
            q["topic"] = topic
            
        # Standardize difficulty to easy, medium, hard
        difficulty = tag_difficulty(q_text, q_subject)
        q["difficulty"] = difficulty
        
        # Ensure year is integer
        q["year"] = year_val

        # Scan for incomplete
        if is_incomplete(q):
            q["incomplete"] = True
            
        merged.append(q)

    # Let's count subjects
    subject_counts = {}
    incomplete_count = 0
    images_count = 0
    unresolved_general = 0
    difficulty_counts = {"easy": 0, "medium": 0, "hard": 0}
    exam_body_counts = {"WAEC": 0, "JAMB": 0, "NECO": 0, "Other": 0}
    
    for q in merged:
        sub = q.get("subject", "Unknown")
        subject_counts[sub] = subject_counts.get(sub, 0) + 1
        
        if q.get("incomplete"):
            incomplete_count += 1
            
        img = q.get("image")
        if img and img.strip() != "":
            images_count += 1
            
        if q.get("topic") == "General":
            unresolved_general += 1
            
        diff = q.get("difficulty", "medium")
        difficulty_counts[diff] = difficulty_counts.get(diff, 0) + 1
        
        eb = q.get("exam_body", "WAEC").upper()
        if "WAEC" in eb or "WASSCE" in eb:
            exam_body_counts["WAEC"] += 1
        elif "JAMB" in eb or "UTME" in eb:
            exam_body_counts["JAMB"] += 1
        elif "NECO" in eb:
            exam_body_counts["NECO"] += 1
        else:
            exam_body_counts["Other"] += 1

    print("\n" + "=" * 60)
    print("Merge Stats:")
    print(f"  Total input questions           : {len(combined)}")
    print(f"  Discarded (duplicate ID)        : {discarded_dup_id}")
    print(f"  Discarded (duplicate text)      : {discarded_dup_text}")
    print(f"  Discarded (year out of bounds)  : {discarded_year}")
    print(f"  Total merged questions          : {len(merged)}")
    print(f"  Incomplete flagged questions    : {incomplete_count}")
    print(f"  Questions with images           : {images_count}")
    print(f"  Questions tagged 'General'      : {unresolved_general}")
    print("=" * 60)

    # Output to questions.js
    header_comment = (
        f"// ExamEdge Question Bank — {len(merged)} questions total\n"
        f"// Counts per subject:\n"
    )
    for sub in sorted(SUBJECTS.values()):
        header_comment += f"//   {sub}: {subject_counts.get(sub, 0)}\n"
    header_comment += "\n"

    js_content = (
        header_comment +
        f"const EXAMEDGE_QUESTIONS = {json.dumps(merged, indent=2, ensure_ascii=False)};\n\n"
        f"if (typeof module !== 'undefined' && module.exports) {{\n"
        f"  module.exports = EXAMEDGE_QUESTIONS;\n"
        f"}}\n"
    )
    
    with open(QUESTIONS_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"\n[SUCCESS] Unified questions.js written with {len(merged)} questions.")

if __name__ == "__main__":
    main()
