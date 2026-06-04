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
    # Core / Compulsory
    "english":              "English Language",
    "mathematics":          "Mathematics",

    # Sciences
    "physics":              "Physics",
    "chemistry":            "Chemistry",
    "biology":              "Biology",
    "further-mathematics":  "Further Mathematics",
    "agricultural-science": "Agricultural Science",
    "computer-studies":     "Computer Science",

    # Arts & Humanities
    "literature-in-english": "Literature in English",
    "government":            "Government",
    "history":               "History",
    "christian-religious-studies": "Christian Religious Studies",
    "islamic-religious-studies":   "Islamic Religious Studies",
    "fine-art":              "Fine & Applied Arts",

    # Commercial
    "economics":             "Economics",
    "commerce":              "Commerce",
    "accounting":            "Financial Accounting",
    "office-practice":       "Office Practice",

    # Social Sciences & Others
    "geography":             "Geography",
    "civic-education":       "Civic Education",
    "french":                "French",
    "yoruba":                "Yoruba",
    "igbo":                  "Igbo",
    "hausa":                 "Hausa"
}

TOPICS_MAPPING = {
    "Mathematics": {
        "Calculus": [
            "differentiate", "integrate", "dy/dx", "derivative", "gradient of a curve",
            "rate of change", "∫", "d/dx", "turning point", "maxima", "minima", "stationary",
            "limits", "first principle", "chain rule", "product rule", "quotient rule"
        ],
        "Algebra": [
            "factori", "quadratic", "polynomial", "simultaneous", "inequality", "binary operation",
            "variation", "sequence", "series", "arithmetic progression", "geometric progression",
            "matrix", "matrices", "determinant", "logarithm", "indices", "surd", "function",
            "inverse function", "remainder theorem", "factor theorem", "partial fraction",
            "binomial theorem", "permutation", "combination", "set", "Venn diagram", "modular arithmetic"
        ],
        "Geometry": [
            "triangle", "circle theorem", "angle", "polygon", "bearing", "locus", "chord",
            "arc", "sector", "cyclic quadrilateral", "perpendicular bisector", "tangent",
            "similar triangle", "transformation", "reflection", "rotation", "translation",
            "enlargement", "coordinate geometry", "straight line", "gradient of line",
            "distance between two points", "midpoint", "equation of circle"
        ],
        "Statistics & Probability": [
            "mean", "median", "mode", "probability", "frequency table", "histogram", "ogive",
            "cumulative frequency", "standard deviation", "variance", "pie chart",
            "bar chart", "interquartile range", "range", "dispersion", "normal distribution",
            "random variable", "expected value"
        ],
        "Mensuration": [
            "area", "volume", "perimeter", "surface area", "cylinder", "cone", "sphere",
            "cuboid", "cube", "trapezium", "circumference", "length of arc", "sector area",
            "prism", "frustum", "pyramid"
        ],
        "Number & Numeration": [
            "fraction", "decimal", "percentage", "ratio", "proportion", "number base", "binary",
            "significant figure", "approximation", "HCF", "LCM", "prime factor", "modular",
            "simple interest", "compound interest", "profit", "loss", "discount", "share",
            "depreciation", "annuity", "hire purchase"
        ],
        "Trigonometry": [
            "sin", "cos", "tan", "sine rule", "cosine rule", "elevation", "depression",
            "angle of inclination", "trigonometric identity", "radians", "degrees",
            "bearing and distance"
        ]
    },
    "English Language": {
        "Vocabulary": [
            "nearest in meaning", "opposite in meaning", "antonym", "synonym", "italics",
            "underlined word", "word or phrase", "idiom", "proverb", "phrasal verb",
            "collocation", "connotation", "denotation", "register", "formal", "informal"
        ],
        "Grammar": [
            "fill the gap", "complete the gap", "correct option", "tense", "passive voice",
            "active voice", "reported speech", "indirect speech", "concord", "agreement",
            "pronoun", "article", "preposition", "conjunction", "relative clause", "gerund",
            "infinitive", "modal verb", "conditional", "question tag", "punctuation",
            "clause", "phrase", "sentence structure", "word order"
        ],
        "Oral English": [
            "stress", "vowel sound", "consonant sound", "syllable", "intonation", "rhyme",
            "phoneme", "pronunciation", "capital letter underlined", "emphatic stress",
            "word stress pattern", "different stress", "same vowel", "same consonant"
        ],
        "Comprehension & Summary": [
            "passage", "paragraph", "the writer", "according to the passage", "best title",
            "tone of the passage", "main idea", "inference", "summary question"
        ],
        "Literature in English": [
            "novel", "play", "poem", "character", "theme", "plot", "Wole Soyinka", "Achebe",
            "Forcados", "Things Fall Apart", "Purple Hibiscus", "author", "literary device",
            "figure of speech", "metaphor", "simile", "personification", "alliteration"
        ]
    },
    "Physics": {
        "Mechanics": [
            "force", "velocity", "acceleration", "momentum", "Newton's law", "inertia",
            "friction", "pressure", "density", "work done", "kinetic energy", "potential energy",
            "power", "simple machine", "mechanical advantage", "velocity ratio", "efficiency",
            "projectile", "circular motion", "gravity", "gravitational", "weight", "mass",
            "equilibrium", "moment", "torque", "elasticity", "Hooke's law", "stress", "strain",
            "Young modulus", "terminal velocity", "Archimedes", "upthrust", "floatation"
        ],
        "Electricity & Magnetism": [
            "current", "voltage", "resistance", "Ohm's law", "circuit", "series circuit",
            "parallel circuit", "capacitor", "capacitance", "electric power", "electrical energy",
            "transformer", "electric field", "potential difference", "EMF", "charge",
            "coulomb", "watt", "kilowatt-hour", "ammeter", "voltmeter", "rheostat", "solenoid",
            "magnetic field", "electromagnetism", "motor", "generator", "induction", "flux",
            "Faraday's law", "Lenz's law", "magnetic flux"
        ],
        "Waves & Optics": [
            "wave", "frequency", "wavelength", "amplitude", "period", "electromagnetic spectrum",
            "sound wave", "light wave", "radio wave", "microwave", "infrared", "ultraviolet",
            "x-ray", "gamma ray", "speed of sound", "speed of light", "diffraction",
            "interference", "reflection", "refraction", "resonance", "lens", "mirror", "focal length",
            "image formation", "magnification", "eye defect", "short-sighted", "long-sighted",
            "converging lens", "diverging lens", "concave mirror", "convex mirror",
            "total internal reflection", "critical angle", "prism", "dispersion of light",
            "refractive index", "Snell's law"
        ],
        "Heat & Thermodynamics": [
            "temperature", "heat energy", "thermometer", "Kelvin", "Celsius", "Fahrenheit",
            "thermal expansion", "specific heat capacity", "latent heat", "heat of fusion",
            "heat of vaporization", "conduction", "convection", "radiation", "evaporation",
            "boiling point", "melting point", "sublimation", "states of matter",
            "Charles's law", "Boyle's law", "pressure law", "ideal gas"
        ],
        "Nuclear & Modern Physics": [
            "radioactive", "alpha particle", "beta particle", "gamma ray", "half-life",
            "nuclear fission", "nuclear fusion", "radioactive decay", "proton number",
            "mass number change", "binding energy", "photoelectric effect", "X-rays",
            "cathode ray", "thermionic emission"
        ]
    },
    "Chemistry": {
        "Atomic Structure & Periodic Table": [
            "atomic number", "mass number", "electron configuration", "proton", "neutron",
            "isotope", "periodic table", "period", "group", "valence electron", "ionization energy",
            "electron affinity", "electronegativity", "atomic radius", "ionic radius"
        ],
        "Chemical Bonding": [
            "ionic bond", "covalent bond", "metallic bond", "hydrogen bond", "van der Waals",
            "polar molecule", "electrovalent", "coordinate bond", "dative bond",
            "hybridization", "sigma bond", "pi bond", "bond angle", "bond length",
            "intermolecular forces", "giant structure", "simple molecular"
        ],
        "Acids, Bases & Salts": [
            "acid", "base", "alkali", "pH scale", "neutral solution", "salt formation",
            "indicator", "litmus", "universal indicator", "neutralization", "buffer solution",
            "titration", "hydrolysis", "strong acid", "weak acid", "strong base", "weak base",
            "oxides", "amphoteric"
        ],
        "Organic Chemistry": [
            "alkane", "alkene", "alkyne", "alcohol", "aldehyde", "ketone", "carboxylic acid",
            "ester", "amine", "amide", "polymer", "monomer", "addition polymerization",
            "condensation polymerization", "fermentation", "isomerism", "IUPAC name",
            "hydrocarbon", "benzene", "aromatic", "functional group", "ethanol", "ethene",
            "methane", "propane", "butane", "substitution reaction", "addition reaction",
            "elimination reaction", "saponification", "esterification"
        ],
        "Stoichiometry & Calculations": [
            "mole concept", "molar mass", "concentration", "molarity", "mol/dm3",
            "balanced equation", "percentage yield", "limiting reagent", "excess reagent",
            "empirical formula", "molecular formula", "relative molecular mass",
            "percentage composition", "stoichiometric calculation", "Avogadro"
        ],
        "Physical Chemistry": [
            "rate of reaction", "chemical equilibrium", "Le Chatelier's principle",
            "catalyst", "activation energy", "Boyle's law", "Charles's law", "Graham's law",
            "Avogadro's law", "ideal gas equation", "enthalpy change", "exothermic",
            "endothermic", "Hess's law", "entropy", "spontaneous reaction",
            "collision theory", "energy profile diagram"
        ],
        "Metals, Alloys & Industry": [
            "reactivity series", "extraction of metals", "blast furnace", "steel", "bronze",
            "brass", "cast iron", "wrought iron", "aluminium extraction", "Haber process",
            "Contact process", "Solvay process", "alloy", "corrosion prevention",
            "sacrificial anode", "galvanizing", "electroplating protection"
        ],
        "Electrochemistry & Redox": [
            "electrolysis", "electrode", "anode", "cathode", "electrolyte", "oxidation",
            "reduction", "redox reaction", "electroplating", "Faraday's laws",
            "electrochemical cell", "standard electrode potential", "oxidation state",
            "oxidizing agent", "reducing agent", "half equation", "rusting", "corrosion"
        ]
    },
    "Biology": {
        "Cell Biology": [
            "cell structure", "cell membrane", "nucleus", "mitochondria", "ribosome",
            "chloroplast", "osmosis", "diffusion", "active transport", "organelle",
            "cytoplasm", "cell wall", "vacuole", "plasmolysis", "turgid", "flaccid",
            "endoplasmic reticulum", "Golgi apparatus", "lysosome", "centriole"
        ],
        "Genetics & Evolution": [
            "gene", "chromosome", "DNA", "RNA", "heredity", "dominant allele", "recessive allele",
            "genotype", "phenotype", "Mendel's law", "monohybrid cross", "dihybrid cross",
            "mutation", "evolution", "natural selection", "variation", "identical twins",
            "sex-linked", "sex determination", "codominance", "blood group", "inheritance"
        ],
        "Ecology & Environment": [
            "food chain", "food web", "ecosystem", "habitat", "population ecology",
            "community", "biome", "savanna", "rainforest", "desert", "pollution", "nitrogen cycle",
            "carbon cycle", "water cycle", "symbiosis", "parasitism", "mutualism",
            "commensalism", "predator", "prey", "abiotic factor", "biotic factor",
            "phytoplankton", "soil composition", "ecological succession",
            "conservation", "deforestation", "eutrophication"
        ],
        "Human Biology & Health": [
            "blood group", "heart", "lung", "kidney", "liver", "brain", "stomach", "intestine",
            "hormone", "digestive enzyme", "digestion", "aerobic respiration",
            "anaerobic respiration", "excretion", "nervous system", "bone", "muscle",
            "skin", "eye", "ear", "reproductive system", "uterus", "pregnancy",
            "menstrual cycle", "insulin", "glucagon", "nephron", "neuron", "synapse",
            "leucocyte", "erythrocyte", "platelet", "immunity", "vaccine", "disease",
            "malaria", "HIV", "tuberculosis"
        ],
        "Plant Biology": [
            "photosynthesis", "transpiration", "xylem", "phloem", "root system",
            "stem structure", "leaf structure", "flower structure", "fruit", "seed",
            "germination", "pollination", "fertilization in plants", "stoma", "guard cell",
            "chlorophyll", "tropism", "auxin", "vegetative propagation", "cutting", "grafting",
            "alternation of generations", "moss", "fern", "flowering plant"
        ],
        "Classification & Diversity": [
            "classification", "kingdom", "phylum", "class", "order", "family", "genus", "species",
            "taxonomy", "vertebrate", "invertebrate", "mammal", "reptile", "amphibian", "fish",
            "bird", "insect", "arachnid", "mollusc", "fungi", "bacteria", "virus", "algae",
            "protozoa", "prokaryote", "eukaryote"
        ]
    },
    "Further Mathematics": {
        "Pure Mathematics": [
            "complex number", "real part", "imaginary part", "Argand diagram", "modulus",
            "argument", "De Moivre", "mathematical induction", "proof by induction",
            "binomial series", "Maclaurin series", "Taylor series"
        ],
        "Statistics": [
            "normal distribution", "Poisson distribution", "binomial distribution",
            "hypothesis testing", "confidence interval", "chi-square test",
            "correlation coefficient", "regression line", "scatter diagram"
        ],
        "Mechanics (Further)": [
            "projectile motion", "impulse", "conservation of momentum", "elastic collision",
            "inelastic collision", "center of mass", "moments", "couples", "friction angle",
            "velocity-time graph", "displacement-time graph"
        ]
    },
    "Agricultural Science": {
        "Crop Production": [
            "crop cultivation", "planting", "soil preparation", "fertilizer", "irrigation",
            "weeding", "pest control", "harvesting", "storage of crops", "crop rotation",
            "mixed farming", "monoculture", "cash crop", "food crop", "cereal", "legume",
            "tuber", "vegetable", "fruit crop", "whitespace crop", "arable farming", "plantation crop"
        ],
        "Animal Husbandry": [
            "livestock", "poultry", "cattle", "goat", "sheep", "pig", "fish farming",
            "aquaculture", "feeding", "breeding", "disease control", "vaccination of animals",
            "pen management", "egg production", "milk production", "animal nutrition",
            "pasture management"
        ],
        "Agricultural Economics": [
            "farm management", "farm planning", "marketing of farm produce",
            "cooperative society", "agricultural credit", "land tenure", "farm record",
            "cost of production", "profit in farming", "subsistence farming",
            "commercial farming"
        ],
        "Soils & Land Use": [
            "soil formation", "soil texture", "soil structure", "soil pH", "soil fertility",
            "soil erosion", "soil conservation", "land degradation", "bush fallowing",
            "green manure", "composting", "mulching", "drainage", "irrigation methods"
        ]
    },
    "Computer Science": {
        "Hardware & Software": [
            "computer hardware", "software", "input device", "output device", "CPU",
            "memory", "RAM", "ROM", "storage device", "operating system", "application software",
            "system software", "peripheral device", "motherboard", "processor", "monitor",
            "keyboard", "mouse", "printer", "scanner"
        ],
        "Programming & Logic": [
            "algorithm", "flowchart", "pseudocode", "programming language", "BASIC",
            "variable", "data type", "loop", "conditional statement", "subroutine",
            "array", "function", "debugging", "syntax error", "logic error",
            "binary number", "hexadecimal", "ASCII code", "Boolean algebra",
            "logic gate", "AND gate", "OR gate", "NOT gate", "truth table"
        ],
        "Data & Networks": [
            "database", "data processing", "data storage", "network", "internet",
            "LAN", "WAN", "MAN", "topology", "protocol", "IP address", "website",
            "email", "cybersecurity", "virus", "firewall", "encryption", "e-commerce",
            "spreadsheet", "word processor", "presentation software"
        ]
    },
    "Literature in English": {
        "Poetry": [
            "poem", "verse", "stanza", "rhyme scheme", "rhythm", "meter", "sonnet", "ode",
            "ballad", "imagery", "symbolism", "tone", "mood", "persona", "diction",
            "alliteration", "assonance", "onomatopoeia", "metaphor in poem", "simile in poem"
        ],
        "Prose": [
            "novel", "short story", "narrator", "plot", "setting", "characterization",
            "theme of novel", "conflict", "climax", "resolution", "point of view",
            "Things Fall Apart", "Purple Hibiscus", "The African Child", "Weep Not Child",
            "The River Between", "Season of Migration", "So Long a Letter"
        ],
        "Drama": [
            "play", "act", "scene", "dialogue", "monologue", "soliloquy", "stage direction",
            "tragedy", "comedy", "protagonist", "antagonist", "Death and the King's Horseman",
            "Lion and the Jewel", "Trials of Brother Jero", "Sizwe Banzi", "Our Husband",
            "The Gods are Not to Blame"
        ]
    },
    "Government": {
        "Political Concepts": [
            "democracy", "federalism", "constitution", "rule of law", "separation of powers",
            "fundamental human rights", "citizenship", "sovereignty", "political party",
            "election", "franchise", "suffrage", "pressure group", "public opinion",
            "political socialization", "legitimacy", "authority", "power"
        ],
        "Nigerian Government": [
            "Nigerian constitution", "National Assembly", "House of Representatives",
            "Senate", "executive", "judiciary", "INEC", "local government", "state government",
            "federal government", "Nigerian independence", "military rule", "First Republic",
            "Second Republic", "Third Republic", "Fourth Republic", "ECOWAS", "African Union"
        ],
        "Comparative Government": [
            "presidential system", "parliamentary system", "USA government", "UK government",
            "French government", "communist state", "unitary system", "confederation",
            "cabinet", "prime minister", "bicameral", "unicameral"
        ]
    },
    "Economics": {
        "Microeconomics": [
            "demand", "supply", "elasticity", "price mechanism", "market structure",
            "monopoly", "oligopoly", "perfect competition", "consumer theory", "utility",
            "indifference curve", "budget line", "production theory", "cost of production",
            "revenue", "profit maximization", "factor of production", "land", "labour",
            "capital", "entrepreneur"
        ],
        "Macroeconomics": [
            "national income", "GDP", "GNP", "inflation", "deflation", "unemployment",
            "fiscal policy", "monetary policy", "Central Bank of Nigeria", "money supply",
            "interest rate", "exchange rate", "balance of payments", "trade", "export",
            "import", "economic growth", "development", "poverty"
        ],
        "Nigerian Economy": [
            "Nigerian economic history", "petroleum", "oil", "agriculture in Nigeria",
            "manufacturing", "industrialization", "NNPC", "CBN", "structural adjustment",
            "economic reform", "budget deficit", "external debt", "foreign exchange",
            "naira", "devaluation"
        ]
    },
    "Financial Accounting": {
        "Bookkeeping & Accounts": [
            "double entry", "debit", "credit", "ledger", "journal", "trial balance",
            "trading account", "profit and loss account", "balance sheet", "cash book",
            "bank reconciliation", "petty cash", "day books", "source documents",
            "invoice", "receipt"
        ],
        "Company Accounts": [
            "limited liability company", "shares", "debentures", "dividend", "share capital",
            "reserves", "retained earnings", "published accounts", "partnership accounts",
            "club accounts", "manufacturing account", "departmental accounts"
        ],
        "Accounting Concepts": [
            "going concern", "accruals concept", "consistency", "prudence", "materiality",
            "historical cost", "depreciation", "straight line method", "reducing balance",
            "provision for bad debts", "stock valuation", "FIFO", "LIFO", "AVCO"
        ]
    },
    "Commerce": {
        "Trade & Distribution": [
            "home trade", "foreign trade", "wholesale", "retail", "chain store",
            "supermarket", "cooperative store", "mail order", "e-commerce",
            "channels of distribution", "middlemen", "consumer", "producer",
            "terms of trade", "trade discount", "cash discount"
        ],
        "Business Organizations": [
            "sole trader", "partnership", "limited company", "cooperative",
            "public corporation", "multinational", "franchise", "business formation",
            "memorandum of association", "articles of association", "shares", "debentures"
        ],
        "Banking & Finance": [
            "commercial bank", "central bank", "development bank", "insurance",
            "marine insurance", "life assurance", "fire insurance", "premium", "claim",
            "stock exchange", "capital market", "money market", "foreign exchange",
            "bill of exchange", "promissory note", "cheque", "credit card"
        ]
    },
    "Geography": {
        "Physical Geography": [
            "weather", "climate", "rainfall", "temperature", "humidity", "pressure",
            "wind", "cloud", "atmospheric pressure", "climate zones", "tropical climate",
            "equatorial climate", "desert climate", "geomorphology", "landform",
            "erosion", "weathering", "river", "lake", "ocean", "coastal features",
            "mountain", "plateau", "plain", "earthquake", "volcano", "rock types",
            "rock formation", "soil"
        ],
        "Human Geography": [
            "population", "census", "birth rate", "death rate", "migration", "urbanization",
            "settlement", "land use", "agriculture", "industry", "mining", "transportation",
            "trade routes", "tourism", "development", "developing countries",
            "developed countries", "African countries", "Nigeria geography"
        ],
        "Map Reading": [
            "map", "scale", "contour lines", "grid reference", "compass bearing",
            "topographic map", "cross section", "gradient", "map projection",
            "latitude", "longitude", "atlas", "relief map"
        ]
    },
    "History": {
        "Nigerian History": [
            "pre-colonial Nigeria", "Oyo Empire", "Benin Kingdom", "Hausa states",
            "Sokoto Caliphate", "British colonization", "amalgamation", "indirect rule",
            "Nigerian nationalism", "independence 1960", "Nigerian civil war", "Biafra",
            "military coups", "democratic transition", "ECOWAS", "Lagos"
        ],
        "African History": [
            "African kingdoms", "slave trade", "colonialism", "scramble for Africa",
            "Berlin Conference", "decolonization", "Pan-Africanism", "African Union",
            "apartheid", "Nelson Mandela", "South Africa", "Egyptian history",
            "Ethiopia", "Great Zimbabwe"
        ],
        "World History": [
            "World War I", "World War II", "Cold War", "United Nations", "League of Nations",
            "industrial revolution", "French Revolution", "American Revolution",
            "imperialism", "communism", "capitalism", "democracy"
        ]
    },
    "Christian Religious Studies": {
        "Old Testament": [
            "creation", "Genesis", "Abraham", "Moses", "David", "Solomon", "prophets",
            "Isaiah", "Jeremiah", "Exodus", "Ten Commandments", "covenant", "Psalms",
            "Proverbs", "Job", "Daniel", "Elijah", "Elisha"
        ],
        "New Testament": [
            "Jesus Christ", "gospel", "Matthew", "Mark", "Luke", "John", "Acts of Apostles",
            "Paul's letters", "epistles", "Revelation", "Sermon on the Mount",
            "parables", "miracles of Jesus", "resurrection", "Pentecost", "early church",
            "baptism", "Lord's Prayer"
        ],
        "Christian Living": [
            "church", "prayer", "worship", "faith", "salvation", "sin", "forgiveness",
            "Christian ethics", "marriage in Christianity", "stewardship",
            "evangelism", "mission", "ecumenism", "Nigeria church history"
        ]
    },
    "Islamic Religious Studies": {
        "Quran & Hadith": [
            "Quran", "Surah", "verses", "revelation", "Prophet Muhammad", "Hadith",
            "Sunnah", "Arabic", "Bismillah", "Al-Fatiha", "recitation", "memorization",
            "Tafsir", "Islamic scholarship"
        ],
        "Pillars & Beliefs": [
            "Five Pillars of Islam", "Salat", "prayer", "Zakat", "Sawm", "fasting",
            "Hajj", "Shahadah", "Iman", "belief in Allah", "angels", "prophets",
            "Day of Judgment", "divine decree", "Tawhid", "monotheism"
        ],
        "Islamic History & Law": [
            "early Islamic history", "caliphate", "Abu Bakr", "Umar", "Uthman", "Ali",
            "spread of Islam", "Islam in Nigeria", "Sokoto Caliphate", "Sharia law",
            "Islamic ethics", "family law in Islam", "trade in Islam"
        ]
    },
    "Civic Education": {
        "Citizenship": [
            "citizenship rights", "citizenship duties", "fundamental human rights",
            "civic responsibilities", "voting", "election", "INEC", "rule of law",
            "constitution", "democracy", "patriotism", "national symbols", "national anthem",
            "coat of arms", "national pledge", "independence day"
        ],
        "Governance & Society": [
            "government functions", "three arms of government", "local government",
            "NYSC", "NAFDAC", "EFCC", "ICPC", "social vices", "drug abuse", "cultism",
            "human trafficking", "corruption", "transparency", "accountability",
            "community development", "civil society"
        ]
    },
    "French": {
        "Grammar & Language": [
            "French grammar", "verb conjugation", "noun gender", "adjective agreement",
            "article", "preposition in French", "tense in French", "subjunctive",
            "conditionnel", "passé composé", "imparfait", "futur simple", "pronoun in French"
        ],
        "Vocabulary & Communication": [
            "French vocabulary", "greetings", "everyday phrases", "classroom language",
            "numbers in French", "days", "months", "colors", "food", "family", "travel",
            "shopping", "directions in French"
        ]
    },
    "Yoruba": {
        "Grammar": [
            "grammar rules", "tones", "sentence structure", "parts of speech",
            "verb forms", "noun classes", "pronoun usage", "tense markers"
        ],
        "Literature & Culture": [
            "oral literature", "proverbs", "folklore", "traditional customs",
            "cultural practices", "festivals", "traditional institutions"
        ]
    },
    "Igbo": {
        "Grammar": [
            "grammar rules", "tones", "sentence structure", "parts of speech",
            "verb forms", "noun classes", "pronoun usage", "tense markers"
        ],
        "Literature & Culture": [
            "oral literature", "proverbs", "folklore", "traditional customs",
            "cultural practices", "festivals", "traditional institutions"
        ]
    },
    "Hausa": {
        "Grammar": [
            "grammar rules", "tones", "sentence structure", "parts of speech",
            "verb forms", "noun classes", "pronoun usage", "tense markers"
        ],
        "Literature & Culture": [
            "oral literature", "proverbs", "folklore", "traditional customs",
            "cultural practices", "festivals", "traditional institutions"
        ]
    }
}

