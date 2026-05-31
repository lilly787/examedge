// ExamEdge Question Bank — 217 questions total
// Last updated via ALOC importer

const EXAMEDGE_QUESTIONS = [
  {
    "id": "m1",
    "subject": "Mathematics",
    "topic": "Algebra",
    "subtopic": "Quadratic Equations",
    "year": 2018,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Solve the quadratic equation: 2x² - 5x - 3 = 0.",
    "options": {
      "A": "x = 3 or x = -1/2",
      "B": "x = -3 or x = 1/2",
      "C": "x = 3 or x = 1/2",
      "D": "x = -3 or x = -1/2"
    },
    "answer": "A",
    "explanation": "To solve 2x² - 5x - 3 = 0, we can factorize by grouping. Find two numbers that multiply to (2 * -3) = -6 and add up to -5. These are -6 and +1.\nSo, 2x² - 6x + x - 3 = 0\nFactorizing: 2x(x - 3) + 1(x - 3) = 0\n(2x + 1)(x - 3) = 0\nTherefore, 2x + 1 = 0 => x = -1/2, or x - 3 = 0 => x = 3.\nThus, x = 3 or x = -1/2.",
    "difficulty": "medium",
    "tags": [
      "algebra",
      "factorization",
      "equations"
    ]
  },
  {
    "id": "m2",
    "subject": "Mathematics",
    "topic": "Number and Numeration",
    "subtopic": "Surds",
    "year": 2020,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Simplify: (3√2 + √3)(3√2 - √3)",
    "options": {
      "A": "15",
      "B": "18",
      "C": "21",
      "D": "9√2"
    },
    "answer": "A",
    "explanation": "This is in the form of difference of two squares: (a + b)(a - b) = a² - b².\nHere, a = 3√2 and b = √3.\nSo, (3√2)² - (√3)² = (9 * 2) - 3 = 18 - 3 = 15.",
    "difficulty": "easy",
    "tags": [
      "surds",
      "simplification"
    ]
  },
  {
    "id": "m3",
    "subject": "Mathematics",
    "topic": "Trigonometry",
    "subtopic": "Angles of Elevation and Depression",
    "year": 2017,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "From a point 15m away from the base of a vertical tower, the angle of elevation of the top of the tower is 60°. Find the height of the tower.",
    "options": {
      "A": "15√3 m",
      "B": "15/√3 m",
      "C": "30 m",
      "D": "7.5 m"
    },
    "answer": "A",
    "explanation": "Using basic trigonometry: tan(θ) = opposite / adjacent\nHere, θ = 60°, adjacent = 15m, and opposite = height of tower (h).\ntan(60°) = h / 15\nSince tan(60°) = √3, we get:\n√3 = h / 15\nh = 15√3 m.",
    "difficulty": "medium",
    "tags": [
      "trigonometry",
      "elevation"
    ]
  },
  {
    "id": "m4",
    "subject": "Mathematics",
    "topic": "Statistics",
    "subtopic": "Mean and Deviation",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "The mean of the numbers 3, 6, 4, x, and 7 is 5. Find the value of x.",
    "options": {
      "A": "5",
      "B": "4",
      "C": "6",
      "D": "3"
    },
    "answer": "A",
    "explanation": "Mean = (sum of values) / (number of values)\n5 = (3 + 6 + 4 + x + 7) / 5\n5 = (20 + x) / 5\nMultiply both sides by 5:\n25 = 20 + x\nx = 25 - 20 = 5.",
    "difficulty": "easy",
    "tags": [
      "statistics",
      "mean"
    ]
  },
  {
    "id": "m5",
    "subject": "Mathematics",
    "topic": "Geometry",
    "subtopic": "Circle Theorems",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "An angle at the center of a circle is 120°. What is the size of the angle subtended by the same arc at the remaining part of the circumference?",
    "options": {
      "A": "60°",
      "B": "240°",
      "C": "120°",
      "D": "90°"
    },
    "answer": "A",
    "explanation": "According to circle theorems, the angle subtended by an arc at the center of a circle is twice the angle subtended at the circumference.\nAngle at Circumference = Angle at Center / 2 = 120° / 2 = 60°.",
    "difficulty": "easy",
    "tags": [
      "geometry",
      "circle-theorems"
    ]
  },
  {
    "id": "m6",
    "subject": "Mathematics",
    "topic": "Algebra",
    "subtopic": "Logarithms",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "If log 2 = 0.3010 and log 3 = 0.4771, evaluate log 1.2 without tables.",
    "options": {
      "A": "0.0791",
      "B": "0.7918",
      "C": "0.0792",
      "D": "0.1200"
    },
    "answer": "A",
    "explanation": "log 1.2 = log(12 / 10) = log 12 - log 10\nSince 12 = 2² * 3, we have:\nlog 12 = log(2² * 3) = 2 log 2 + log 3\nlog 12 = 2(0.3010) + 0.4771 = 0.6020 + 0.4771 = 1.0791.\nNow, log 1.2 = log 12 - log 10 = 1.0791 - 1 = 0.0791.",
    "difficulty": "hard",
    "tags": [
      "algebra",
      "logarithms"
    ]
  },
  {
    "id": "m7",
    "subject": "Mathematics",
    "topic": "Coordinate Geometry",
    "subtopic": "Straight Lines",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Find the gradient of the line passing through the points P(-2, 3) and Q(4, -1).",
    "options": {
      "A": "-2/3",
      "B": "2/3",
      "C": "-3/2",
      "D": "3/2"
    },
    "answer": "A",
    "explanation": "Gradient (m) = (y₂ - y₁) / (x₂ - x₁)\nHere, (x₁, y₁) = (-2, 3) and (x₂, y₂) = (4, -1).\nm = (-1 - 3) / (4 - (-2)) = -4 / (4 + 2) = -4 / 6 = -2/3.",
    "difficulty": "easy",
    "tags": [
      "coordinate-geometry",
      "gradient"
    ]
  },
  {
    "id": "m8",
    "subject": "Mathematics",
    "topic": "Number and Numeration",
    "subtopic": "Sequence and Series (AP)",
    "year": 2014,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "The 4th term of an Arithmetic Progression (AP) is 13 and the 10th term is 31. Find the first term (a) and common difference (d).",
    "options": {
      "A": "a = 4, d = 3",
      "B": "a = 3, d = 4",
      "C": "a = 5, d = 3",
      "D": "a = 3, d = 3"
    },
    "answer": "A",
    "explanation": "The formula for the nth term of an AP is: T_n = a + (n - 1)d.\nFor 4th term: a + 3d = 13  (Eq 1)\nFor 10th term: a + 9d = 31 (Eq 2)\nSubtract Eq 1 from Eq 2:\n6d = 18 => d = 3.\nSubstitute d = 3 into Eq 1:\na + 3(3) = 13 => a + 9 = 13 => a = 4.\nSo, a = 4 and d = 3.",
    "difficulty": "medium",
    "tags": [
      "sequence-and-series",
      "ap"
    ]
  },
  {
    "id": "m9",
    "subject": "Mathematics",
    "topic": "Trigonometry",
    "subtopic": "Sine and Cosine Rules",
    "year": 2013,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "In a triangle ABC, side a = 5cm, side b = 7cm and angle C = 60°. Find side c.",
    "options": {
      "A": "√39 cm",
      "B": "39 cm",
      "C": "√74 cm",
      "D": "6 cm"
    },
    "answer": "A",
    "explanation": "Using the Cosine Rule: c² = a² + b² - 2ab cos(C)\nc² = 5² + 7² - 2(5)(7) cos(60°)\nc² = 25 + 49 - 70(0.5)\nc² = 74 - 35 = 39\nc = √39 cm.",
    "difficulty": "hard",
    "tags": [
      "trigonometry",
      "cosine-rule"
    ]
  },
  {
    "id": "m10",
    "subject": "Mathematics",
    "topic": "Mensuration",
    "subtopic": "Volumes of Solids",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the total surface area of a closed cylinder of radius 7cm and height 10cm. (Take π = 22/7)",
    "options": {
      "A": "748 cm²",
      "B": "440 cm²",
      "C": "594 cm²",
      "D": "154 cm²"
    },
    "answer": "A",
    "explanation": "Total Surface Area of a closed cylinder = 2πr(r + h)\nTSA = 2 * (22/7) * 7 * (7 + 10)\nTSA = 44 * 17 = 748 cm².",
    "difficulty": "medium",
    "tags": [
      "mensuration",
      "cylinder"
    ]
  },
  {
    "id": "m11",
    "subject": "Mathematics",
    "topic": "Algebra",
    "subtopic": "Indices",
    "year": 2011,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Evaluate: (27)^(2/3) * (64)^(-1/3)",
    "options": {
      "A": "9/4",
      "B": "3/4",
      "C": "9/2",
      "D": "1/4"
    },
    "answer": "A",
    "explanation": "(27)^(2/3) = (3³)^(2/3) = 3² = 9.\n(64)^(-1/3) = (4³)^(-1/3) = 4^(-1) = 1/4.\nTherefore, 9 * (1/4) = 9/4.",
    "difficulty": "easy",
    "tags": [
      "algebra",
      "indices"
    ]
  },
  {
    "id": "m12",
    "subject": "Mathematics",
    "topic": "Number and Numeration",
    "subtopic": "Sets",
    "year": 2012,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "In a class of 50 students, 30 play football, 22 play basketball, and 10 play both games. How many students play neither of the games?",
    "options": {
      "A": "8",
      "B": "12",
      "C": "10",
      "D": "6"
    },
    "answer": "A",
    "explanation": "Using Venn Diagram formula:\nn(F ∪ B) = n(F) + n(B) - n(F ∩ B)\nn(F ∪ B) = 30 + 22 - 10 = 42\nStudents playing neither game = Total students - n(F ∪ B) = 50 - 42 = 8.",
    "difficulty": "medium",
    "tags": [
      "sets",
      "probability"
    ]
  },
  {
    "id": "m13",
    "subject": "Mathematics",
    "topic": "Statistics",
    "subtopic": "Probability",
    "year": 2023,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A bag contains 5 red, 3 blue, and 2 green balls. If a ball is drawn at random, what is the probability that it is NOT blue?",
    "options": {
      "A": "7/10",
      "B": "3/10",
      "C": "1/2",
      "D": "4/5"
    },
    "answer": "A",
    "explanation": "Total balls = 5 + 3 + 2 = 10.\nNumber of balls that are NOT blue = Red balls + Green balls = 5 + 2 = 7.\nProbability (not blue) = 7 / 10.",
    "difficulty": "easy",
    "tags": [
      "statistics",
      "probability"
    ]
  },
  {
    "id": "m14",
    "subject": "Mathematics",
    "topic": "Geometry",
    "subtopic": "Polygons",
    "year": 2010,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the size of an interior angle of a regular octagon.",
    "options": {
      "A": "135°",
      "B": "45°",
      "C": "120°",
      "D": "108°"
    },
    "answer": "A",
    "explanation": "Sum of interior angles of a polygon = (n - 2) * 180°.\nFor an octagon (n = 8):\nSum = (8 - 2) * 180° = 6 * 180° = 1080°.\nSince it is a regular octagon, all 8 interior angles are equal.\nEach Interior Angle = 1080° / 8 = 135°.",
    "difficulty": "medium",
    "tags": [
      "geometry",
      "polygons"
    ]
  },
  {
    "id": "m15",
    "subject": "Mathematics",
    "topic": "Algebra",
    "subtopic": "Variation",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "x varies inversely as the square of y. If x = 4 when y = 3, find x when y = 6.",
    "options": {
      "A": "1",
      "B": "2",
      "C": "1/2",
      "D": "4"
    },
    "answer": "A",
    "explanation": "Inverse variation: x = k / y².\nFind k: 4 = k / 3² => 4 = k / 9 => k = 36.\nSo, formula is x = 36 / y².\nWhen y = 6:\nx = 36 / 6² = 36 / 36 = 1.",
    "difficulty": "medium",
    "tags": [
      "algebra",
      "variation"
    ]
  },
  {
    "id": "m16",
    "subject": "Mathematics",
    "topic": "Coordinate Geometry",
    "subtopic": "Midpoint",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Find the midpoint of the line segment joining the points A(-5, 4) and B(3, -2).",
    "options": {
      "A": "(-1, 1)",
      "B": "(-1, -1)",
      "C": "(1, 1)",
      "D": "(-4, 1)"
    },
    "answer": "A",
    "explanation": "Midpoint coordinates M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2).\nHere, (x₁, y₁) = (-5, 4) and (x₂, y₂) = (3, -2).\nM = ((-5 + 3) / 2, (4 + (-2)) / 2) = (-2 / 2, 2 / 2) = (-1, 1).",
    "difficulty": "easy",
    "tags": [
      "coordinate-geometry",
      "midpoint"
    ]
  },
  {
    "id": "m17",
    "subject": "Mathematics",
    "topic": "Number and Numeration",
    "subtopic": "Percentages",
    "year": 2018,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A trader sells an article for ₦1,250 making a profit of 25%. What was the cost price of the article?",
    "options": {
      "A": "₦1,000",
      "B": "₦937.50",
      "C": "₦1,562.50",
      "D": "₦800"
    },
    "answer": "A",
    "explanation": "Selling Price (SP) = Cost Price (CP) * (100% + Profit%)\n₦1,250 = CP * 1.25\nCP = ₦1,250 / 1.25 = ₦1,000.",
    "difficulty": "easy",
    "tags": [
      "arithmetic",
      "percentage-profit"
    ]
  },
  {
    "id": "m18",
    "subject": "Mathematics",
    "topic": "Algebra",
    "subtopic": "Inequalities",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Solve the inequality: 3(x - 2) < 2x + 5.",
    "options": {
      "A": "x < 11",
      "B": "x < -1",
      "C": "x > 11",
      "D": "x < 1"
    },
    "answer": "A",
    "explanation": "Expand the bracket:\n3x - 6 < 2x + 5\nSubtract 2x from both sides:\nx - 6 < 5\nAdd 6 to both sides:\nx < 11.",
    "difficulty": "easy",
    "tags": [
      "algebra",
      "inequalities"
    ]
  },
  {
    "id": "m19",
    "subject": "Mathematics",
    "topic": "Trigonometry",
    "subtopic": "Identities",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "If cos θ = 4/5 and θ is acute, evaluate (tan θ) / (sin θ).",
    "options": {
      "A": "5/4",
      "B": "5/3",
      "C": "3/4",
      "D": "5/12"
    },
    "answer": "A",
    "explanation": "Since tan θ = sin θ / cos θ, then:\n(tan θ) / (sin θ) = (sin θ / cos θ) / sin θ = 1 / cos θ.\nSince cos θ = 4/5, we have:\n1 / cos θ = 5/4.",
    "difficulty": "medium",
    "tags": [
      "trigonometry",
      "identities"
    ]
  },
  {
    "id": "m20",
    "subject": "Mathematics",
    "topic": "Mensuration",
    "subtopic": "Sector of a Circle",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Find the area of a sector of a circle of radius 6cm which subtends an angle of 70° at the center. (Take π = 22/7)",
    "options": {
      "A": "22 cm²",
      "B": "44 cm²",
      "C": "11 cm²",
      "D": "132 cm²"
    },
    "answer": "A",
    "explanation": "Area of Sector = (θ / 360) * πr²\nArea = (70 / 360) * (22 / 7) * 6²\nArea = (70 / 360) * (22 / 7) * 36\nArea = (70 / 10) * (22 / 7) = 7 * (22 / 7) = 22 cm².",
    "difficulty": "medium",
    "tags": [
      "mensuration",
      "circle-sector"
    ]
  },
  {
    "id": "e1",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Lexis and Structure",
    "year": 2020,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the word that is opposite in meaning to the underlined word: The manager was quite **<u>lenient</u>** with the latecomer.",
    "options": {
      "A": "strict",
      "B": "friendly",
      "C": "generous",
      "D": "careless"
    },
    "answer": "A",
    "explanation": "'Lenient' means mild, merciful, or tolerant. The antonym (opposite in meaning) is 'strict', which means demanding close conformity to rules and regulations.",
    "difficulty": "easy",
    "tags": [
      "antonym",
      "vocabulary"
    ]
  },
  {
    "id": "e2",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Subject-Verb Agreement",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the option that best completes the sentence: Either the teacher or the students ________ responsible for the decoration.",
    "options": {
      "A": "are",
      "B": "is",
      "C": "was",
      "D": "has been"
    },
    "answer": "A",
    "explanation": "When a sentence contains correlative conjunctions like 'either... or' or 'neither... nor', the verb agrees with the closer subject. Here, 'students' (plural) is closer to the verb than 'teacher' (singular), so the plural verb 'are' is correct.",
    "difficulty": "medium",
    "tags": [
      "concord",
      "subject-verb-agreement"
    ]
  },
  {
    "id": "e3",
    "subject": "English Language",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the option that is nearest in meaning to the underlined word: The court passed an **<u>arbitrary</u>** decision.",
    "options": {
      "A": "biased",
      "B": "reasonable",
      "C": "unjust",
      "D": "lawful"
    },
    "answer": "A",
    "explanation": "'Arbitrary' refers to a decision made on personal whims rather than reason or justice. Hence, 'biased' or 'unreasonable' is nearest. In general synonym lists, 'biased' (prejudiced or unfair) captures the core unfair/whimsical nature best in a judgment context.",
    "difficulty": "hard",
    "tags": [
      "synonym",
      "vocabulary"
    ]
  },
  {
    "id": "e4",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Prepositions",
    "year": 2018,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Complete the sentence: The Principal congratulated the students ________ their excellent exam results.",
    "options": {
      "A": "on",
      "B": "for",
      "C": "about",
      "D": "at"
    },
    "answer": "A",
    "explanation": "The verb 'congratulate' is idiomatically followed by the preposition 'on'. You congratulate someone 'on' an achievement, not 'for' it.",
    "difficulty": "easy",
    "tags": [
      "prepositions",
      "idioms"
    ]
  },
  {
    "id": "e5",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Question Tags",
    "year": 2017,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the correct tag: She barely ever goes to church, ________?",
    "options": {
      "A": "does she",
      "B": "doesn't she",
      "C": "is she",
      "D": "has she"
    },
    "answer": "A",
    "explanation": "The word 'barely' is a negative adverb. In tag questions, if the statement is negative, the question tag must be positive. Since 'goes' is present tense, the positive tag is 'does she?'.",
    "difficulty": "medium",
    "tags": [
      "question-tags",
      "grammar"
    ]
  },
  {
    "id": "e6",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Idiomatic Expressions",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the meaning of the underlined phrase: The new employee was told to **<u>pull up his socks</u>** if he wanted to keep his job.",
    "options": {
      "A": "improve his behavior or work",
      "B": "dress professionally",
      "C": "arrive early at work",
      "D": "respect his supervisors"
    },
    "answer": "A",
    "explanation": "The idiom 'pull up one's socks' means to make an effort to improve one's work, performance, or behavior.",
    "difficulty": "easy",
    "tags": [
      "idioms",
      "vocabulary"
    ]
  },
  {
    "id": "e7",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Tenses",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the correct option: By the time the police arrived, the thieves ________.",
    "options": {
      "A": "had escaped",
      "B": "escaped",
      "C": "have escaped",
      "D": "were escaping"
    },
    "answer": "A",
    "explanation": "When referencing two completed past actions, the one that happened first takes the Past Perfect tense ('had' + past participle), while the subsequent one takes the Simple Past. Since the thieves escaped *before* the police arrived, 'had escaped' is correct.",
    "difficulty": "medium",
    "tags": [
      "tenses",
      "past-perfect"
    ]
  },
  {
    "id": "e8",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Pronouns",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the correct option: Between you and ________, I do not trust the new accountant.",
    "options": {
      "A": "me",
      "B": "I",
      "C": "myself",
      "D": "we"
    },
    "answer": "A",
    "explanation": "The preposition 'between' must be followed by objective pronouns (e.g., 'me', 'him', 'her', 'them'). Therefore, 'Between you and me' is grammatically correct.",
    "difficulty": "hard",
    "tags": [
      "pronouns",
      "grammar"
    ]
  },
  {
    "id": "e9",
    "subject": "English Language",
    "topic": "Vocabulary",
    "subtopic": "Synonyms",
    "year": 2014,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the option nearest in meaning to the underlined word: The student gave a **<u>candid</u>** opinion about the teacher's lesson.",
    "options": {
      "A": "honest",
      "B": "rude",
      "C": "clever",
      "D": "doubtful"
    },
    "answer": "A",
    "explanation": "'Candid' means truthful, open, straightforward, or frank. Therefore, 'honest' is the closest synonym.",
    "difficulty": "easy",
    "tags": [
      "synonym",
      "vocabulary"
    ]
  },
  {
    "id": "e10",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Modals",
    "year": 2023,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the correct option to fill the blank: You ________ not drive without a valid driver's license; it is against the law.",
    "options": {
      "A": "must",
      "B": "need",
      "C": "may",
      "D": "should"
    },
    "answer": "A",
    "explanation": "'Must' is used to indicate strict obligation or prohibition by law. 'Must not' expresses that something is illegal and strictly forbidden.",
    "difficulty": "easy",
    "tags": [
      "modals",
      "grammar"
    ]
  },
  {
    "id": "e11",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Direct and Indirect Speech",
    "year": 2013,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Change the sentence to indirect speech: 'I am writing a test now,' Ngozi said.",
    "options": {
      "A": "Ngozi said that she was writing a test then.",
      "B": "Ngozi said that she is writing a test now.",
      "C": "Ngozi said that she was writing a test now.",
      "D": "Ngozi said she is writing a test then."
    },
    "answer": "A",
    "explanation": "In converting direct speech to indirect speech: present continuous tense 'am writing' shifts to past continuous 'was writing', and time expressions like 'now' shift to 'then'.",
    "difficulty": "medium",
    "tags": [
      "reported-speech",
      "grammar"
    ]
  },
  {
    "id": "e12",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Adjectives",
    "year": 2012,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the best order of adjectives: The lady bought a ________ bag.",
    "options": {
      "A": "beautiful small black leather",
      "B": "black small beautiful leather",
      "C": "small beautiful leather black",
      "D": "leather beautiful small black"
    },
    "answer": "A",
    "explanation": "The standard order of adjectives in English is: Opinion, Size, Physical Quality, Shape, Age, Color, Origin, Material, Type, Purpose. Here: 'beautiful' (opinion) -> 'small' (size) -> 'black' (color) -> 'leather' (material). Hence, 'beautiful small black leather' is correct.",
    "difficulty": "hard",
    "tags": [
      "adjectives",
      "word-order"
    ]
  },
  {
    "id": "e13",
    "subject": "English Language",
    "topic": "Vocabulary",
    "subtopic": "Spelling",
    "year": 2011,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Identify the word that is correctly spelled.",
    "options": {
      "A": "Embarrassment",
      "B": "Embarasment",
      "C": "Emberrassment",
      "D": "Embarassment"
    },
    "answer": "A",
    "explanation": "The correct spelling is 'Embarrassment', with double 'r' and double 's'.",
    "difficulty": "medium",
    "tags": [
      "spelling",
      "vocabulary"
    ]
  },
  {
    "id": "e14",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Active and Passive Voice",
    "year": 2010,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the passive voice equivalent of: The chef prepared a delicious meal.",
    "options": {
      "A": "A delicious meal was prepared by the chef.",
      "B": "A delicious meal has been prepared by the chef.",
      "C": "A delicious meal prepared by the chef.",
      "D": "A delicious meal was being prepared by the chef."
    },
    "answer": "A",
    "explanation": "In simple past active tense ('prepared'), the passive shifts to 'was/were' + past participle ('was prepared'). Thus, 'A delicious meal was prepared by the chef' is correct.",
    "difficulty": "easy",
    "tags": [
      "voice",
      "passive-voice"
    ]
  },
  {
    "id": "e15",
    "subject": "English Language",
    "topic": "Vocabulary",
    "subtopic": "Antonyms",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the word opposite in meaning to the underlined word: The climate in the desert is extremely **<u>hostile</u>**.",
    "options": {
      "A": "hospitable",
      "B": "dry",
      "C": "severe",
      "D": "warm"
    },
    "answer": "A",
    "explanation": "'Hostile' means unfriendly, harsh, or unfavorable. The antonym is 'hospitable', which means welcoming, friendly, or favorable.",
    "difficulty": "easy",
    "tags": [
      "antonym",
      "vocabulary"
    ]
  },
  {
    "id": "e16",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Relative Clauses",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the correct option: The man ________ car was stolen yesterday has reported to the police.",
    "options": {
      "A": "whose",
      "B": "whom",
      "C": "who's",
      "D": "which"
    },
    "answer": "A",
    "explanation": "'Whose' is a possessive relative pronoun indicating ownership. It connects 'the man' to his stolen 'car'. 'Who's' is a contraction of 'who is' or 'who has', which does not fit here.",
    "difficulty": "easy",
    "tags": [
      "pronouns",
      "grammar"
    ]
  },
  {
    "id": "e17",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Conjunctions",
    "year": 2018,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the correct option to fill the blank: He succeeded ________ he had many obstacles in his way.",
    "options": {
      "A": "although",
      "B": "despite",
      "C": "because",
      "D": "unless"
    },
    "answer": "A",
    "explanation": "'Although' is a subordinating conjunction used to introduce a clause of concession. 'Despite' means the same but is a preposition and must be followed by a noun phrase, not a full subject-verb clause.",
    "difficulty": "medium",
    "tags": [
      "conjunctions",
      "clauses"
    ]
  },
  {
    "id": "e18",
    "subject": "English Language",
    "topic": "Vocabulary",
    "subtopic": "Register (Education)",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the term that best defines: A school certificate or degree received upon completion of studies.",
    "options": {
      "A": "credentials",
      "B": "curriculum",
      "C": "transcript",
      "D": "syllabus"
    },
    "answer": "A",
    "explanation": "A school certificate, degree, or other document proving a person's qualifications constitutes their 'credentials'.",
    "difficulty": "medium",
    "tags": [
      "register",
      "vocabulary"
    ]
  },
  {
    "id": "e19",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Lexis and Structure",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the option that is nearest in meaning to the underlined word: The old building is in a state of **<u>decrepitude</u>**.",
    "options": {
      "A": "decay",
      "B": "strength",
      "C": "renovation",
      "D": "beauty"
    },
    "answer": "A",
    "explanation": "'Decrepitude' means a state of being worn out, ruined, or broken down by age or neglect. 'Decay' or 'ruin' is the nearest in meaning.",
    "difficulty": "hard",
    "tags": [
      "synonym",
      "vocabulary"
    ]
  },
  {
    "id": "e20",
    "subject": "English Language",
    "topic": "Grammar",
    "subtopic": "Conditionals",
    "year": 2023,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the option that best completes the sentence: If I had known about the party earlier, I ________.",
    "options": {
      "A": "would have attended",
      "B": "will attend",
      "C": "would attend",
      "D": "should attend"
    },
    "answer": "A",
    "explanation": "This is a Third Conditional sentence, which describes an unfulfilled condition in the past. The structures are 'If + past perfect' in the condition clause, and 'would have + past participle' in the main clause. Hence, 'would have attended' is correct.",
    "difficulty": "medium",
    "tags": [
      "conditionals",
      "grammar"
    ]
  },
  {
    "id": "b1",
    "subject": "Biology",
    "topic": "Ecology",
    "subtopic": "Food Chains",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which organism is a primary producer in a food chain?",
    "options": {
      "A": "Grasshopper",
      "B": "Green plant",
      "C": "Lion",
      "D": "Frog"
    },
    "answer": "B",
    "explanation": "Green plants are primary producers because they make their own food through photosynthesis using sunlight, water, and carbon dioxide.",
    "difficulty": "easy",
    "tags": [
      "ecology",
      "photosynthesis",
      "food-chain"
    ]
  },
  {
    "id": "b2",
    "subject": "Biology",
    "topic": "Cell Biology",
    "subtopic": "Cell Structure and Organelles",
    "year": 2020,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which cellular organelle is responsible for cellular respiration and energy (ATP) production?",
    "options": {
      "A": "Mitochondrion",
      "B": "Ribosome",
      "C": "Chloroplast",
      "D": "Nucleus"
    },
    "answer": "A",
    "explanation": "The mitochondrion is known as the powerhouse of the cell because it is the site of aerobic cellular respiration, which breaks down glucose to generate adenosine triphosphate (ATP) as energy.",
    "difficulty": "easy",
    "tags": [
      "cells",
      "organelles"
    ]
  },
  {
    "id": "b3",
    "subject": "Biology",
    "topic": "Genetics",
    "subtopic": "Inheritance and Traits",
    "year": 2018,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "If a homozygous tall plant (TT) is crossed with a homozygous short plant (tt), what percentage of the F1 generation offspring will be tall?",
    "options": {
      "A": "100%",
      "B": "75%",
      "C": "50%",
      "D": "25%"
    },
    "answer": "A",
    "explanation": "When crossing TT and tt, all F1 offspring will be heterozygous tall (Tt). Since 'T' (tall) is dominant over 't' (short), 100% of the plants will express the tall phenotype.",
    "difficulty": "medium",
    "tags": [
      "genetics",
      "inheritance",
      "crosses"
    ]
  },
  {
    "id": "b4",
    "subject": "Biology",
    "topic": "Human Anatomy & Physiology",
    "subtopic": "Circulatory System",
    "year": 2017,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which blood vessel transports oxygenated blood from the lungs back to the left atrium of the heart?",
    "options": {
      "A": "Pulmonary vein",
      "B": "Pulmonary artery",
      "C": "Aorta",
      "D": "Vena cava"
    },
    "answer": "A",
    "explanation": "Although most veins carry deoxygenated blood, the pulmonary vein is a unique exception. It carries freshly oxygenated blood from the lungs back to the left atrium of the heart.",
    "difficulty": "medium",
    "tags": [
      "circulatory-system",
      "heart"
    ]
  },
  {
    "id": "b5",
    "subject": "Biology",
    "topic": "Evolution & Adaptation",
    "subtopic": "Natural Selection",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Who is considered the father of the theory of evolution by natural selection?",
    "options": {
      "A": "Charles Darwin",
      "B": "Gregor Mendel",
      "C": "Jean-Baptiste Lamarck",
      "D": "Louis Pasteur"
    },
    "answer": "A",
    "explanation": "Charles Darwin formulated and published the scientific theory of evolution by natural selection in his 1859 book, 'On the Origin of Species'.",
    "difficulty": "easy",
    "tags": [
      "evolution",
      "natural-selection"
    ]
  },
  {
    "id": "b6",
    "subject": "Biology",
    "topic": "Human Anatomy & Physiology",
    "subtopic": "Excretory System",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the functional structural unit of the human kidney?",
    "options": {
      "A": "Nephron",
      "B": "Neuron",
      "C": "Alveolus",
      "D": "Ureter"
    },
    "answer": "A",
    "explanation": "The nephron is the microscopic, structural, and functional unit of the kidney responsible for filtering blood, reabsorbing essential nutrients, and producing urine. A neuron is a nerve cell.",
    "difficulty": "easy",
    "tags": [
      "excretory-system",
      "kidney"
    ]
  },
  {
    "id": "b7",
    "subject": "Biology",
    "topic": "Plant Biology & Physiology",
    "subtopic": "Photosynthesis",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which pigment inside plant leaves absorbs light energy during the process of photosynthesis?",
    "options": {
      "A": "Chlorophyll",
      "B": "Carotenoid",
      "C": "Xanthophyll",
      "D": "Anthocyanin"
    },
    "answer": "A",
    "explanation": "Chlorophyll is the green pigment located within the chloroplasts of plant cells that absorbs light (mainly blue and red wavelengths) to power the light-dependent reactions of photosynthesis.",
    "difficulty": "easy",
    "tags": [
      "photosynthesis",
      "plants"
    ]
  },
  {
    "id": "b8",
    "subject": "Biology",
    "topic": "Human Anatomy & Physiology",
    "subtopic": "Skeletal System",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which type of joint permits movement in only one plane, such as that in the elbow and knee?",
    "options": {
      "A": "Hinge joint",
      "B": "Ball-and-socket joint",
      "C": "Gliding joint",
      "D": "Pivot joint"
    },
    "answer": "A",
    "explanation": "A hinge joint allows for movement back and forth in a single plane, much like the hinges on a door. Common examples are the human elbow, knee, and ankle joints.",
    "difficulty": "easy",
    "tags": [
      "skeletal-system",
      "joints"
    ]
  },
  {
    "id": "b9",
    "subject": "Biology",
    "topic": "Ecology",
    "subtopic": "Biomes & Habitats",
    "year": 2014,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which ecosystem biome is characterized by low rainfall, extremely high daytime temperatures, and succulent plants like cacti?",
    "options": {
      "A": "Desert",
      "B": "Tropical rainforest",
      "C": "Savanna",
      "D": "Tundra"
    },
    "answer": "A",
    "explanation": "Deserts are arid biomes with very sparse rainfall (less than 25cm annually), intense heat during the day, and flora adapted for water conservation, such as succulents and cacti.",
    "difficulty": "easy",
    "tags": [
      "ecology",
      "biomes"
    ]
  },
  {
    "id": "b10",
    "subject": "Biology",
    "topic": "Genetics",
    "subtopic": "Sex Linkage",
    "year": 2023,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which of the following genetic diseases in humans is a sex-linked trait carried on the X chromosome?",
    "options": {
      "A": "Haemophilia",
      "B": "Sickle Cell Anaemia",
      "C": "Down Syndrome",
      "D": "Albinism"
    },
    "answer": "A",
    "explanation": "Haemophilia is a sex-linked recessive genetic disorder. The gene causing it is located on the X chromosome, meaning males (who have only one X chromosome) are much more commonly affected.",
    "difficulty": "medium",
    "tags": [
      "genetics",
      "sex-linked"
    ]
  },
  {
    "id": "b11",
    "subject": "Biology",
    "topic": "Plant Biology & Physiology",
    "subtopic": "Plant Transport",
    "year": 2013,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which specialized vascular tissue in plants is responsible for transporting manufactured organic food from the leaves to other parts of the plant?",
    "options": {
      "A": "Phloem",
      "B": "Xylem",
      "C": "Cortex",
      "D": "Pith"
    },
    "answer": "A",
    "explanation": "Phloem is the vascular tissue in charge of translocation: transporting soluble organic compounds, specifically sucrose made during photosynthesis, from source to sink. Xylem transports water.",
    "difficulty": "medium",
    "tags": [
      "plants",
      "transport-tissue"
    ]
  },
  {
    "id": "b12",
    "subject": "Biology",
    "topic": "Microorganisms & Diseases",
    "subtopic": "Pathogens & Vectors",
    "year": 2012,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the primary causative pathogen of malaria, which is transmitted by the female Anopheles mosquito vector?",
    "options": {
      "A": "Plasmodium protozoan",
      "B": "Amoeba",
      "C": "Trypanosome",
      "D": "Influenza virus"
    },
    "answer": "A",
    "explanation": "Malaria is caused by single-celled protozoan parasites of the genus Plasmodium. The parasite is transmitted to humans through the bites of infected female Anopheles mosquitoes.",
    "difficulty": "easy",
    "tags": [
      "microorganisms",
      "diseases"
    ]
  },
  {
    "id": "b13",
    "subject": "Biology",
    "topic": "Human Anatomy & Physiology",
    "subtopic": "Nervous System",
    "year": 2011,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which specific section of the human brain controls vital, involuntary functions like heartbeat, breathing rate, and blood pressure?",
    "options": {
      "A": "Medulla oblongata",
      "B": "Cerebrum",
      "C": "Cerebellum",
      "D": "Hypothalamus"
    },
    "answer": "A",
    "explanation": "The medulla oblongata, located at the lowest part of the brainstem, controls key involuntary autonomic functions such as breathing, cardiac regulation (heartbeat), and blood pressure.",
    "difficulty": "medium",
    "tags": [
      "nervous-system",
      "brain"
    ]
  },
  {
    "id": "b14",
    "subject": "Biology",
    "topic": "Ecology",
    "subtopic": "Carbon & Nitrogen Cycles",
    "year": 2010,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which group of bacteria converts atmospheric nitrogen into nitrites and nitrates inside soil, making it absorbable by plants?",
    "options": {
      "A": "Nitrifying bacteria",
      "B": "Denitrifying bacteria",
      "C": "Putrefying bacteria",
      "D": "Decomposing bacteria"
    },
    "answer": "A",
    "explanation": "Nitrifying bacteria (like Nitrosomonas and Nitrobacter) oxidize ammonia into nitrites, and then nitrites into nitrates. This process, nitrification, makes nitrogen usable by plant roots.",
    "difficulty": "hard",
    "tags": [
      "ecology",
      "nitrogen-cycle"
    ]
  },
  {
    "id": "b15",
    "subject": "Biology",
    "topic": "Plant Biology & Physiology",
    "subtopic": "Plant Growth",
    "year": 2018,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the directional growth response of plant shoots towards light called?",
    "options": {
      "A": "Positive phototropism",
      "B": "Negative phototropism",
      "C": "Positive geotropism",
      "D": "Thigmotropism"
    },
    "answer": "A",
    "explanation": "Phototropism is a plant's growth response to light. Shoots grow *towards* a light source, displaying positive phototropism, whereas roots typically grow away, showing negative phototropism.",
    "difficulty": "easy",
    "tags": [
      "plants",
      "hormones",
      "growth"
    ]
  },
  {
    "id": "b16",
    "subject": "Biology",
    "topic": "Human Anatomy & Physiology",
    "subtopic": "Digestive System",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which organ in the human digestive system produces bile, which aids in the emulsification of fats?",
    "options": {
      "A": "Liver",
      "B": "Gallbladder",
      "C": "Pancreas",
      "D": "Stomach"
    },
    "answer": "A",
    "explanation": "Bile is produced by the liver cells (hepatocytes) and is stored and concentrated in the gallbladder until it is secreted into the small intestine to emulsify lipids.",
    "difficulty": "medium",
    "tags": [
      "digestive-system",
      "liver"
    ]
  },
  {
    "id": "b17",
    "subject": "Biology",
    "topic": "Human Anatomy & Physiology",
    "subtopic": "Endocrine System",
    "year": 2017,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which hormone is secreted by the pancreas to lower blood glucose levels after a meal?",
    "options": {
      "A": "Insulin",
      "B": "Glucagon",
      "C": "Adrenaline",
      "D": "Thyroxine"
    },
    "answer": "A",
    "explanation": "Insulin is a hormone produced by the beta cells of the pancreatic islets. It reduces blood glucose concentration by promoting glucose uptake in cells and glycogen synthesis in the liver.",
    "difficulty": "easy",
    "tags": [
      "hormones",
      "endocrine"
    ]
  },
  {
    "id": "b18",
    "subject": "Biology",
    "topic": "Classification & Diversity",
    "subtopic": "Five Kingdoms",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "To which of the five kingdoms of living organisms do bacteria belong?",
    "options": {
      "A": "Monera",
      "B": "Protista",
      "C": "Fungi",
      "D": "Plantae"
    },
    "answer": "A",
    "explanation": "Kingdom Monera contains all single-celled prokaryotic organisms, which include true bacteria and blue-green algae (cyanobacteria). Prokaryotes lack a true membrane-bound nucleus.",
    "difficulty": "easy",
    "tags": [
      "classification",
      "monera"
    ]
  },
  {
    "id": "b19",
    "subject": "Biology",
    "topic": "Human Anatomy & Physiology",
    "subtopic": "Sensory Organs",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the medical name for short-sightedness, where close objects appear clear but distant ones are blurry?",
    "options": {
      "A": "Myopia",
      "B": "Hypermetropia",
      "C": "Astigmatism",
      "D": "Presbyopia"
    },
    "answer": "A",
    "explanation": "Myopia is the medical term for short-sightedness. Distant light rays focus in front of the retina rather than on it. It is corrected using concave (diverging) lenses.",
    "difficulty": "medium",
    "tags": [
      "eye",
      "sensory-organs"
    ]
  },
  {
    "id": "b20",
    "subject": "Biology",
    "topic": "Cell Biology",
    "subtopic": "Cell Division",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which type of cell division results in four non-identical haploid daughter cells, as seen in gamete production?",
    "options": {
      "A": "Meiosis",
      "B": "Mitosis",
      "C": "Binary fission",
      "D": "Budding"
    },
    "answer": "A",
    "explanation": "Meiosis is a reduction division that reduces the chromosome number by half. It goes through two nuclear divisions, resulting in four genetically distinct haploid daughter cells (sperm or egg). Mitosis results in two identical diploid cells.",
    "difficulty": "medium",
    "tags": [
      "cells",
      "meiosis",
      "division"
    ]
  },
  {
    "id": "c1",
    "subject": "Chemistry",
    "topic": "Organic Chemistry",
    "subtopic": "Hydrocarbons",
    "year": 2018,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the general formula for the homologous series of alkanes?",
    "options": {
      "A": "C_n H_(2n+2)",
      "B": "C_n H_2n",
      "C": "C_n H_(2n-2)",
      "D": "C_n H_(2n+1)"
    },
    "answer": "A",
    "explanation": "Alkanes are saturated hydrocarbons containing only single covalent bonds. Their general molecular formula is C_n H_(2n+2), where n represents the number of carbon atoms.",
    "difficulty": "easy",
    "tags": [
      "organic-chemistry",
      "alkanes",
      "hydrocarbons"
    ]
  },
  {
    "id": "c2",
    "subject": "Chemistry",
    "topic": "Atomic Structure & Periodic Table",
    "subtopic": "Atomic Structure",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "An element X has an atomic number of 17. In which group and period of the periodic table does X belong?",
    "options": {
      "A": "Group VII, Period 3",
      "B": "Group V, Period 3",
      "C": "Group VII, Period 2",
      "D": "Group I, Period 3"
    },
    "answer": "A",
    "explanation": "Atomic number 17 corresponds to Chlorine (Cl). The electronic configuration is 2, 8, 7.\nThe number of shells determines the Period (3 shells = Period 3).\nThe number of valence electrons determines the Group (7 valence electrons = Group VII).",
    "difficulty": "medium",
    "tags": [
      "periodic-table",
      "configuration"
    ]
  },
  {
    "id": "c3",
    "subject": "Chemistry",
    "topic": "Gas Laws",
    "subtopic": "Charles' Law",
    "year": 2017,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "According to Charles' Law, the volume of a given mass of gas is directly proportional to its absolute temperature at constant pressure. If a gas has a volume of 3.0 dm³ at 300K, what will be its volume at 400K?",
    "options": {
      "A": "4.0 dm³",
      "B": "2.25 dm³",
      "C": "6.0 dm³",
      "D": "4.5 dm³"
    },
    "answer": "A",
    "explanation": "Charles' Law states: V₁/T₁ = V₂/T₂.\nGiven: V₁ = 3.0 dm³, T₁ = 300K, T₂ = 400K.\n3.0 / 300 = V₂ / 400\n0.01 = V₂ / 400\nV₂ = 0.01 * 400 = 4.0 dm³.",
    "difficulty": "easy",
    "tags": [
      "gas-laws",
      "charles-law"
    ]
  },
  {
    "id": "c4",
    "subject": "Chemistry",
    "topic": "Chemical Bonding",
    "subtopic": "Covalent Bonding",
    "year": 2020,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which of the following compounds exhibits pure covalent bonding in its molecular state?",
    "options": {
      "A": "H₂O",
      "B": "NaCl",
      "C": "MgO",
      "D": "CaCl₂"
    },
    "answer": "A",
    "explanation": "Water (H₂O) consists of hydrogen and oxygen (both non-metals) sharing electrons, making it a polar covalent compound. NaCl, MgO, and CaCl₂ consist of metals combined with non-metals, which exhibit ionic bonding.",
    "difficulty": "easy",
    "tags": [
      "bonding",
      "covalent"
    ]
  },
  {
    "id": "c5",
    "subject": "Chemistry",
    "topic": "Acids, Bases, and Salts",
    "subtopic": "pH Scale",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the pH of a 0.001 mol/dm³ solution of hydrochloric acid (HCl). (Assume complete ionization)",
    "options": {
      "A": "3",
      "B": "2",
      "C": "1",
      "D": "4"
    },
    "answer": "A",
    "explanation": "HCl is a strong monobasic acid: HCl -> H⁺ + Cl⁻.\n[H⁺] = 0.001 M = 10⁻³ M.\npH = -log[H⁺] = -log(10⁻³) = 3.",
    "difficulty": "medium",
    "tags": [
      "acids-and-bases",
      "ph",
      "calculation"
    ]
  },
  {
    "id": "c6",
    "subject": "Chemistry",
    "topic": "Stoichiometry & Mole Concept",
    "subtopic": "Mole Calculations",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the mass of sodium carbonate (Na₂CO₃) required to prepare 250 cm³ of a 0.1 mol/dm³ solution. (Relative atomic masses: Na=23, C=12, O=16)",
    "options": {
      "A": "2.65 g",
      "B": "10.6 g",
      "C": "5.3 g",
      "D": "1.325 g"
    },
    "answer": "A",
    "explanation": "Molar Mass of Na₂CO₃ = (23 * 2) + 12 + (16 * 3) = 46 + 12 + 48 = 106 g/mol.\nVolume (V) = 250 cm³ = 0.25 dm³.\nConcentration (C) = 0.1 M.\nMoles (n) = C * V = 0.1 * 0.25 = 0.025 moles.\nMass = moles * molar mass = 0.025 * 106 = 2.65 g.",
    "difficulty": "medium",
    "tags": [
      "stoichiometry",
      "molarity"
    ]
  },
  {
    "id": "c7",
    "subject": "Chemistry",
    "topic": "Chemical Kinetics & Equilibrium",
    "subtopic": "Le Chatelier's Principle",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "In the endothermic reaction: N₂(g) + O₂(g) ⇌ 2NO(g). What effect will an increase in temperature have on the position of the equilibrium?",
    "options": {
      "A": "Shift to the right (produce more NO)",
      "B": "Shift to the left (produce more reactants)",
      "C": "No effect on the equilibrium position",
      "D": "Halt the reaction completely"
    },
    "answer": "A",
    "explanation": "According to Le Chatelier's Principle, for an endothermic reaction (which absorbs heat), an increase in temperature will shift the equilibrium position to the right (product-favoring side) to consume the added heat.",
    "difficulty": "medium",
    "tags": [
      "kinetics",
      "equilibrium"
    ]
  },
  {
    "id": "c8",
    "subject": "Chemistry",
    "topic": "Non-Metals & Compounds",
    "subtopic": "Oxygen and Oxides",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which of the following gaseous oxides turns lime water milky?",
    "options": {
      "A": "Carbon dioxide (CO₂)",
      "B": "Nitrogen dioxide (NO₂)",
      "C": "Sulphur dioxide (SO₂)",
      "D": "Carbon monoxide (CO)"
    },
    "answer": "A",
    "explanation": "Carbon dioxide (CO₂) reacts with lime water (calcium hydroxide) to form an insoluble white precipitate of calcium carbonate (CaCO₃), which makes the solution look milky:\nCa(OH)₂ + CO₂ -> CaCO₃↓ + H₂O.",
    "difficulty": "easy",
    "tags": [
      "oxides",
      "gases",
      "lime-water"
    ]
  },
  {
    "id": "c9",
    "subject": "Chemistry",
    "topic": "Electrochemistry",
    "subtopic": "Electrolysis",
    "year": 2014,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "During the electrolysis of dilute sulphuric acid using platinum electrodes, which gas is liberated at the anode?",
    "options": {
      "A": "Oxygen",
      "B": "Hydrogen",
      "C": "Sulphur dioxide",
      "D": "Chlorine"
    },
    "answer": "A",
    "explanation": "At the anode (positive electrode), OH⁻ ions are preferentially discharged over SO₄²⁻ because they are lower in the electrochemical series.\n4OH⁻ -> 2H₂O + O₂↑ + 4e⁻.\nThus, oxygen gas is liberated at the anode.",
    "difficulty": "medium",
    "tags": [
      "electrochemistry",
      "electrolysis"
    ]
  },
  {
    "id": "c10",
    "subject": "Chemistry",
    "topic": "Organic Chemistry",
    "subtopic": "Alkanols",
    "year": 2023,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the structural formula of the functional group present in all primary alkanols (alcohols)?",
    "options": {
      "A": "-OH",
      "B": "-CHO",
      "C": "-COOH",
      "D": "-CO-"
    },
    "answer": "A",
    "explanation": "The functional group characteristic of all alcohols (alkanols) is the hydroxyl group (-OH). -CHO is for alkanals, -COOH is for alkanoic acids, and -CO- is for alkanones.",
    "difficulty": "easy",
    "tags": [
      "organic-chemistry",
      "alkanols",
      "functional-groups"
    ]
  },
  {
    "id": "c11",
    "subject": "Chemistry",
    "topic": "Atomic Structure & Periodic Table",
    "subtopic": "Isotopes",
    "year": 2013,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Chlorine exists naturally as two isotopes: ³⁵Cl (75%) and ³⁷Cl (25%). Calculate the relative atomic mass of chlorine.",
    "options": {
      "A": "35.5",
      "B": "36.0",
      "C": "35.0",
      "D": "36.5"
    },
    "answer": "A",
    "explanation": "Relative Atomic Mass = (abundance₁ * mass₁) + (abundance₂ * mass₂)\nRAM = (0.75 * 35) + (0.25 * 37) = 26.25 + 9.25 = 35.5.",
    "difficulty": "easy",
    "tags": [
      "atomic-structure",
      "isotopes",
      "calculation"
    ]
  },
  {
    "id": "c12",
    "subject": "Chemistry",
    "topic": "States of Matter & Separations",
    "subtopic": "Separation Techniques",
    "year": 2012,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which separation technique is most suitable for separating a mixture of crude oil into its different fractions?",
    "options": {
      "A": "Fractional distillation",
      "B": "Simple distillation",
      "C": "Chromatography",
      "D": "Filtration"
    },
    "answer": "A",
    "explanation": "Fractional distillation is used to separate a mixture of miscible liquids with close but different boiling points, such as separating crude oil into petroleum fractions (petrol, diesel, kerosene, etc.).",
    "difficulty": "easy",
    "tags": [
      "separations",
      "distillation"
    ]
  },
  {
    "id": "c13",
    "subject": "Chemistry",
    "topic": "Chemical Kinetics & Equilibrium",
    "subtopic": "Catalysis",
    "year": 2011,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the primary role of a catalyst in a chemical reaction?",
    "options": {
      "A": "To lower the activation energy of the reaction",
      "B": "To increase the yields of products",
      "C": "To supply heat energy to start the reaction",
      "D": "To shift the chemical equilibrium position"
    },
    "answer": "A",
    "explanation": "A catalyst provides an alternative reaction pathway with a lower activation energy (E_a). This allows more reactant particles to have successful collisions per unit time, thereby accelerating the reaction.",
    "difficulty": "easy",
    "tags": [
      "kinetics",
      "catalyst"
    ]
  },
  {
    "id": "c14",
    "subject": "Chemistry",
    "topic": "Metals & Extraction",
    "subtopic": "Iron Extraction",
    "year": 2010,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which of the following compounds serves as the reducing agent in the industrial extraction of iron inside a Blast Furnace?",
    "options": {
      "A": "Carbon monoxide (CO)",
      "B": "Carbon dioxide (CO₂)",
      "C": "Coke (C)",
      "D": "Limestone (CaCO₃)"
    },
    "answer": "A",
    "explanation": "Inside a blast furnace, carbon monoxide (CO) gas reduces iron(III) oxide (hematite, Fe₂O₃) to molten iron:\nFe₂O₃(s) + 3CO(g) -> 2Fe(l) + 3CO₂(g).",
    "difficulty": "hard",
    "tags": [
      "metals",
      "blast-furnace"
    ]
  },
  {
    "id": "c15",
    "subject": "Chemistry",
    "topic": "Acids, Bases, and Salts",
    "subtopic": "Salts",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which of the following salts is completely insoluble in cold water?",
    "options": {
      "A": "Lead(II) chloride (PbCl₂)",
      "B": "Sodium chloride (NaCl)",
      "C": "Barium nitrate (B4(NO₃)₂)",
      "D": "Copper(II) sulphate (CuSO₄)"
    },
    "answer": "A",
    "explanation": "Most chlorides are soluble in water, except silver chloride (AgCl) and lead(II) chloride (PbCl₂). Lead(II) chloride is insoluble in cold water, though it dissolves readily in hot water.",
    "difficulty": "medium",
    "tags": [
      "salts",
      "solubility"
    ]
  },
  {
    "id": "c16",
    "subject": "Chemistry",
    "topic": "Solutions & Colloids",
    "subtopic": "Solubility",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is a solution that contains the maximum amount of solute that can dissolve at a specific temperature called?",
    "options": {
      "A": "Saturated solution",
      "B": "Unsaturated solution",
      "C": "Supersaturated solution",
      "D": "Concentrated solution"
    },
    "answer": "A",
    "explanation": "A saturated solution is one in which the maximum possible mass of solute has been dissolved in the solvent at a given temperature, in the presence of undissolved solute.",
    "difficulty": "easy",
    "tags": [
      "solutions",
      "solubility"
    ]
  },
  {
    "id": "c17",
    "subject": "Chemistry",
    "topic": "Redox Reactions",
    "subtopic": "Oxidation Numbers",
    "year": 2017,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Determine the oxidation number of manganese (Mn) in the potassium permanganate compound (KMnO₄).",
    "options": {
      "A": "+7",
      "B": "+6",
      "C": "+5",
      "D": "+4"
    },
    "answer": "A",
    "explanation": "In a neutral compound, the sum of oxidation numbers is 0.\nFor KMnO₄: K = +1, O = -2 * 4 = -8.\nLet Mn = x.\n(+1) + x + (-8) = 0\nx - 7 = 0\nx = +7.\nThus, the oxidation state of Mn in KMnO₄ is +7.",
    "difficulty": "medium",
    "tags": [
      "redox",
      "oxidation-states"
    ]
  },
  {
    "id": "c18",
    "subject": "Chemistry",
    "topic": "Organic Chemistry",
    "subtopic": "Saponification",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the alkaline hydrolysis of fats and oils to produce soap and glycerol chemically called?",
    "options": {
      "A": "Saponification",
      "B": "Esterification",
      "C": "Dehydration",
      "D": "Polymerization"
    },
    "answer": "A",
    "explanation": "Saponification is the chemical reaction where fats or oils (esters of fatty acids) react with a strong base (like NaOH or KOH) to form glycerol and salts of fatty acids (which is soap).",
    "difficulty": "easy",
    "tags": [
      "organic-chemistry",
      "soap"
    ]
  },
  {
    "id": "c19",
    "subject": "Chemistry",
    "topic": "Non-Metals & Compounds",
    "subtopic": "Chlorine",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which chemical compound is responsible for the bleaching action of chlorine in the presence of water?",
    "options": {
      "A": "Oxochlorate(I) acid (HClO)",
      "B": "Hydrochloric acid (HCl)",
      "C": "Hypochlorite ion (ClO⁻)",
      "D": "Chlorine gas (Cl₂)"
    },
    "answer": "A",
    "explanation": "Chlorine reacts with water to form a mixture of hydrochloric acid and oxochlorate(I) acid (hypochlorous acid):\nCl₂ + H₂O ⇌ HCl + HClO.\nThe hypochlorous acid (HClO) is unstable and decomposes to release active atomic oxygen which oxidizes colored dyes, bleaching them.",
    "difficulty": "hard",
    "tags": [
      "chlorine",
      "bleaching"
    ]
  },
  {
    "id": "c20",
    "subject": "Chemistry",
    "topic": "Stoichiometry & Mole Concept",
    "subtopic": "Empirical Formula",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A compound contains 40.0% carbon, 6.7% hydrogen, and 53.3% oxygen by mass. Find its empirical formula. (RAM: C=12, H=1, O=16)",
    "options": {
      "A": "CH₂O",
      "B": "CHO",
      "C": "C₂H₄O₂",
      "D": "CH₃O"
    },
    "answer": "A",
    "explanation": "1. Calculate moles in 100g:\nC: 40.0 / 12 = 3.33 moles\nH: 6.7 / 1 = 6.70 moles\nO: 53.3 / 16 = 3.33 moles\n2. Divide by smallest number of moles (3.33):\nC: 3.33 / 3.33 = 1\nH: 6.70 / 3.33 ≈ 2\nO: 3.33 / 3.33 = 1\nThus, the empirical formula is CH₂O.",
    "difficulty": "hard",
    "tags": [
      "stoichiometry",
      "empirical-formula"
    ]
  },
  {
    "id": "p1",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Kinematics",
    "year": 2018,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A car accelerates uniformly from rest at 2.0 m/s² for 5 seconds. What is the final velocity of the car?",
    "options": {
      "A": "10.0 m/s",
      "B": "5.0 m/s",
      "C": "25.0 m/s",
      "D": "2.5 m/s"
    },
    "answer": "A",
    "explanation": "Using equations of motion: v = u + at.\nHere, u = 0 (since it starts from rest), a = 2.0 m/s², and t = 5s.\nv = 0 + (2.0 * 5) = 10.0 m/s.",
    "difficulty": "easy",
    "tags": [
      "mechanics",
      "kinematics",
      "equations-of-motion"
    ]
  },
  {
    "id": "p2",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Work, Energy, and Power",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the work done when a force of 50 N is applied to pull a box through a horizontal distance of 10 m in the direction of the force.",
    "options": {
      "A": "500 J",
      "B": "50 J",
      "C": "5 J",
      "D": "0.2 J"
    },
    "answer": "A",
    "explanation": "Work Done (W) = Force (F) * distance (d)\nHere, F = 50 N, and d = 10 m.\nW = 50 * 10 = 500 Joules (J).",
    "difficulty": "easy",
    "tags": [
      "mechanics",
      "work-and-energy"
    ]
  },
  {
    "id": "p3",
    "subject": "Physics",
    "topic": "Electricity & Magnetism",
    "subtopic": "Ohm's Law",
    "year": 2017,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Three resistors of values 2Ω, 3Ω, and 6Ω are connected in parallel. What is the equivalent effective resistance of this combination?",
    "options": {
      "A": "1 Ω",
      "B": "11 Ω",
      "C": "2 Ω",
      "D": "0.5 Ω"
    },
    "answer": "A",
    "explanation": "For parallel connection:\n1/R_eq = 1/R₁ + 1/R₂ + 1/R₃\n1/R_eq = 1/2 + 1/3 + 1/6\nFinding common denominator (6):\n1/R_eq = (3 + 2 + 1) / 6 = 6 / 6 = 1 Ω⁻¹.\nTherefore, R_eq = 1 Ω.",
    "difficulty": "medium",
    "tags": [
      "electricity",
      "resistors",
      "parallel"
    ]
  },
  {
    "id": "p4",
    "subject": "Physics",
    "topic": "Waves & Optics",
    "subtopic": "Reflection of Light",
    "year": 2020,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the focal length of a concave mirror of radius of curvature 30 cm?",
    "options": {
      "A": "15 cm",
      "B": "30 cm",
      "C": "60 cm",
      "D": "10 cm"
    },
    "answer": "A",
    "explanation": "The focal length (f) of a spherical mirror is exactly half of its radius of curvature (R):\nf = R / 2\nf = 30 cm / 2 = 15 cm.",
    "difficulty": "easy",
    "tags": [
      "optics",
      "mirrors"
    ]
  },
  {
    "id": "p5",
    "subject": "Physics",
    "topic": "Thermal Physics",
    "subtopic": "Heat Capacity",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the quantity of heat required to raise the temperature of a 2.0 kg block of copper from 30°C to 80°C. (Specific heat capacity of copper = 400 J/kg°C)",
    "options": {
      "A": "40,000 J",
      "B": "24,000 J",
      "C": "64,000 J",
      "D": "80,000 J"
    },
    "answer": "A",
    "explanation": "Heat quantity (Q) = m * c * Δθ\nHere, m = 2.0 kg, c = 400 J/kg°C, and Δθ = (80 - 30) = 50°C.\nQ = 2.0 * 400 * 50 = 800 * 50 = 40,000 J.",
    "difficulty": "medium",
    "tags": [
      "heat",
      "specific-heat",
      "calculation"
    ]
  },
  {
    "id": "p6",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Newton's Laws",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A force of 15 N acts on a mass of 3 kg. What is the acceleration produced on the body?",
    "options": {
      "A": "5 m/s²",
      "B": "45 m/s²",
      "C": "0.2 m/s²",
      "D": "12 m/s²"
    },
    "answer": "A",
    "explanation": "According to Newton's Second Law of Motion: F = m * a.\nHere, F = 15 N, and m = 3 kg.\na = F / m = 15 / 3 = 5 m/s².",
    "difficulty": "easy",
    "tags": [
      "mechanics",
      "force",
      "newtons-laws"
    ]
  },
  {
    "id": "p7",
    "subject": "Physics",
    "topic": "Waves & Optics",
    "subtopic": "Refraction of Light",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the refractive index of a medium if the speed of light in vacuum is 3 * 10⁸ m/s and the speed of light in the medium is 2 * 10⁸ m/s.",
    "options": {
      "A": "1.5",
      "B": "0.67",
      "C": "1.33",
      "D": "2.0"
    },
    "answer": "A",
    "explanation": "Refractive Index (n) = Speed of light in vacuum (c) / Speed of light in medium (v)\nn = (3 * 10⁸) / (2 * 10⁸) = 3 / 2 = 1.5.",
    "difficulty": "easy",
    "tags": [
      "optics",
      "refractive-index"
    ]
  },
  {
    "id": "p8",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Pressure in Fluids",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the pressure exerted at the bottom of a water tank of depth 4 m. (Density of water = 1000 kg/m³, g = 10 m/s²)",
    "options": {
      "A": "40,000 Pa",
      "B": "4,000 Pa",
      "C": "250 Pa",
      "D": "400 Pa"
    },
    "answer": "A",
    "explanation": "Fluid Pressure (P) = h * ρ * g\nHere, h = 4 m, ρ = 1000 kg/m³, and g = 10 m/s².\nP = 4 * 1000 * 10 = 40,000 Pascals (Pa).",
    "difficulty": "medium",
    "tags": [
      "mechanics",
      "fluid-pressure"
    ]
  },
  {
    "id": "p9",
    "subject": "Physics",
    "topic": "Waves & Optics",
    "subtopic": "Wave Motion",
    "year": 2014,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A radio wave has a frequency of 100 MHz. Calculate its wavelength if the speed of light is 3 * 10⁸ m/s.",
    "options": {
      "A": "3.0 m",
      "B": "30.0 m",
      "C": "0.3 m",
      "D": "300.0 m"
    },
    "answer": "A",
    "explanation": "Using the wave equation: v = f * λ.\nGiven: speed (v) = 3 * 10⁸ m/s, frequency (f) = 100 MHz = 100 * 10⁶ Hz = 10⁸ Hz.\nλ = v / f = (3 * 10⁸) / 10⁸ = 3.0 meters.",
    "difficulty": "medium",
    "tags": [
      "waves",
      "frequency"
    ]
  },
  {
    "id": "p10",
    "subject": "Physics",
    "topic": "Modern Physics",
    "subtopic": "Radioactivity",
    "year": 2023,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A radioactive element has a half-life of 4 days. If the initial mass of the sample is 80g, what mass of the sample remains undecayed after 12 days?",
    "options": {
      "A": "10 g",
      "B": "20 g",
      "C": "5 g",
      "D": "40 g"
    },
    "answer": "A",
    "explanation": "12 days represents exactly 12 / 4 = 3 half-lives.\nAfter 1st half-life: 80g / 2 = 40g\nAfter 2nd half-life: 40g / 2 = 20g\nAfter 3rd half-life: 20g / 2 = 10g.\nThus, 10g remains undecayed.",
    "difficulty": "medium",
    "tags": [
      "modern-physics",
      "radioactivity",
      "half-life"
    ]
  },
  {
    "id": "p11",
    "subject": "Physics",
    "topic": "Electricity & Magnetism",
    "subtopic": "Electric Fields",
    "year": 2013,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "State Coulomb's Law of Electrostatic Force. If the distance between two point charges is doubled, what happens to the electrostatic force between them?",
    "options": {
      "A": "Decreases to one-quarter (1/4)",
      "B": "Halves (1/2)",
      "C": "Doubles (2x)",
      "D": "Quadruples (4x)"
    },
    "answer": "A",
    "explanation": "Coulomb's Law states that the electrostatic force F is inversely proportional to the square of the distance (r) between the charges: F ∝ 1/r².\nIf distance r is doubled (2r), the force becomes F' ∝ 1/(2r)² = 1/4r².\nSo the force decreases to exactly one-quarter of its initial value.",
    "difficulty": "medium",
    "tags": [
      "electricity",
      "coulombs-law"
    ]
  },
  {
    "id": "p12",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Projectiles",
    "year": 2012,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "At what angle of projection is the maximum horizontal range of a projectile achieved?",
    "options": {
      "A": "45°",
      "B": "90°",
      "C": "30°",
      "D": "60°"
    },
    "answer": "A",
    "explanation": "The formula for range is R = (u² sin 2θ) / g.\nThe range is maximum when sin 2θ is maximum (equal to 1).\nsin 2θ = 1 => 2θ = 90° => θ = 45°.\nThus, maximum horizontal range is achieved at a projection angle of 45°.",
    "difficulty": "easy",
    "tags": [
      "mechanics",
      "projectiles"
    ]
  },
  {
    "id": "p13",
    "subject": "Physics",
    "topic": "Thermal Physics",
    "subtopic": "Gas Behavior",
    "year": 2011,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What temperature represents absolute zero in the Celsius scale?",
    "options": {
      "A": "-273.15°C",
      "B": "0°C",
      "C": "-100°C",
      "D": "100°C"
    },
    "answer": "A",
    "explanation": "Absolute zero represents 0 Kelvin, which corresponds to exactly -273.15°C (commonly rounded to -273°C) on the Celsius scale.",
    "difficulty": "easy",
    "tags": [
      "heat",
      "absolute-zero"
    ]
  },
  {
    "id": "p14",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Machines",
    "year": 2010,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A machine has a velocity ratio of 5 and an efficiency of 80%. Calculate the mechanical advantage of the machine.",
    "options": {
      "A": "4",
      "B": "6.25",
      "C": "0.16",
      "D": "0.25"
    },
    "answer": "A",
    "explanation": "Efficiency (η) = (Mechanical Advantage / Velocity Ratio) * 100%\n80% = (MA / 5) * 100%\n0.8 = MA / 5\nMA = 0.8 * 5 = 4.",
    "difficulty": "medium",
    "tags": [
      "mechanics",
      "machines"
    ]
  },
  {
    "id": "p15",
    "subject": "Physics",
    "topic": "Electricity & Magnetism",
    "subtopic": "Electromagnetic Induction",
    "year": 2019,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which of the following machines operates on the principle of electromagnetic induction?",
    "options": {
      "A": "AC Dynamo (Generator)",
      "B": "Electric Fan Motor",
      "C": "Electric Bell",
      "D": "Cathode Ray Oscilloscope"
    },
    "answer": "A",
    "explanation": "A generator (dynamo) converts mechanical energy into electrical energy using electromagnetic induction. A motor operates on the reverse principle (magnetic force on a current-carrying conductor).",
    "difficulty": "easy",
    "tags": [
      "magnetism",
      "induction"
    ]
  },
  {
    "id": "p16",
    "subject": "Physics",
    "topic": "Waves & Optics",
    "subtopic": "Sound Waves",
    "year": 2015,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A boy claps his hands in front of a tall cliff and hears the echo 2 seconds later. Calculate his distance from the cliff if the speed of sound in air is 340 m/s.",
    "options": {
      "A": "340 m",
      "B": "680 m",
      "C": "170 m",
      "D": "85 m"
    },
    "answer": "A",
    "explanation": "For echoes: total distance traveled by the sound wave is 2d (to the cliff and back).\n2d = speed * time\n2d = 340 * 2\n2d = 680\nd = 340 meters.",
    "difficulty": "easy",
    "tags": [
      "waves",
      "sound",
      "echo"
    ]
  },
  {
    "id": "p17",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Density & Upthrust",
    "year": 2017,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "State Archimedes' Principle. An object weighs 10.0 N in air and 8.2 N when fully immersed in water. What is the upthrust acting on the object?",
    "options": {
      "A": "1.8 N",
      "B": "18.2 N",
      "C": "1.22 N",
      "D": "8.2 N"
    },
    "answer": "A",
    "explanation": "Upthrust = Apparent loss in weight = Weight in air - Weight in fluid\nUpthrust = 10.0 N - 8.2 N = 1.8 N.",
    "difficulty": "easy",
    "tags": [
      "mechanics",
      "archimedes",
      "upthrust"
    ]
  },
  {
    "id": "p18",
    "subject": "Physics",
    "topic": "Waves & Optics",
    "subtopic": "Lenses",
    "year": 2016,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "An object is placed 20 cm in front of a converging lens of focal length 10 cm. Find the image distance.",
    "options": {
      "A": "20 cm",
      "B": "10 cm",
      "C": "30 cm",
      "D": "40 cm"
    },
    "answer": "A",
    "explanation": "Using the lens formula: 1/f = 1/u + 1/v\nGiven: f = 10 cm, u = 20 cm.\n1/10 = 1/20 + 1/v\n1/v = 1/10 - 1/20\n1/v = (2 - 1) / 20 = 1/20\nv = 20 cm.\nThe image is real and is formed 20cm on the other side of the lens (at 2F).",
    "difficulty": "medium",
    "tags": [
      "optics",
      "lenses"
    ]
  },
  {
    "id": "p19",
    "subject": "Physics",
    "topic": "Electricity & Magnetism",
    "subtopic": "Electrostatics",
    "year": 2021,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which of the following particles is the charge carrier in a solid metallic conductor?",
    "options": {
      "A": "Free electrons",
      "B": "Protons",
      "C": "Positive ions",
      "D": "Neutrons"
    },
    "answer": "A",
    "explanation": "In metals, the atomic valence shells overlap, and their valence electrons detach to form a 'sea of free electrons' that flow when an electric potential is applied, carrying the electrical charge.",
    "difficulty": "easy",
    "tags": [
      "electricity",
      "conductors"
    ]
  },
  {
    "id": "p20",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Gravitational Fields",
    "year": 2022,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the acceleration due to gravity on the surface of a planet which has twice the mass of Earth and twice the radius of Earth. (Let g_E = 10 m/s² be Earth's surface gravity)",
    "options": {
      "A": "5 m/s²",
      "B": "10 m/s²",
      "C": "20 m/s²",
      "D": "2.5 m/s²"
    },
    "answer": "A",
    "explanation": "Surface gravity is g = G * M / R².\nFor the new planet: M' = 2M and R' = 2R.\ng' = G * (2M) / (2R)² = 2 * G * M / 4R² = (1/2) * (G * M / R²) = g_E / 2.\nSince g_E = 10 m/s², then g' = 10 / 2 = 5 m/s².",
    "difficulty": "hard",
    "tags": [
      "mechanics",
      "gravity"
    ]
  },
  {
    "id": "m21",
    "subject": "Mathematics",
    "topic": "Algebra",
    "subtopic": "Simultaneous Equations",
    "year": 2024,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Solve the simultaneous equations: 3x - y = 8 and x + 2y = 5. Find the value of x + y.",
    "options": {
      "A": "3",
      "B": "4",
      "C": "2",
      "D": "5"
    },
    "answer": "B",
    "explanation": "Multiply first equation by 2: 6x - 2y = 16.\nAdd this to the second equation:\n(6x - 2y) + (x + 2y) = 16 + 5\n7x = 21 => x = 3.\nSubstitute x = 3 in the first equation:\n3(3) - y = 8 => 9 - y = 8 => y = 1.\nTherefore, x + y = 3 + 1 = 4.",
    "difficulty": "medium",
    "tags": [
      "algebra",
      "equations"
    ]
  },
  {
    "id": "m22",
    "subject": "Mathematics",
    "topic": "Geometry",
    "subtopic": "Mensuration",
    "year": 2025,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A cylinder of height 14 cm has a curved surface area of 176 cm². Find its radius. (Take π = 22/7)",
    "options": {
      "A": "2 cm",
      "B": "4 cm",
      "C": "3 cm",
      "D": "6 cm"
    },
    "answer": "A",
    "explanation": "Curved surface area of a cylinder = 2πrh.\nGiven: h = 14 cm, Area = 176 cm².\n176 = 2 * (22/7) * r * 14\n176 = 88 * r\nr = 176 / 88 = 2 cm.",
    "difficulty": "easy",
    "tags": [
      "geometry",
      "mensuration",
      "cylinder"
    ]
  },
  {
    "id": "m23",
    "subject": "Mathematics",
    "topic": "Algebra",
    "subtopic": "Indices",
    "year": 2024,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Solve for x in the equation: 3^(2x - 1) = 27.",
    "options": {
      "A": "x = 1",
      "B": "x = 2",
      "C": "x = 3",
      "D": "x = 1.5"
    },
    "answer": "B",
    "explanation": "3^(2x - 1) = 27 can be written as 3^(2x - 1) = 3^3.\nEquating the powers:\n2x - 1 = 3\n2x = 4\nx = 2.",
    "difficulty": "easy",
    "tags": [
      "algebra",
      "indices"
    ]
  },
  {
    "id": "m24",
    "subject": "Mathematics",
    "topic": "Trigonometry",
    "subtopic": "Trig Identities",
    "year": 2025,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "If sin(θ) = 4/5, find cos(θ) for an acute angle θ.",
    "options": {
      "A": "3/5",
      "B": "4/3",
      "C": "3/4",
      "D": "1/5"
    },
    "answer": "A",
    "explanation": "Using the trigonometric identity: sin²(θ) + cos²(θ) = 1\ncos²(θ) = 1 - sin²(θ) = 1 - (4/5)² = 1 - 16/25 = 9/25.\nSince θ is acute, cos(θ) = √(9/25) = 3/5.",
    "difficulty": "easy",
    "tags": [
      "trigonometry",
      "identities"
    ]
  },
  {
    "id": "e21",
    "subject": "English Language",
    "topic": "Lexis and Structure",
    "subtopic": "Concord",
    "year": 2024,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the word that best completes the sentence: The committee ______ submitted its report to the president.",
    "options": {
      "A": "has",
      "B": "have",
      "C": "are",
      "D": "were"
    },
    "answer": "A",
    "explanation": "When a collective noun (like 'committee') acts as a single, cohesive unit, it takes a singular verb. Hence, 'has' is correct.",
    "difficulty": "medium",
    "tags": [
      "lexis",
      "concord"
    ]
  },
  {
    "id": "e22",
    "subject": "English Language",
    "topic": "Lexis and Structure",
    "subtopic": "Synonyms",
    "year": 2025,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Choose the option that is nearest in meaning to the underlined word: The doctor's handwriting was so <u>illegible</u> that the pharmacist could not read the prescription.",
    "options": {
      "A": "untidy",
      "B": "unreadable",
      "C": "illegal",
      "D": "incomprehensible"
    },
    "answer": "B",
    "explanation": "'Illegible' means impossible or difficult to read. Thus, 'unreadable' is the closest synonym.",
    "difficulty": "easy",
    "tags": [
      "lexis",
      "synonyms"
    ]
  },
  {
    "id": "e23",
    "subject": "English Language",
    "topic": "Lexis and Structure",
    "subtopic": "Prepositions",
    "year": 2024,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Choose the word that best completes the sentence: The headmaster congratulated the students ______ their outstanding WAEC results.",
    "options": {
      "A": "for",
      "B": "about",
      "C": "on",
      "D": "with"
    },
    "answer": "C",
    "explanation": "The verb 'congratulate' is conventionally followed by the preposition 'on'.",
    "difficulty": "medium",
    "tags": [
      "lexis",
      "prepositions"
    ]
  },
  {
    "id": "e24",
    "subject": "English Language",
    "topic": "Lexis and Structure",
    "subtopic": "Idioms",
    "year": 2025,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Choose the option that best explains the underlined idiomatic expression: The manager decided to <u>call it a day</u> after working for ten straight hours.",
    "options": {
      "A": "declare a holiday",
      "B": "stop working for the day",
      "C": "dismiss the staff",
      "D": "hold a staff meeting"
    },
    "answer": "B",
    "explanation": "The idiom 'call it a day' means to stop what you are doing, especially working, because you have done enough for that day.",
    "difficulty": "easy",
    "tags": [
      "lexis",
      "idioms"
    ]
  },
  {
    "id": "b21",
    "subject": "Biology",
    "topic": "Ecology",
    "subtopic": "Nutrient Cycling",
    "year": 2024,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Which of the following organisms plays a vital role in nitrogen fixation in the root nodules of leguminous plants?",
    "options": {
      "A": "Nitrosomonas",
      "B": "Rhizobium",
      "C": "Azotobacter",
      "D": "Nitrobacter"
    },
    "answer": "B",
    "explanation": "Rhizobium is a symbiotic bacterium found in the root nodules of leguminous plants that fixes atmospheric nitrogen into ammonium/nitrates.",
    "difficulty": "medium",
    "tags": [
      "ecology",
      "nitrogen-cycle"
    ]
  },
  {
    "id": "b22",
    "subject": "Biology",
    "topic": "Genetics",
    "subtopic": "Genetic Crosses",
    "year": 2025,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A heterozygous tall pea plant (Tt) is crossed with a homozygous dwarf pea plant (tt). What is the probability of producing a tall plant?",
    "options": {
      "A": "25%",
      "B": "50%",
      "C": "75%",
      "D": "100%"
    },
    "answer": "B",
    "explanation": "A cross of Tt (heterozygous tall) and tt (dwarf) yields Tt, Tt, tt, and tt. Thus, 2 out of 4 (50%) are tall plants.",
    "difficulty": "medium",
    "tags": [
      "genetics",
      "crosses"
    ]
  },
  {
    "id": "b23",
    "subject": "Biology",
    "topic": "Ecology",
    "subtopic": "Food Chains",
    "year": 2024,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "In a terrestrial food chain, which of the following represents the primary consumer?",
    "options": {
      "A": "Grass",
      "B": "Grasshopper",
      "C": "Lizard",
      "D": "Hawk"
    },
    "answer": "B",
    "explanation": "Grass is the primary producer. The herbivorous grasshopper feeds on the grass directly, representing the primary consumer.",
    "difficulty": "easy",
    "tags": [
      "ecology",
      "food-chains"
    ]
  },
  {
    "id": "b24",
    "subject": "Biology",
    "topic": "Physiology",
    "subtopic": "Circulation",
    "year": 2025,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Which chamber of the mammalian heart pumps oxygenated blood to all parts of the body?",
    "options": {
      "A": "Left Ventricle",
      "B": "Right Ventricle",
      "C": "Left Atrium",
      "D": "Right Atrium"
    },
    "answer": "A",
    "explanation": "The left ventricle pumps oxygen-rich blood through the aorta to the rest of the body. It has the thickest walls to withstand the high pressure required.",
    "difficulty": "easy",
    "tags": [
      "physiology",
      "heart"
    ]
  },
  {
    "id": "c21",
    "subject": "Chemistry",
    "topic": "Organic Chemistry",
    "subtopic": "Hydrocarbons",
    "year": 2024,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "What is the general formula for the homologous series of alkanes?",
    "options": {
      "A": "CnH2n",
      "B": "CnH2n+2",
      "C": "CnH2n-2",
      "D": "CnH2n+1"
    },
    "answer": "B",
    "explanation": "Alkanes are saturated hydrocarbons characterized by single covalent bonds, conforming to the general formula CnH2n+2.",
    "difficulty": "easy",
    "tags": [
      "organic",
      "alkanes"
    ]
  },
  {
    "id": "c22",
    "subject": "Chemistry",
    "topic": "Physical Chemistry",
    "subtopic": "Stoichiometry",
    "year": 2025,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Calculate the mass of carbon dioxide (CO₂) produced when 12g of carbon burns completely in excess oxygen. (C = 12, O = 16)",
    "options": {
      "A": "22g",
      "B": "44g",
      "C": "12g",
      "D": "32g"
    },
    "answer": "B",
    "explanation": "C + O₂ → CO₂.\n1 mole of Carbon (12g) yields 1 mole of carbon dioxide.\nMolar mass of CO₂ = 12 + 2(16) = 44 g/mol.\nTherefore, 12g of C produces 44g of CO₂.",
    "difficulty": "medium",
    "tags": [
      "physical",
      "stoichiometry"
    ]
  },
  {
    "id": "c23",
    "subject": "Chemistry",
    "topic": "Inorganic Chemistry",
    "subtopic": "Periodic Table",
    "year": 2024,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Which of the following group elements are known as the Halogens?",
    "options": {
      "A": "Group 1",
      "B": "Group 2",
      "C": "Group 7",
      "D": "Group 8"
    },
    "answer": "C",
    "explanation": "Group 7 elements (F, Cl, Br, I, At) are known as Halogens because they form salts when reacted with metals.",
    "difficulty": "easy",
    "tags": [
      "inorganic",
      "periodic-table"
    ]
  },
  {
    "id": "c24",
    "subject": "Chemistry",
    "topic": "Physical Chemistry",
    "subtopic": "Acids, Bases and Salts",
    "year": 2025,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "What is the pH of a solution with a hydrogen ion concentration [H⁺] of 1.0 x 10⁻⁵ mol/dm³?",
    "options": {
      "A": "5",
      "B": "9",
      "C": "7",
      "D": "14"
    },
    "answer": "A",
    "explanation": "pH is defined as the negative logarithm of hydrogen ion concentration: pH = -log[H⁺] = -log(10⁻⁵) = 5.",
    "difficulty": "easy",
    "tags": [
      "physical",
      "pH"
    ]
  },
  {
    "id": "p21",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Work, Energy, and Power",
    "year": 2024,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "A man of mass 60 kg climbs a flight of stairs of height 5 meters in 10 seconds. Calculate the power developed. (g = 10 m/s²)",
    "options": {
      "A": "300 W",
      "B": "60 W",
      "C": "3000 W",
      "D": "600 W"
    },
    "answer": "A",
    "explanation": "Work = potential energy = mgh = 60 * 10 * 5 = 3000 J.\nPower = Work / Time = 3000 / 10 = 300 W.",
    "difficulty": "medium",
    "tags": [
      "mechanics",
      "power"
    ]
  },
  {
    "id": "p22",
    "subject": "Physics",
    "topic": "Electricity & Magnetism",
    "subtopic": "Resistors in Circuits",
    "year": 2025,
    "exam_body": "WAEC",
    "type": "MCQ",
    "question": "Three resistors of values 2 Ω, 3 Ω, and 6 Ω are connected in parallel. Calculate their effective resistance.",
    "options": {
      "A": "11 Ω",
      "B": "1.5 Ω",
      "C": "1.0 Ω",
      "D": "0.5 Ω"
    },
    "answer": "C",
    "explanation": "For parallel connection:\n1/R_eq = 1/2 + 1/3 + 1/6 = (3 + 2 + 1) / 6 = 6/6 = 1.\nThus, R_eq = 1.0 Ω.",
    "difficulty": "easy",
    "tags": [
      "electricity",
      "resistors"
    ]
  },
  {
    "id": "p23",
    "subject": "Physics",
    "topic": "Waves & Optics",
    "subtopic": "Reflection of Light",
    "year": 2024,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "An object is placed 15 cm in front of a plane mirror. How far is the image from the object?",
    "options": {
      "A": "15 cm",
      "B": "30 cm",
      "C": "45 cm",
      "D": "0 cm"
    },
    "answer": "B",
    "explanation": "For plane mirrors, image distance equals object distance (15 cm). The total distance between the object and the image is 15 cm + 15 cm = 30 cm.",
    "difficulty": "easy",
    "tags": [
      "optics",
      "reflection"
    ]
  },
  {
    "id": "p24",
    "subject": "Physics",
    "topic": "Mechanics",
    "subtopic": "Pressure",
    "year": 2025,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Calculate the pressure exerted by a block of weight 500 N resting on a flat surface of area 2.5 m².",
    "options": {
      "A": "200 N/m²",
      "B": "1250 N/m²",
      "C": "50 N/m²",
      "D": "20 N/m²"
    },
    "answer": "A",
    "explanation": "Pressure = Force / Area = Weight / Area = 500 / 2.5 = 200 N/m².",
    "difficulty": "easy",
    "tags": [
      "mechanics",
      "pressure"
    ]
  },
  {
    "id": "aloc-1069",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2021,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Three children shared a basket of mangoes in such a way that the first child took 1/4 of the mangoes and the second 3/4 of the remainder. What fraction of the mangoes did the third child take?",
    "options": {
      "A": "3/16",
      "B": "7/16",
      "C": "9/16",
      "D": "13/16"
    },
    "answer": "A",
    "explanation": "You can use any whole numbers (eg. 1. 2. 3) to represent all the mangoes in the basket.\n\nIf the first child takes 1/4\n it will remain 1 - 1/4 = 3/4\n\n\nNext, the second child takes 3/4 of the remainder\n\nwhich is 3/4 i.e. find 3/4 of 3/4\n\n\n= 3/4 x 3/4\n\n= 9/16\n\nthe fraction remaining now = 3/4 - 9/16\n\n\n= (12−9)/16\n\n\n= 3/16",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2021"
    ]
  },
  {
    "id": "aloc-727",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Simplify (√6+2)<sup>2</sup> −(√6−2)<sup>2</sup>",
    "options": {
      "A": "2√6",
      "B": "4√6",
      "C": "8√6",
      "D": "16√6"
    },
    "answer": "C",
    "explanation": "√6+2)<sup>2</sup> −(√6−2)<sup>2</sup>  =  [(√6+2)+(√6 − 2)][(√6 + 2) − (√6 − 2)]\n\n= (√6 + 2 + √6 − 2)(√6 + 2− √6 + 2)]\n\n\n= (2√6)(4)\n\n\n= 8√6",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-522",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2009,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "If 55<sub>x</sub> + 52<sub>x</sub> = 77<sub>10</sub> find X",
    "options": {
      "A": "5",
      "B": "6",
      "C": "7",
      "D": "10"
    },
    "answer": "C",
    "explanation": "5 × x<sup>1</sup>  + 5 × x<sup>0</sup> + 5 × x<sup>1</sup> + 2 × x<sup>0</sup> = 77.                                 (change all  to base 10)\n5x + 5 + 5x + 2 = 77\n10x + 7 = 77\n10x = 77-7\n10x = 70\nx = 70/10\nx = 7",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2009"
    ]
  },
  {
    "id": "aloc-235",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2003,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The graph of the function y = x<sup>2</sup> + 4 and a straight line PQ are drawn to solve the equation x<sup>2</sup>\n - 3x + 2 = 0. What is the equation of PQ?",
    "options": {
      "A": "y = 3x - 2",
      "B": "y = 3x + 2",
      "C": "y = 3x - 4",
      "D": "y = 3x + 4"
    },
    "answer": "B",
    "explanation": "x<sup>2</sup> + 4 = x<sup>2</sup>\n - 3x + 2\n3x + 2 = y",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2003"
    ]
  },
  {
    "id": "aloc-921",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2018,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The pie chart shows the monthly expenditure of a public servant. The monthly expenditure on housing is twice that of school fees. How much does the worker spend on housing if his monthly income is N7200?",
    "options": {
      "A": "1000",
      "B": "2000",
      "C": "3000",
      "D": "4000"
    },
    "answer": "B",
    "explanation": "Let the angle for school fees = x°\n\nThen Housing = 2x°\n\n120° + 90° + x° + 2x° = 360°\n\n3x° = 150° ⟹ x° = 50°.\n\nAmount spent on housing = 100/360 × 7200\n= N2000.",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2018"
    ]
  },
  {
    "id": "aloc-563",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2009,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "What is the mean deviation of x, 2x, x+1 and 3x. If their mean is 2",
    "options": {
      "A": "0.5",
      "B": "1.0",
      "C": "1.5",
      "D": "2.0"
    },
    "answer": "A",
    "explanation": "Mean =\tx+2x+x+1+3x/4\n \n2 =7x+1/4\n\n8 = 7x+1\n7x = 8-1\n7x = 7\nx = 1\n\n \n\nMean deviation =∑/x-X/n\n \n\n =2/4\n \n\n =1/2\n\n= 0.5",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2009"
    ]
  },
  {
    "id": "aloc-138",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2001,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "A straight line makes an angle of 30° with the positive x-axis and cuts the y-axis at y = 5. Find the equation of the straight line.",
    "options": {
      "A": "y = (x/10) + 5",
      "B": "y = x + 5",
      "C": "√3y = - x + 5√3",
      "D": "√3y = x + 5√3"
    },
    "answer": "D",
    "explanation": "Cos 30 = 5/x\nx cos 30 = 5, => x = 5√3\n\nCoordinates of P = -5, 3, 0\nCoordinates of Q = 0, 5\nGradient of PQ = (y<sub>2</sub>  - y<sub>1</sub> ) (X<sub>2</sub>  - X<sub>1</sub> ) = (5 - 0)/(0 -5√3)\n= 5/5√3 = 1/√3\n\nEquation of PQ = y - y<sub>1</sub>  = m (x -x<sub>1</sub> )\ny - 0 = 1/√3 (x -(-5√3))\n\nThus: √3y = x + 5√3",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2001"
    ]
  },
  {
    "id": "aloc-1186",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2023,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The third term of an A.P is 6 and the fifth term is 12. Find the sum of its first twelve terms",
    "options": {
      "A": "201",
      "B": "144",
      "C": "198",
      "D": "72"
    },
    "answer": "C",
    "explanation": "T<sub>3</sub>  = 6\n\nT<sub>5</sub>  = 12\n\nS<sub>12</sub>  = ?\n\nT<sub>n</sub>  = a + (n - 1)d\n\n⇒ T<sub>3</sub>  = a + 2d = 6 ----- (i)\n\n⇒ T<sub>5</sub>  = a + 4d = 12 ----- (ii)\n\nSubtract equation (ii) from (i)\n\n⇒ -2d = -6\n\n⇒ d(−6/−2) = 3\n\nSubstitute 3 for d in equation (i)\n\n⇒ a + 2(3) = 6\n\n⇒ a + 6 = 6\n\n⇒ a = 6 - 6 = 0\n\nS<sub>n</sub>  = (n(2a+(n−1)d))/2\n⇒ S<sub>12</sub>  = (12(2×0+(12−1)3)/2\n⇒ S<sub>12</sub>  = 6(0 + 11 x 3)\n\n⇒ S<sub>12</sub>  = 6(33)\n\n∴ S<sub>12</sub>  = 198",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2023"
    ]
  },
  {
    "id": "aloc-743",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The angles of a polygon are given by x, 2x, 3x, 4x and 5x respectively. Find the value of x.",
    "options": {
      "A": "24°",
      "B": "30°",
      "C": "33°",
      "D": "36°"
    },
    "answer": "D",
    "explanation": "Since there are 5 angles given, the polygon is a pentagon.\n\nSum of interior angles of a pentagon = (2(5) - 4) x 90° = 540°\n\n∴\n x + 2x + 3x + 4x + 5x = 15x\n\n15x = 540°\n\nx=540/15=36°",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-231",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2003,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The sum of four numbers is 1214<sub>5</sub>\n. What is the average expressed in base five?",
    "options": {
      "A": "114",
      "B": "141",
      "C": "401",
      "D": "411"
    },
    "answer": "B",
    "explanation": "Convert to base 10, divide and then re-convert to base 5.",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2003"
    ]
  },
  {
    "id": "aloc-532",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2009,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "A polynomial in x whose roots are 4/3 and -3/5 is?",
    "options": {
      "A": "15x<sup>2</sup> - 11x – 12",
      "B": "15x<sup>2</sup> + 11x – 12",
      "C": "12x<sup>2</sup> - x – 12",
      "D": "12x<sup>2</sup> + 11x – 15"
    },
    "answer": "A",
    "explanation": "If 4/3 and -3/5 are roots of a polynomial\nImply x = 4/3 and - 3/5\n3x = 4 and 5x = -3\n∴3x-4 = 0 and 5x+3 = 0 are factors\n(3x-4)(5x+3) = 0 product of the factors\n15x2 + 9x – 20x – 12 = 0 By expansion\n15x2 - 11x – 12 = 0",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2009"
    ]
  },
  {
    "id": "aloc-453",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2007,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Evaluate 1011<sup>2</sup><sub>2</sub>  - 101<sup>2</sup><sub>2</sub>",
    "options": {
      "A": "110000<sub>2</sub>",
      "B": "110<sub>2</sub>",
      "C": "1100000<sub>2</sub>",
      "D": "11000<sub>2</sub>"
    },
    "answer": "C",
    "explanation": "1011<sup>2</sup><sub>2</sub> - 101<sup>2</sup><sub>2</sub> = (1x2<sup>3</sup> + 0x2<sup>2</sup> + 1x2<sup>1</sup> + 1x2<sup>0</sup>)<sup>2</sup> - (1x2<sup>2</sup> + 0x2<sup>1</sup> + 1x2<sup>2</sup>)2\n(1x8 + 0x4 + 1x2 + 1x1)<sup>2</sup> - (1x4 + 0x2 + 1x1)<sup>2</sup>)\n= (8 + 0 + 2 + 1) <sup>2</sup> - (4 + 0 + 1) <sup>2</sup>\n= 11<sup>2</sup>- 5<sup>2</sup>\n= 16 x 6 = 96\n9610 to base 2\n2/96 = 48 R 0\n2/48 = 24 R 0\n2/24 = 12 R 0\n2/12 = 6 R 0\n2/6 = 3 R 0\n2/3 = 1 R 1\n2/1 = 0 R 1\n1100000<sub>2</sub>",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2007"
    ]
  },
  {
    "id": "aloc-291",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2004,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The mean age of a group of students is 15 years. When the age of a teacher, 45 years old, is added to the age of the students, the mean of their ages becomes 18 years. Find the number of the students in the group",
    "options": {
      "A": "0",
      "B": "7",
      "C": "42",
      "D": "15"
    },
    "answer": "A",
    "explanation": "Let the number of students = x\nTotal age of the students = 15x\nTotal age including age of the teacher = 15x + 45\nMean of their ages; (15x + 45)/(x + 1) = 18\n= 15x + 45 = 18(x + 1)\n= 15x + 45 = 18x + 18\n= 18x - 15x = 45 - 18\n= 3x = 27\nx = 9",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2004"
    ]
  },
  {
    "id": "aloc-863",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2016,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "OGIVE is constructed using",
    "options": {
      "A": "Third quartile range",
      "B": "Semi-quartile range",
      "C": "Cummulative frequency table",
      "D": "Inter-quartile table"
    },
    "answer": "C",
    "explanation": "The correct answer is option C.",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2016"
    ]
  },
  {
    "id": "aloc-1102",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2022,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "If the mean of 2, 5, (x+1), (x+2), 7 and 9 is 6. Find the median",
    "options": {
      "A": "5.5",
      "B": "5",
      "C": "6.5",
      "D": "6"
    },
    "answer": "C",
    "explanation": "Firstly; solving for x\n\n6 = (2+5+x+1+x+2+7+9)/6\ncross multiply to have:\n\n6 * 6 = 2 + 5 + x+1 + x+2 + 7 + 9\n\n36 = 2x + 26\n\n36 - 26 = 2x\n\n10 = 2x\n\nx = 5\n\nMedian = 7+6/2\n→ 6.5",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2022"
    ]
  },
  {
    "id": "aloc-625",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2011,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "If the numbers M, N, Q are in the ratio 5:4:3, find the value of 2N−Q/M",
    "options": {
      "A": "2",
      "B": "3",
      "C": "1",
      "D": "4"
    },
    "answer": "C",
    "explanation": "M:N:Q == 5:4:3\n\ni.e M = 5, N = 4, Q = 3\n\nSubstituting values into equation, we have...\n\n2N−Q/M\n\n\n= 2(4)−3/5\n\n\n= 8−3/5\n\n\n= 5/5\n\n\n= 1",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2011"
    ]
  },
  {
    "id": "aloc-818",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2013,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Evaluate 3(x + 2) > 6(x + 3)",
    "options": {
      "A": "x < 4",
      "B": "x > -4",
      "C": "x < -4",
      "D": "x > 4"
    },
    "answer": "C",
    "explanation": "3(x + 2) > 6(x + 3)\n\n3x + 6 > 6x + 18\n\n3x - 6x > 18 - 6\n\n-3x > 12\n\nx < -4",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2013"
    ]
  },
  {
    "id": "aloc-552",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2009,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "What is the value of r if the distance between the point (4,2) and (1,r) is 3 units?",
    "options": {
      "A": "1",
      "B": "2",
      "C": "3",
      "D": "4"
    },
    "answer": "B",
    "explanation": "A(4,2) and B(1,r), AB = 3 units\n\n3 = √ (x<sup>2</sup>- x<sup>1</sup>)2 + (y<sup>2</sup>-y<sup>1</sup>)2\n\n\n3 = √ (4-1)2 + (2-r)2\n\n\n3 = √ 32 + (2-r)2\n\n\n3 = √ 9 + 4 – 4r + r2\n\n\n3 = √ r2 - 4r + 13\n\n9 = r2 - 4r + 13 By squaring both sides\nr2 - 4r + 4 = 0\n(r-2)(r-2) = 0\nr = 2",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2009"
    ]
  },
  {
    "id": "aloc-245",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2003,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Evaluate ∫<sup>2</sup>\n<sub>3</sub>(x2−2x)dx",
    "options": {
      "A": "4",
      "B": "2",
      "C": "4/3",
      "D": "1/3"
    },
    "answer": "C",
    "explanation": "The correct answer is option C.",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "jamb",
      "2003"
    ]
  },
  {
    "id": "aloc-1021",
    "subject": "Mathematics",
    "topic": "General",
    "subtopic": "",
    "year": 2024,
    "exam_body": "2020",
    "type": "MCQ",
    "question": "Find all real number x which satisfy the inequality 1/3 (x + 1) - 1 > 1/5(x + 4)",
    "options": {
      "A": "x < 11",
      "B": "x < -1",
      "C": "x > 6",
      "D": "x > 11"
    },
    "answer": "D",
    "explanation": "1/3 (x + 1) - 1 > 1/5(x + 4)  = (x+1)/3−1 > (x+4)/5\n \n\n(x+1)/3 − (x + 4)/5 − 1 > 0 \n\n= (5x + 5 − 3x − 12)/15\n \n\n2x - 7 > 15\n\n2x > 22 = x > 11",
    "difficulty": "medium",
    "tags": [
      "mathematics",
      "2020",
      "2024"
    ]
  },
  {
    "id": "aloc-526",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2010,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The footballers moved with their tails between their legs.",
    "options": {
      "A": "They moved happily because they won the match",
      "B": "They were unhappy because they had been despised  by their opponents.",
      "C": "They were ashamed because they had been defeated",
      "D": "they moved with their tails between their legs."
    },
    "answer": "C",
    "explanation": "The correct answer is option C.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2010"
    ]
  },
  {
    "id": "aloc-1331",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2020,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Choose the one with the different stress pattern",
    "options": {
      "A": "physique",
      "B": "menace",
      "C": "challenge",
      "D": "reckless"
    },
    "answer": "A",
    "explanation": "Physique has its stress on the second syllable as opposed to other options with the stress on the first syllable",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2020"
    ]
  },
  {
    "id": "aloc-655",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2001,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "<u>Ch</u>urch?",
    "options": {
      "A": "feature",
      "B": "chauffeur",
      "C": "ocean",
      "D": "machine"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2001"
    ]
  },
  {
    "id": "aloc-1497",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2018,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Choose the option that best completes the gap. Wherever the leader went people struggled to catch a __________ of him",
    "options": {
      "A": "glimpse",
      "B": "look",
      "C": "view",
      "D": "picture"
    },
    "answer": "A",
    "explanation": "To catch a glimpse of someone or something means to briefly look at someone or to briefly see the person or thing. The verb ‘catch’ cannot be used with ‘look’ in option B, ‘view’ in option C and ‘picture’ in option D.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2018"
    ]
  },
  {
    "id": "aloc-1606",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2017,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Suleiman's reason for becoming a Muslim in the novel is because Islam brings sense of ______?",
    "options": {
      "A": "radicalism and aggression",
      "B": "boldness and awareness",
      "C": "kindness and truthfulness",
      "D": "purpose and discipline"
    },
    "answer": "C",
    "explanation": "In chapter 30, Suleiman was resolute about tracing his roots and finally finding his identity amongst his people in Africa and in the religion, Islam",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2017"
    ]
  },
  {
    "id": "aloc-1354",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2020,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Our chief is very intelligent but he could be <u>parochial</u> in his judgements",
    "options": {
      "A": "deep",
      "B": "broad",
      "C": "narrow-minded",
      "D": "kind-hearted"
    },
    "answer": "C",
    "explanation": "Parochial means having a limited or narrow scope. Option C best fits this definition.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2020"
    ]
  },
  {
    "id": "aloc-624",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2001,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "",
    "options": {
      "A": "toil",
      "B": "rejoice",
      "C": "enjoy",
      "D": "log"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2001"
    ]
  },
  {
    "id": "aloc-1131",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2013,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "He is a clinging child.",
    "options": {
      "A": "he is possessive",
      "B": "he likes to cling with his sister.",
      "C": "he is a bully",
      "D": "he is a handsome young man"
    },
    "answer": "A",
    "explanation": "clinging; means to hold on or be attached to someone or something. \n\n''He is possessive'' is the correct answer.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2013"
    ]
  },
  {
    "id": "aloc-1785",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2014,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The lazy man cast a  <u>lustful</u> glance at his neighbour's wife.",
    "options": {
      "A": "Envious.",
      "B": "Hateful.",
      "C": "Quick.",
      "D": "Covetous."
    },
    "answer": "D",
    "explanation": "lustful; having or showing strong feelings of sexual desire.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2014"
    ]
  },
  {
    "id": "aloc-764",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2000,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The Governor told the chief that he was only on a <u>routine tour</u>?",
    "options": {
      "A": "normal and regular visit",
      "B": "unplanned encounter",
      "C": "surprise and imprompt check",
      "D": "working visit and homage"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2000"
    ]
  },
  {
    "id": "aloc-1770",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2014,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Prolonged strike action <u>debilitated</u> the industry.",
    "options": {
      "A": "Stroyed.",
      "B": "Invigorated.",
      "C": "Isolated.",
      "D": "Weakened."
    },
    "answer": "B",
    "explanation": "debilitated; in a very weakened and infirm state.\n\ninvigorate; give strength or energy to",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2014"
    ]
  },
  {
    "id": "aloc-934",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2011,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The girl is angry with her friend who had <u>ensnared</u> her into this relationship?",
    "options": {
      "A": "tricked",
      "B": "encourage",
      "C": "forced",
      "D": "enslaved"
    },
    "answer": "A",
    "explanation": "Ensnared;   to trap or gain power over (someone) by dishonest or underhand means.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2011"
    ]
  },
  {
    "id": "aloc-426",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2008,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "You must practise in order to................perfection.",
    "options": {
      "A": "obtain",
      "B": "have",
      "C": "get",
      "D": "achieve"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2008"
    ]
  },
  {
    "id": "aloc-1061",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Vacancies in the company will be notified by...........",
    "options": {
      "A": "bulletin",
      "B": "publication",
      "C": "publicity",
      "D": "advertisement"
    },
    "answer": "D",
    "explanation": "Advertisement; a notice or announcement in a public medium promoting a product, service, or event or publicizing a job vacancy.\n\nVacancies in the company will be notified by advertisement",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-568",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2010,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "One of the women who .... in the premises.... been  ordered to quit",
    "options": {
      "A": "sells/have",
      "B": "sell/has",
      "C": "sell/have",
      "D": "sells/has"
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2010"
    ]
  },
  {
    "id": "aloc-670",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2001,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Some equatorial areas have a <u>sultry</u> climate?",
    "options": {
      "A": "a hot",
      "B": "an inclement",
      "C": "a temperate",
      "D": "a stable"
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2001"
    ]
  },
  {
    "id": "aloc-369",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2007,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "There's a door at either end of the building.",
    "options": {
      "A": "The building has two ends and two doors.",
      "B": "The building has two ends, but only one doc'",
      "C": "The building has two ends, but I do not know which of the two has a door.",
      "D": "The building has many ends each with a door."
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2007"
    ]
  },
  {
    "id": "aloc-726",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2000,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "T<u>ea</u>r?\n\n.",
    "options": {
      "A": "dare",
      "B": "care",
      "C": "here",
      "D": "wear"
    },
    "answer": "D",
    "explanation": "The verb tear is pronounced as /tɛː/\n\nWear is pronounced as /wɛː/",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2000"
    ]
  },
  {
    "id": "aloc-1047",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Justice is difficult to enforce because people are unwilling to accept any loss <u>sovereignty</u>",
    "options": {
      "A": "autonomy",
      "B": "position",
      "C": "leadership",
      "D": "kingdom"
    },
    "answer": "A",
    "explanation": "sovereignty; In this context it means people are unwilling to loss their independence. A self-governing state.\n\nAutonomy; the right or condition of self-government.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-630",
    "subject": "English Language",
    "topic": "General",
    "subtopic": "",
    "year": 2001,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Modern dancing has become rather scientific and so requires .......?",
    "options": {
      "A": "bizzarre costuming",
      "B": "some choreographic skill",
      "C": "immmense instrumentation",
      "D": "a rapping voice"
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "english language",
      "jamb",
      "2001"
    ]
  },
  {
    "id": "aloc-186",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2007,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The theory  which supports the view that the large muscles developed by an athlete will be passed on to the offspring was proposed by",
    "options": {
      "A": "Darwin",
      "B": "Lamarck",
      "C": "Pasteur",
      "D": "Mendel."
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2007"
    ]
  },
  {
    "id": "aloc-325",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2011,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "In an experiment to determine the percentage of humus and water in a soil sample, the following results were obtained. \nWeight of the evaporating basin alone = 80.5g   Weight of basin and soil = 101.5g    Weight after drying the soil in the oven = 99.0g    Weight of basin and roasted soil = 95.5h\nThe percentage of humus in the soil sample is",
    "options": {
      "A": "17.60%",
      "B": "26.70%",
      "C": "16.20%",
      "D": "16.70%"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2011"
    ]
  },
  {
    "id": "aloc-273",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2010,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Yeast respires anaerobically  to covert simple sugar to carbon (IV) oxide and",
    "options": {
      "A": "alcohol",
      "B": "acid",
      "C": "oxygen",
      "D": "water"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2010"
    ]
  },
  {
    "id": "aloc-14",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2003,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "In mammalian males, the excretory and reproductive  systems share the",
    "options": {
      "A": "ureter",
      "B": "vas deferens",
      "C": "urethra",
      "D": "Testes."
    },
    "answer": "C",
    "explanation": "The correct answer is option C.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2003"
    ]
  },
  {
    "id": "aloc-38",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2003,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "An argument against Lamarck’s theory of evolution is that",
    "options": {
      "A": "disuse of  body part cannot weaken the part",
      "B": "disused part is dropped off in the offspring",
      "C": "acquired traits cannot be passed onto the offspring",
      "D": "traits cannot be acquired through constant use of body parts"
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2003"
    ]
  },
  {
    "id": "aloc-2",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2003,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "One distinctive feature in the life history  of liverworts is that they exhibit",
    "options": {
      "A": "alternation of generation",
      "B": "vegetative reproduction",
      "C": "sexual reproduction",
      "D": "sexual reproduction"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2003"
    ]
  },
  {
    "id": "aloc-376",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Which of the following is true in blood transfusion?",
    "options": {
      "A": "a person of blood group AB can donate blood only to another person of blood group AB",
      "B": "Persons of blood groups A and B can donate or receive blood from each other",
      "C": "A person of blood group AB can receive blood only from persons of blood group A or B",
      "D": "A person of blood group O can donate only to a person of blood group O."
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-382",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The significance of a very large number  of termites involved in nuptial swarming is to",
    "options": {
      "A": "provide birds with plenty of food",
      "B": "ensure their perpetuation despite predatory pressure",
      "C": "search for a favourable place to breed",
      "D": "ensure that every individual gets a mate."
    },
    "answer": "C",
    "explanation": "The correct answer is option C.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-78",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2004,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Which of the following is an example of intraspecific competition?",
    "options": {
      "A": "a lizard and an ant eater chasing an insect",
      "B": "a worker termite and a solider in a limited space",
      "C": "a hawk and an eagle targeting the same chicken",
      "D": "yam and potato shoots growing out through the same window"
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2004"
    ]
  },
  {
    "id": "aloc-337",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2011,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Lack of space in a population  could lead to an increase in",
    "options": {
      "A": "birth rate",
      "B": "disease rate",
      "C": "drought",
      "D": "water  scarcity"
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2011"
    ]
  },
  {
    "id": "aloc-106",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2005,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The mambilla plateau is a unique Nigeria biome located in",
    "options": {
      "A": "Plateau State",
      "B": "Borno state",
      "C": "Taraba state",
      "D": "Benue state"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2005"
    ]
  },
  {
    "id": "aloc-105",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2005,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "At which temperature will cockroaches not survive after 10 days?",
    "options": {
      "A": "15oC",
      "B": "19oC",
      "C": "24oC",
      "D": "33oC"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2005"
    ]
  },
  {
    "id": "aloc-96",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2005,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The function of the fluid filled pericardium is to",
    "options": {
      "A": "reduce the friction caused by the pumping movements of the heart",
      "B": "supply the heart with oxygen and nutrients",
      "C": "prevent disease organisms from attacking the heart",
      "D": "reduce the  intensity of the pumping action of the heart"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2005"
    ]
  },
  {
    "id": "aloc-125",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2006,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Population that doubles in size to constant intervals is an indication of",
    "options": {
      "A": "sigmoid",
      "B": "population explosion",
      "C": "rapid growth",
      "D": "exponential growth"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2006"
    ]
  },
  {
    "id": "aloc-356",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "In the mammalian male reproductive system, the part that serves as a passage for both urine and semen is the",
    "options": {
      "A": "urethra",
      "B": "ureter",
      "C": "bladder",
      "D": "seminal vesicle"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-384",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "From his study of Galapagos finches, Darwin derived his theory of evolution from",
    "options": {
      "A": "comparative anatomy",
      "B": "comparative physiology",
      "C": "fossil remains",
      "D": "comparative embryology."
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-214",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2008,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "A boy who is fond of swimming in a pond finds himself passing urine with traces of blood. He is likely to have contracted",
    "options": {
      "A": "Schistosomiasis",
      "B": "onchoerciasis",
      "C": "poliomyelitis",
      "D": "salmonellosis"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2008"
    ]
  },
  {
    "id": "aloc-172",
    "subject": "Biology",
    "topic": "General",
    "subtopic": "",
    "year": 2007,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The organs that will be most useful  to giant  African rats in finding their way in underground habitats are the",
    "options": {
      "A": "Eyes",
      "B": "vibrissae",
      "C": "tails",
      "D": "Nostrils"
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "biology",
      "jamb",
      "2007"
    ]
  },
  {
    "id": "aloc-10",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2001,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The pollution from petroleum spillage in rivers and lakes can best be dispersed by",
    "options": {
      "A": "Pouring detergents",
      "B": "Passing of ships through the area",
      "C": "Pouring organic solvents",
      "D": "Evaporation"
    },
    "answer": "A",
    "explanation": "The correct answer is option A.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2001"
    ]
  },
  {
    "id": "aloc-132",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2004,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The property of chlorine which causes hydrogen chloride to be more ionic than the chlorine molecule is its",
    "options": {
      "A": "Electrovalency",
      "B": "Electron affinity",
      "C": "Electropositivity",
      "D": "Electronegativity"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2004"
    ]
  },
  {
    "id": "aloc-390",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2016,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "An example of a solid emulsion is",
    "options": {
      "A": "Butter",
      "B": "Hair cream",
      "C": "Milk",
      "D": "Cod-liver oil"
    },
    "answer": "A",
    "explanation": "Butter is a solid emulsion — it is water droplets dispersed in a solid fat matrix. Milk is a liquid emulsion (fat droplets in water). Hair cream is a semi-solid emulsion (liquid in liquid). Cod-liver oil is a pure oil, not an emulsion. Therefore butter is the correct example of a solid emulsion.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2016"
    ]
  },
  {
    "id": "aloc-694",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2023,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Balance the following redox reaction: Fe₂O₃ + CO → Fe + CO₂",
    "options": {
      "A": "Fe₂O₃ + CO → 2Fe + 2CO₂",
      "B": "2Fe₂O₃ + 3CO → 4Fe + 3CO₂",
      "C": "Fe₂O₃ + 2CO → 2Fe + 2CO₂",
      "D": "Fe₂O₃ + 3CO → 2Fe + 3CO₂"
    },
    "answer": "D",
    "explanation": "Balancing Fe₂O₃ + CO → Fe + CO₂. Fe: 2 on left, so 2Fe on right. O: Fe₂O₃ has 3 oxygen atoms. Each CO takes 1 oxygen to become CO₂, so 3CO are needed to remove all 3 oxygens: Fe₂O₃ + 3CO → 2Fe + 3CO₂. Check: Fe: 2=2; O: 3+3=6 on left, 6 on right; C: 3=3. Balanced.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2023"
    ]
  },
  {
    "id": "aloc-193",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2005,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Equal moles of ethyne and hydrogen iodide react to give",
    "options": {
      "A": "CH2 = CH2",
      "B": "CH2 = CHI",
      "C": "CH2 – CHI",
      "D": "CH2 – CI3"
    },
    "answer": "B",
    "explanation": "The correct answer is option B.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2005"
    ]
  },
  {
    "id": "aloc-20",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2001,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Which of the following best explains the increase in the rate of a chemical reaction as the temperature rises",
    "options": {
      "A": "The bonds in the reacting molecules are more readily broken",
      "B": "The molecules collisions become more violent",
      "C": "A lower proportion of the molecules has the necessary minimum energy to react",
      "D": "The collision frequency of the molecules increases"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2001"
    ]
  },
  {
    "id": "aloc-192",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2005,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Sugar is separated from its impurities by",
    "options": {
      "A": "Distillation",
      "B": "Evaporation",
      "C": "Precipitation",
      "D": "Crystallization"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2005"
    ]
  },
  {
    "id": "aloc-143",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2004,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "ZnO(s) + CO (g) → Zn(s) + CO2 (g).",
    "options": {
      "A": "Decomposed",
      "B": "Displaced",
      "C": "Oxidized",
      "D": "Reduced"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2004"
    ]
  },
  {
    "id": "aloc-294",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2010,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The residual solids from the fractional distillation of petroleum are used as",
    "options": {
      "A": "Raw materials for the cracking process",
      "B": "Fuel for driving tractors",
      "C": "Fuel for jet engines",
      "D": "Coatings for pipes"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2010"
    ]
  },
  {
    "id": "aloc-357",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2016,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The enzyme used in the hydrolysis of starch to dextrin and maltose is",
    "options": {
      "A": "Zymase",
      "B": "Sucrase",
      "C": "Amylase",
      "D": "Lactase"
    },
    "answer": "C",
    "explanation": "Amylase is the enzyme responsible for the hydrolysis of starch, breaking it down first into dextrin and then into maltose. Zymase converts sugars to ethanol; sucrase hydrolyses sucrose; lactase hydrolyses lactose.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2016"
    ]
  },
  {
    "id": "aloc-784",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2025,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Carbohydrates can generally be represented by the general formula Cₓ(H₂O)ᵧ. For fructose the value of x is",
    "options": {
      "A": "3",
      "B": "12",
      "C": "5",
      "D": "6"
    },
    "answer": "D",
    "explanation": "Fructose has the molecular formula C₆H₁₂O₆. Written in the form Cₓ(H₂O)ᵧ: C₆(H₂O)₆, so x = 6 and y = 6. The value of x is 6.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2025"
    ]
  },
  {
    "id": "aloc-705",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2023,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "What is the principal ore of iron, from which iron is extracted?",
    "options": {
      "A": "Calcite",
      "B": "Bauxite",
      "C": "Magnetite",
      "D": "Hematite"
    },
    "answer": "D",
    "explanation": "The principal ore of iron used for large-scale extraction is hematite (Fe₂O₃), also spelled haematite. It contains a high percentage of iron and is widely available. Iron is extracted from hematite in a blast furnace using coke and limestone. Bauxite is the ore of aluminium, calcite is a form of calcium carbonate, and magnetite (Fe₃O₄) is another iron ore but less commonly used as the principal source.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2023"
    ]
  },
  {
    "id": "aloc-565",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2020,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "When water drops are added to calcium carbide in a container and the gas produced is passed through a jet and lighted, the resultant flame is called an?",
    "options": {
      "A": "Oxyethene",
      "B": "Oxyhydrocarbon flame",
      "C": "Oxyacetylene flame",
      "D": "Oxymethane flame"
    },
    "answer": "C",
    "explanation": "Calcium carbide (CaC₂) reacts with water to produce acetylene gas (ethyne, C₂H₂): CaC₂ + 2H₂O → Ca(OH)₂ + C₂H₂. When acetylene is burned in the presence of oxygen, it produces the oxyacetylene flame, which reaches temperatures above 3000°C and is used in welding and cutting metals.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2020"
    ]
  },
  {
    "id": "aloc-334",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2015,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "All these are electromagnetic waves except",
    "options": {
      "A": "White light",
      "B": "Photon",
      "C": "X-ray",
      "D": "Infrared"
    },
    "answer": "B",
    "explanation": "A photon is a quantum (particle) of electromagnetic energy, not a type of electromagnetic wave. White light, X-rays, and infrared radiation are all types of electromagnetic waves within the electromagnetic spectrum.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2015"
    ]
  },
  {
    "id": "aloc-232",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2006,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The element with the electron configuration 1s22s22p3 is",
    "options": {
      "A": "Oxygen",
      "B": "Chlorine",
      "C": "Nitrogen",
      "D": "Calcium"
    },
    "answer": "C",
    "explanation": "The correct answer is option C.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2006"
    ]
  },
  {
    "id": "aloc-732",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2024,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "127g of sodium chloride was dissolved in 1.0dm³ of distilled water at 25°C. Determine the solubility in moldm⁻³ of sodium chloride at that temperature. [Na = 23, Cl = 35.5]",
    "options": {
      "A": "1",
      "B": "2",
      "C": "2.2",
      "D": "4.1"
    },
    "answer": "C",
    "explanation": "Molar mass of NaCl = 23 + 35.5 = 58.5 g/mol. Moles of NaCl = 127 ÷ 58.5 = 2.17 mol. Volume = 1.0 dm³. Solubility = 2.17 ÷ 1.0 = 2.17 mol/dm³ ≈ 2.2 mol/dm³.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2024"
    ]
  },
  {
    "id": "aloc-432",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2017,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The alkyl group is represented by the general formula",
    "options": {
      "A": "CₙH₂ₙ",
      "B": "CₙH₂ₙ - 2",
      "C": "CₙH₂ₙ + 1",
      "D": "CₙH₂ₙ + 2"
    },
    "answer": "C",
    "explanation": "An alkyl group is derived from an alkane by removing one hydrogen atom. Alkanes have the formula CₙH₂ₙ₊₂, so removing one H gives the alkyl group CₙH₂ₙ₊₁. Examples: methyl (CH₃, n=1), ethyl (C₂H₅, n=2), propyl (C₃H₇, n=3).",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2017"
    ]
  },
  {
    "id": "aloc-425",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2017,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "²²⁶₈₈Ra → ˣ₈₆Rn + alpha particle. What is the value of x?",
    "options": {
      "A": "226",
      "B": "220",
      "C": "227",
      "D": "222"
    },
    "answer": "D",
    "explanation": "In alpha decay, the mass number decreases by 4 and the atomic number decreases by 2. Mass number of Rn = 226 - 4 = 222. Atomic number of Rn = 88 - 2 = 86. Therefore x = 222, giving ²²²₈₆Rn.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2017"
    ]
  },
  {
    "id": "aloc-752",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2024,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "When Sulphur(IV)oxide is passed into solution of acidified tetraoxomanganate(VII), the colour changes from",
    "options": {
      "A": "blue to green",
      "B": "pink to yellow",
      "C": "purple to colourless",
      "D": "Orange to green"
    },
    "answer": "C",
    "explanation": "Acidified potassium tetraoxomanganate(VII) (KMnO₄) is purple in colour. SO₂ acts as a reducing agent, reducing the purple MnO₄⁻ ions (Mn oxidation state +7) to colourless Mn²⁺ ions (oxidation state +2). The SO₂ is simultaneously oxidised to SO₄²⁻. The purple colour of the KMnO₄ solution is therefore discharged, turning the solution colourless.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2024"
    ]
  },
  {
    "id": "aloc-538",
    "subject": "Chemistry",
    "topic": "General",
    "subtopic": "",
    "year": 2019,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂\nThe indicator most suitable for this reaction should have a pH equal to",
    "options": {
      "A": "5",
      "B": "7",
      "C": "3",
      "D": "9"
    },
    "answer": "A",
    "explanation": "Na₂CO₃ is a weak base and HCl is a strong acid. At the equivalence point, the resulting solution is slightly acidic with pH around 3.9–5. A suitable indicator must change colour within this range. pH 5 falls within this acidic region. Answer: A.",
    "difficulty": "medium",
    "tags": [
      "chemistry",
      "jamb",
      "2019"
    ]
  },
  {
    "id": "aloc-761",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2007,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "I. Mass\nII. Density\nIII. Temperature\nIV. Nature of substance\n\n\nwhich of the above affect diffusion?",
    "options": {
      "A": "I and II only",
      "B": "I,II and IV only",
      "C": "II, III and IV only",
      "D": "I, II, III and IV"
    },
    "answer": "D",
    "explanation": "Diffusion rates of a substance generally depend on mass, density, and temperature. and nature of substances I II, III, and IV",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2007"
    ]
  },
  {
    "id": "aloc-174",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2015,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The two liquids which are often used in thermometer on experiment basic is known as",
    "options": {
      "A": "Mercury only",
      "B": "Alcohol and Water",
      "C": "Mercury and Alcohol",
      "D": "Alcohol only"
    },
    "answer": "C",
    "explanation": "Mercury and alcohol are often used in THERMOMETER\n\nNote:Water is never allowed to be used in thermometer because, it doesn’t expand uniformly",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2015"
    ]
  },
  {
    "id": "aloc-926",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2010,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Power supply is transmitted at a very high voltage and low current in order to?",
    "options": {
      "A": ". make pass through the trasformers",
      "B": "ncrease the power supply",
      "C": "make it travel fast",
      "D": "prevent overheating of the coil"
    },
    "answer": "D",
    "explanation": "High voltage and low current are used to prevent overheating of the transmission lines.",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2010"
    ]
  },
  {
    "id": "aloc-874",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2009,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The ability of the human eye to focus object on the retina is referred to as the power of?",
    "options": {
      "A": "interference",
      "B": "diffraction",
      "C": "accomodation",
      "D": "superposition"
    },
    "answer": "C",
    "explanation": "Accommodation is the adjustment of the optics of the eye to keep an object in focus on the retina as its distance from the eye varies.",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2009"
    ]
  },
  {
    "id": "aloc-541",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2023,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "An explosion occurs at an altitude of 312 m above the ground. If the air temperature is -10.00°C, how long does it take the sound to reach the ground? [velocity of sound at 0°C = 331 ms⁻¹]",
    "options": {
      "A": "0.94s",
      "B": "0.96s",
      "C": "0.93s",
      "D": "0.95s"
    },
    "answer": "B",
    "explanation": "Given information:\n\nHeight (distance), d = 312 m\nAir temperature, T = -10.00°C\nVelocity of sound at 0°C, v₀ = 331 m/s\nTime, t = ?\n\nSolution:\nStep 1: Calculate velocity of sound at -10°C\nThe velocity of sound in air varies with temperature:\nv = v₀ + 0.6T\nWhere T is in degrees Celsius.\nv = 331 + 0.6(-10)\nv = 331 - 6\nv = 325 m/s\nStep 2: Calculate time for sound to travel\nUsing the formula:\nt = d/v\nt = 312/325\nt = 0.96 s",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2023"
    ]
  },
  {
    "id": "aloc-706",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2006,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "what is likely to happen if the glass of a thermometer expands more upon heating than the liquid inside?",
    "options": {
      "A": "the glass will break",
      "B": "the glass will shrink",
      "C": "the liquid will rise up in the stem",
      "D": "the liquid will go down in the stem"
    },
    "answer": "D",
    "explanation": "when the glass of a thermometer expands more on heating than the liquid inside, the liquid level would fall compared with the tube wall",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2006"
    ]
  },
  {
    "id": "aloc-475",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2022,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "When the plate area of a capacitor increases?",
    "options": {
      "A": "the voltage can withstand increase",
      "B": "the capacitance decreases",
      "C": "the capacitance is unaffected",
      "D": "the capacitance increases"
    },
    "answer": "D",
    "explanation": "Step 1: Recall the capacitance formula\nFor a parallel plate capacitor:\nC = ε₀εᵣA/d\nWhere:\n\nC = capacitance\nε₀ = permittivity of free space\nεᵣ = relative permittivity of dielectric\nA = plate area\nd = distance between plates\n\nStep 2: Analyze the relationship\nFrom the formula:\n\nCapacitance is directly proportional to plate area (A)\nC ∝ A\n\nStep 3: Determine the effect\nWhen plate area (A) increases:\n\nThe numerator of the fraction increases\nTherefore, capacitance (C) increases",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2022"
    ]
  },
  {
    "id": "aloc-668",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2005,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "A 3 m³ volume of liquid W of density 200 kg m⁻³ is mixed with another liquid L of volume 7 m³ and density 150 kg m⁻³. The density of the mixture is?",
    "options": {
      "A": "165 kg m⁻³",
      "B": "100 kg m⁻³",
      "C": "265 kg m⁻³",
      "D": "350 kg m⁻³"
    },
    "answer": "A",
    "explanation": "Given information:\nVolume of liquid W, V_W = 3 m³\nDensity of liquid W, ρ_W = 200 kg m⁻³\nVolume of liquid L, V_L = 7 m³\nDensity of liquid L, ρ_L = 150 kg m⁻³\n\nStep 1: Compute total mass\nMass of W: m_W = ρ_W × V_W = 200 × 3 = 600 kg\nMass of L: m_L = ρ_L × V_L = 150 × 7 = 1050 kg\nTotal mass: m_total = 600 + 1050 = 1650 kg\n\nStep 2: Compute total volume\nTotal volume: V_total = V_W + V_L = 3 + 7 = 10 m³\n\nStep 3: Compute density of mixture\nDensity ρ_mix = m_total / V_total = 1650 / 10 = 165 kg m⁻³",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2005"
    ]
  },
  {
    "id": "aloc-1088",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2014,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "What happens when three coplanar non-parallel forces are in equilibrium?",
    "options": {
      "A": "Their lines of action are parallel.",
      "B": "They are represented in magnitude only",
      "C": "They are represented in direction only",
      "D": "Their lines of action meet at a point"
    },
    "answer": "D",
    "explanation": "Conditions for non-parallel coplanar forces",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2014"
    ]
  },
  {
    "id": "aloc-581",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2024,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "In a series resonant circuit, the current flowing in the circuit is",
    "options": {
      "A": "maximum",
      "B": "minimum",
      "C": "zero",
      "D": "unaffected"
    },
    "answer": "A",
    "explanation": "At resonance, the circuit's impedance is at its lowest (equal to the resistance), which results in the highest current flow. This condition is achieved when the inductive reactance and capacitive reactance are equal, causing them to cancel each other out.",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2024"
    ]
  },
  {
    "id": "aloc-1026",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "After reflection from the concave mirror, rays of light from the sun converges",
    "options": {
      "A": "at the radius of curvature",
      "B": "at the focus",
      "C": "beyond the radius of curvature",
      "D": "between the focus and radius of curvature"
    },
    "answer": "B",
    "explanation": "After reflection from a concave mirror, rays of light from the sun (which are parallel rays) converge at the focus. This is the fundamental property that defines the focal point of a concave mirror.\nPractical example: If you hold a concave mirror in sunlight and place paper at the focal point, the concentrated solar energy can ignite the paper, demonstrating how all the parallel sun rays converge at this single point.",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-1121",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2025,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The power of a lens in diopters is",
    "options": {
      "A": "3f",
      "B": "1/f",
      "C": "2f",
      "D": "f"
    },
    "answer": "B",
    "explanation": "Given information:\nThe power of a lens is defined as the reciprocal of its focal length (in metres).\n\nSolution:\n\nStep 1: Formula for power of a lens\nPower P (in dioptres) = 1 / f, where f is the focal length in metres.",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2025"
    ]
  },
  {
    "id": "aloc-775",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2007,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "From the diagram above, the bob of the pendulum has the fastest speed at",
    "options": {
      "A": "X",
      "B": "Y",
      "C": "Z",
      "D": "W"
    },
    "answer": "A",
    "explanation": "Energy considerations:\nAt the extremes (W and Z):\n\nMaximum potential energy\nMinimum kinetic energy (velocity = 0)\nBob momentarily stops before reversing direction\n\nAt the lowest point (X):\n\nMinimum potential energy\nMaximum kinetic energy\nAll potential energy converted to kinetic energy\nFastest speed\n\nAt intermediate positions (Y):\n\nMixed potential and kinetic energy\nSpeed between zero and maximum\n\nConservation of energy:\nTotal Energy = PE + KE = constant\nAt extremes: E = PE_max + 0\nAt lowest point: E = PE_min + KE_max\nTherefore: KE_max occurs at lowest point (X)",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2007"
    ]
  },
  {
    "id": "aloc-891",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2009,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "The wave phenomenon demonstrated in the diagram above is?",
    "options": {
      "A": "reflection",
      "B": "deflection",
      "C": "diffraction",
      "D": "refraction"
    },
    "answer": "C",
    "explanation": "Diffraction is spreading of wave after passing through a sli",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2009"
    ]
  },
  {
    "id": "aloc-1016",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2012,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Calculate the temperature change when 500 J of heat is supplied to 100 g of water.\n[specific heat capacity of water = 4200 J kg⁻¹ K⁻¹]",
    "options": {
      "A": "12.1 °C",
      "B": "2.1 °C",
      "C": "1.2 °C",
      "D": "0.1 °C"
    },
    "answer": "C",
    "explanation": "Given information:\nHeat supplied, Q = 500 J\nMass of water, m = 100 g = 0.1 kg\nSpecific heat capacity of water, c = 4200 J kg⁻¹ K⁻¹\n\nSolution:\n\nStep 1: Heat formula\nThe heat required to change the temperature of a substance is given by:\nQ = m × c × Δθ\nwhere Δθ is the temperature change.\n\nStep 2: Rearrange for Δθ\nΔθ = Q / (m × c)\n\nStep 3: Substitute values\nΔθ = 500 J / (0.1 kg × 4200 J kg⁻¹ K⁻¹)\nΔθ = 500 / (420)\n\nStep 4: Calculate\nΔθ = 1.1905 °C ≈ 1.2 °C",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2012"
    ]
  },
  {
    "id": "aloc-600",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2004,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "A generator manufacturing company was contracted to produce an a.c dynamo but inadvertently produced a d.c dynamo. To correct this error, the",
    "options": {
      "A": "armature coil should be made of silver",
      "B": "commutator should be replaced with slip ring",
      "C": "commutator should be replaced with split rings",
      "D": "armature coil should be made of aluminium"
    },
    "answer": "B",
    "explanation": "To convert a DC dynamo to an AC dynamo, the split-ring commutator must be replaced with slip rings. This allows the alternating current generated in the rotating coil to be delivered to the external circuit without rectification.",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2004"
    ]
  },
  {
    "id": "aloc-286",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2018,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "Which of the following best describes the energy changes which take place when a steam engine drives a generator which lights a lamp?",
    "options": {
      "A": "heat ----> Light----> Sound ----> Kinetic",
      "B": "Kinetic ----> Light ----> Heat ----> Electricity",
      "C": "heat ----> Kinetic ----> Electricity ----> Heat and Light",
      "D": "electricity ----> Kinetic ----> Heat ----> Light"
    },
    "answer": "C",
    "explanation": "The steam engine uses the Heat supplied from steam to supply kinetic energy into the generator which converts it to electricity to light the lamp, the lamp gives out light and heat as it works",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2018"
    ]
  },
  {
    "id": "aloc-65",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2009,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "A man of mass 50kg ascends a flight of stair 5m high in 5 seconds. If acceleration due to gravity is 10ms-2 the power expanded is",
    "options": {
      "A": "100W",
      "B": "300W",
      "C": "250W",
      "D": "500W"
    },
    "answer": "D",
    "explanation": "The correct answer is option D.",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2009"
    ]
  },
  {
    "id": "aloc-360",
    "subject": "Physics",
    "topic": "General",
    "subtopic": "",
    "year": 2019,
    "exam_body": "JAMB",
    "type": "MCQ",
    "question": "In the molecular explanation of conduction, heat is transferred by the",
    "options": {
      "A": "Free electrons",
      "B": "Free atoms",
      "C": "Free molecules",
      "D": "Free solids"
    },
    "answer": "A",
    "explanation": "In the molecular explanation of conduction, heat is transferred primarily by free electrons, especially in metallic conductors where these electrons can move freely and carry thermal energy.",
    "difficulty": "medium",
    "tags": [
      "physics",
      "jamb",
      "2019"
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EXAMEDGE_QUESTIONS;
}
