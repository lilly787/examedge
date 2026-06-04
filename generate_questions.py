import json
import random

TOPIC_TEMPLATES = {
    "Further Mathematics": [{"topic": "Calculus", "subtopics": ["Differentiation", "Integration", "Limits"]}, {"topic": "Trigonometry", "subtopics": ["Identities", "Complex Numbers"]}, {"topic": "Statistics", "subtopics": ["Probability", "Correlation"]}],
    "Agricultural Science": [{"topic": "Crop Production", "subtopics": ["Soil Science", "Plant Nutrition"]}, {"topic": "Animal Production", "subtopics": ["Animal Nutrition", "Breeding"]}],
    "Computer Science": [{"topic": "Programming", "subtopics": ["Algorithms", "Control Structures"]}, {"topic": "Hardware", "subtopics": ["Computer Systems", "Memory"]}],
    "Literature": [{"topic": "Drama", "subtopics": ["Plot", "Characters"]}, {"topic": "Poetry", "subtopics": ["Figures of Speech", "Devices"]}],
    "Government": [{"topic": "Democracy", "subtopics": ["Types of Government", "Principles"]}, {"topic": "Constitution", "subtopics": ["Features", "Federalism"]}],
    "History": [{"topic": "Nigerian History", "subtopics": ["Pre-colonial", "Colonial Era"]}, {"topic": "World History", "subtopics": ["World Wars", "Civilizations"]}],
    "Economics": [{"topic": "Microeconomics", "subtopics": ["Demand and Supply", "Market"]}, {"topic": "Macroeconomics", "subtopics": ["Inflation", "Policy"]}],
    "Geography": [{"topic": "Physical Geography", "subtopics": ["Rocks", "Climate"]}, {"topic": "Human Geography", "subtopics": ["Population", "Settlement"]}],
    "Commerce": [{"topic": "Business", "subtopics": ["Types", "Partnership"]}, {"topic": "Trade", "subtopics": ["International Trade"]}],
    "Financial Accounting": [{"topic": "Bookkeeping", "subtopics": ["Source Documents", "Ledger"]}, {"topic": "Financial Statements", "subtopics": ["Balance Sheet"]}],
    "Christian Religious Studies": [{"topic": "Biblical Studies", "subtopics": ["Old Testament", "New Testament"]}, {"topic": "Christian Doctrine", "subtopics": ["Salvation"]}],
    "Islamic Religious Studies": [{"topic": "Quranic Studies", "subtopics": ["Surahs", "Hadith"]}, {"topic": "Islamic Law", "subtopics": ["Pillars of Islam"]}],
    "Civic Education": [{"topic": "Rights and Responsibilities", "subtopics": ["Citizenship Rights"]}, {"topic": "National Values", "subtopics": ["Respect", "Patriotism"]}]
}

EXAM_BODIES = ["WAEC", "NECO", "JAMB"]

def gen_q(sub, idx):
    td = random.choice(TOPIC_TEMPLATES.get(sub, [{"topic": "General", "subtopics": ["General"]}]))
    exam = random.choice(EXAM_BODIES)
    year = random.randint(2010, 2023)
    return {"id": f"gen-{sub[:2].lower()}-{idx:04d}", "subject": sub, "topic": td["topic"], "subtopic": random.choice(td["subtopics"]), "year": year, "exam_body": exam, "type": "MCQ", "question": f"Sample {sub} question on {td['topic']}? (Generated)", "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}, "answer": random.choice(["A", "B", "C", "D"]), "explanation": f"Generated sample question for {sub}.", "difficulty": random.choice(["easy", "medium", "hard"]), "tags": [sub.lower().split()[0], exam.lower(), str(year)]}

qs = []
for s in TOPIC_TEMPLATES.keys():
    for i in range(1, 251):
        qs.append(gen_q(s, i))
with open("generated_questions.json", "w", encoding="utf-8") as f:
    json.dump(qs, f, indent=2)
print(f"Generated {len(qs)} questions")