def tag_topic(question_text, subject):
    if not question_text:
        return "General"
    
    text_lower = question_text.lower()
    
    mapping = TOPICS_MAPPING.get(subject)
    if not mapping:
        for sub_key in TOPICS_MAPPING:
            if sub_key.lower() == subject.lower():
                mapping = TOPICS_MAPPING[sub_key]
                break
                
    if mapping:
        for topic_name, keywords in mapping.items():
            for kw in keywords:
                if kw.lower() in text_lower:
                    return topic_name
                    
    return "General"

def tag_difficulty(question_text, subject):
    if not question_text:
        return "medium"
    text_lower = question_text.lower()
    
    hard_kws = [
        "derive", "prove", "evaluate ∫", "solve simultaneously", "using the formula",
        "show that", "find the equation of", "calculate the exact", 
        "what is the inverse", "find all values", "differentiate from first principle",
        "applying le chatelier", "by what factor", "deduce", "hence find",
        "compare and contrast", "critically examine", "assess the impact"
    ]
    
    easy_kws = [
        "define", "what is", "which of the following is", "name", "identify",
        "state", "list", "give one example", "true or false", "who is",
        "what does", "where is", "when was", "spell", "choose the correct",
        "what type of", "which organ", "what colour"
    ]
    
    for kw in hard_kws:
        if kw in text_lower:
            return "hard"
            
    for kw in easy_kws:
        if kw in text_lower:
            return "easy"
            
    return "medium"


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

    topic = tag_topic(question_text, mapped_subject)
    difficulty = tag_difficulty(question_text, mapped_subject)

    return {
        "id": f"aloc-{aloc_id}",
        "subject": mapped_subject,
        "topic": topic,
        "subtopic": "",
        "year": year,
        "exam_body": exam_body,
        "type": "MCQ",
        "question": question_text,
        "options": options,
        "answer": answer,
        "explanation": explanation,
        "difficulty": difficulty,
        "tags": [mapped_subject.lower(), exam_body.lower(), str(year)]
    }

