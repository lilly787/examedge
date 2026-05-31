import os
import sys

# Force UTF-8 output on Windows to handle special math/unicode characters from ALOC
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import re
import json
import time
import urllib.request
import urllib.error

# Config - these are relative to the script location (examedge folder)
QUESTIONS_JS_PATH = "questions.js"
RAW_JSON_PATH = "aloc_raw_questions.json"
MAPPED_JSON_PATH = "aloc_mapped_questions.json"

# ALOC API - fetch 1 question at a time to avoid timeouts
BASE_URL = "https://questions.aloc.com.ng/api/v2/q"
SUBJECTS = {
    "mathematics": "Mathematics",
    "english": "English Language",
    "biology": "Biology",
    "chemistry": "Chemistry",
    "physics": "Physics"
}

def parse_existing_questions():
    """Reads questions.js and parses the JS array into a Python list of dicts."""
    if not os.path.exists(QUESTIONS_JS_PATH):
        print(f"[WARNING] {QUESTIONS_JS_PATH} not found. Starting with empty bank.")
        return []

    print(f"[INFO] Reading existing question bank from {QUESTIONS_JS_PATH}...")
    with open(QUESTIONS_JS_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract the array content between 'const EXAMEDGE_QUESTIONS = [' and '];'
    match = re.search(r'const\s+EXAMEDGE_QUESTIONS\s*=\s*(\[[\s\S]*?\]);', content)
    if not match:
        print("[WARNING] Could not find EXAMEDGE_QUESTIONS array. Starting fresh.")
        return []

    array_str = match.group(1)
    # Remove single-line comments
    cleaned = re.sub(r'//[^\n]*', '', array_str)
    # Quote specific keys only
    keys_pattern = r'([{,]\s*|\n\s*)(id|subject|topic|subtopic|year|exam_body|type|question|options|answer|explanation|difficulty|tags|[A-E])\s*:'
    cleaned = re.sub(keys_pattern, r'\1"\2":', cleaned)
    # Remove trailing commas before closing braces/brackets
    cleaned = re.sub(r',\s*([\]}])', r'\1', cleaned)

    try:
        existing_qs = json.loads(cleaned)
        print(f"[SUCCESS] Loaded {len(existing_qs)} existing questions.")
        return existing_qs
    except Exception as e:
        print(f"[ERROR] Could not parse questions.js: {e}")
        backup_path = QUESTIONS_JS_PATH + ".backup"
        with open(backup_path, "w", encoding="utf-8") as bf:
            bf.write(content)
        print(f"[INFO] Backed up original questions.js to {backup_path}")
        return []

def fetch_single_question(token, subject):
    """Fetches a single question from ALOC API (as designed by the API)."""
    url = f"{BASE_URL}/1?subject={subject}"
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/json")
    req.add_header("Content-Type", "application/json")
    req.add_header("AccessToken", token)

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            status = res_data.get("status")
            if status in (True, "success", 200, "200"):
                data = res_data.get("data", [])
                if data:
                    return data[0]
            return None
    except Exception:
        return None

def map_aloc_to_examedge(aloc_q, mapped_subject):
    """Maps a single ALOC question to ExamEdge format."""
    aloc_id = aloc_q.get("id")
    raw_options = aloc_q.get("option", {})

    options = {
        "A": (raw_options.get("a") or "").strip(),
        "B": (raw_options.get("b") or "").strip(),
        "C": (raw_options.get("c") or "").strip(),
        "D": (raw_options.get("d") or "").strip(),
    }
    if raw_options.get("e"):
        options["E"] = raw_options["e"].strip()

    answer = (aloc_q.get("answer") or "A").upper()

    raw_type = aloc_q.get("examtype") or aloc_q.get("exam_type") or "WAEC"
    exam_type = raw_type.upper()
    if "UTME" in exam_type:
        exam_body = "JAMB"
    elif "WASSCE" in exam_type or "WAEC" in exam_type:
        exam_body = "WAEC"
    elif "NECO" in exam_type:
        exam_body = "NECO"
    else:
        exam_body = exam_type or "WAEC"

    year_raw = aloc_q.get("examyear") or aloc_q.get("year") or 2024
    try:
        year = int(year_raw)
    except:
        year = 2024

    question_text = (aloc_q.get("question") or "").strip()
    explanation = (aloc_q.get("solution") or "").strip() or f"The correct answer is option {answer}."

    return {
        "id": f"aloc-{aloc_id}",
        "subject": mapped_subject,
        "topic": "General",
        "subtopic": "",
        "year": year,
        "exam_body": exam_body,
        "type": "MCQ",
        "question": question_text,
        "options": options,
        "answer": answer,
        "explanation": explanation,
        "difficulty": "medium",
        "tags": [mapped_subject.lower(), exam_body.lower(), str(year)]
    }

def main():
    print("=" * 60)
    print("ExamEdge - ALOC.ng Question Importer & Mapper")
    print("=" * 60)

    # Get Access Token
    token = sys.argv[1].strip() if len(sys.argv) > 1 else input("Enter your ALOC.ng Access Token: ").strip()
    if not token:
        print("[ERROR] Access Token is required.")
        return

    # Get count per subject
    count = 30
    if len(sys.argv) > 2:
        try:
            count = int(sys.argv[2])
        except ValueError:
            count = 30
    else:
        val = input(f"How many questions per subject? (default {count}): ").strip()
        if val:
            try:
                count = int(val)
            except ValueError:
                pass

    print(f"[INFO] Will import up to {count} questions per subject ({count * len(SUBJECTS)} total).")

    # Load existing questions
    existing_questions = parse_existing_questions()
    existing_ids = {q.get("id") for q in existing_questions}
    existing_texts = {q.get("question", "").lower().strip() for q in existing_questions}

    raw_all = []
    mapped_new = []

    # Fetch per subject — one at a time
    for aloc_sub, ee_sub in SUBJECTS.items():
        print(f"\n[INFO] --- Fetching {ee_sub} questions ---")
        fetched_count = 0
        failed_streak = 0

        while fetched_count < count:
            q = fetch_single_question(token, aloc_sub)

            if q is None:
                failed_streak += 1
                if failed_streak >= 5:
                    print(f"[WARNING] 5 consecutive failures for {ee_sub}. Moving on.")
                    break
                time.sleep(0.5)
                continue

            failed_streak = 0
            raw_all.append(q)

            q_text = (q.get("question") or "").strip().lower()
            q_id = f"aloc-{q.get('id')}"

            if q_text in existing_texts or q_id in existing_ids:
                # Still count it but skip mapping to avoid duplicates
                fetched_count += 1
                continue

            mapped_q = map_aloc_to_examedge(q, ee_sub)
            mapped_new.append(mapped_q)
            existing_texts.add(q_text)
            existing_ids.add(q_id)
            fetched_count += 1

            # Safely encode preview for Windows console
            preview = q_text[:60].encode('ascii', errors='replace').decode('ascii')
            print(f"  [{fetched_count}/{count}] {ee_sub}: {preview}...")
            time.sleep(0.2)  # Polite delay between requests

        print(f"[INFO] Done with {ee_sub}: {fetched_count} fetched.")

    print("\n" + "=" * 60)
    print(f"Summary:")
    print(f"  Raw questions fetched from API : {len(raw_all)}")
    print(f"  New unique questions to add    : {len(mapped_new)}")
    print("=" * 60)

    if not mapped_new:
        print("[INFO] No new questions to add. Exiting.")
        return

    # Save raw backup JSON
    with open(RAW_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(raw_all, f, indent=2, ensure_ascii=False)
    print(f"[INFO] Raw questions saved to {RAW_JSON_PATH}")

    # Save mapped JSON
    with open(MAPPED_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(mapped_new, f, indent=2, ensure_ascii=False)
    print(f"[INFO] Mapped questions saved to {MAPPED_JSON_PATH}")

    # Merge into questions.js
    all_questions = existing_questions + mapped_new
    js_content = (
        f"// ExamEdge Question Bank — {len(all_questions)} questions total\n"
        f"// Last updated via ALOC importer\n\n"
        f"const EXAMEDGE_QUESTIONS = {json.dumps(all_questions, indent=2, ensure_ascii=False)};\n\n"
        f"if (typeof module !== 'undefined' && module.exports) {{\n"
        f"  module.exports = EXAMEDGE_QUESTIONS;\n"
        f"}}\n"
    )
    with open(QUESTIONS_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"\n[SUCCESS] questions.js updated with {len(all_questions)} total questions!")
    print("[SUCCESS] Import complete. Refresh ExamEdge to see new questions.")

if __name__ == "__main__":
    main()
