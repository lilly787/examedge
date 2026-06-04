import json
import re

with open('questions.js', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const\s+EXAMEDGE_QUESTIONS\s*=\s*(\[[\s\S]*?\]);', content)
if match:
    arr = match.group(1)
    cleaned = re.sub(r',\s*([\]}])', r'\1', arr)
    existing = json.loads(cleaned)
else:
    existing = []

with open('extra_questions.json', 'r', encoding='utf-8') as f:
    extra = json.load(f)

merged = existing + extra
print('Merged total:', len(merged), 'questions')

with open('questions.js', 'w', encoding='utf-8') as f:
    f.write('// ExamEdge Question Bank — {} questions total\n\nconst EXAMEDGE_QUESTIONS = {};\n\nif (typeof module !== "undefined" && module.exports) {{\n  module.exports = EXAMEDGE_QUESTIONS;\n}}\n'.format(len(merged), json.dumps(merged, indent=2, ensure_ascii=False)))
print('Written to questions.js')