def main():
    print("=" * 60)
    print("ExamEdge - ALOC.ng Question Importer & Mapper")
    print("=" * 60)

    # Get Access Token — from argv or aloc_token.txt
    token = None
    if len(sys.argv) > 1:
        token = sys.argv[1].strip()
    else:
        token_file = "aloc_token.txt"
        if os.path.exists(token_file):
            with open(token_file, "r", encoding="utf-8") as tf:
                token = tf.read().strip()
            if not token or token.upper() == "YOUR_TOKEN_HERE":
                print("")
                print("=" * 60)
                print("IMPORTANT: Add your ALOC API token to aloc_token.txt then")
                print("  run: python import_aloc_questions.py")
                print("")
                print("  You can get a free token from: https://questions.aloc.com.ng")
                print("  Paste it in: aloc_token.txt (replace YOUR_TOKEN_HERE)")
                print("=" * 60)
                return
        else:
            # Create placeholder token file
            with open(token_file, "w", encoding="utf-8") as tf:
                tf.write("YOUR_TOKEN_HERE\n")
            print("")
            print("=" * 60)
            print("IMPORTANT: Add your ALOC API token to aloc_token.txt then")
            print("  run: python import_aloc_questions.py")
            print("")
            print("  You can get a free token from: https://questions.aloc.com.ng")
            print("  Paste it in: aloc_token.txt (replace YOUR_TOKEN_HERE)")
            print("=" * 60)
            return

    if not token:
        print("[ERROR] Access Token is required.")
        return

    # Get count per subject
    count = 200
    if len(sys.argv) > 2:
        try:
            count = int(sys.argv[2])
        except ValueError:
            count = 200
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
