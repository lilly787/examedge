/**
 * ExamEdge Question Importer
 * Imports extra_questions.json and generated_questions.json into the running server.
 *
 * Usage: node import_questions.js
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "http://127.0.0.1:8000";
const BATCH_SIZE = 100;

const TOPICS_MAPPING = {
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
  }
};

function tag_topic(question_text, subject) {
  if (!question_text) return "General";
  const text_lower = question_text.toLowerCase();
  
  let mapping = TOPICS_MAPPING[subject];
  if (!mapping) {
    for (const sub_key in TOPICS_MAPPING) {
      if (sub_key.toLowerCase() === subject.toLowerCase()) {
        mapping = TOPICS_MAPPING[sub_key];
        break;
      }
    }
  }
  
  if (mapping) {
    for (const [topic_name, keywords] of Object.entries(mapping)) {
      for (const kw of keywords) {
        if (text_lower.includes(kw.toLowerCase())) {
          return topic_name;
        }
      }
    }
  }
  return "General";
}

// ── Step 1: Obtain a JWT token via session/resume (no OTP needed in dev) ─────
async function getToken() {
  const phone = "+2348000000001";
  const res = await fetch(`${BASE_URL}/api/auth/session/resume`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, name: "ImportBot", role: "admin" }),
  });
  const data = await res.json();
  if (!data.token) {
    throw new Error("Could not obtain JWT token: " + JSON.stringify(data));
  }
  return data.token;
}

// ── Step 2: Validate a question ───────────────────────────────────────────────
function isValid(q) {
  if (!q || typeof q !== "object") return false;
  if (typeof q.question !== "string" || !q.question.trim()) return false;
  if (!q.options || typeof q.options !== "object") return false;
  
  // Options must have at least A, B, C, D keys
  const keys = Object.keys(q.options);
  if (!keys.includes("A") || !keys.includes("B") || !keys.includes("C") || !keys.includes("D")) {
    return false;
  }
  
  // Answer must be one of A, B, C, D, E
  if (typeof q.answer !== "string" || !["A", "B", "C", "D", "E"].includes(q.answer.toUpperCase().trim())) {
    return false;
  }
  
  // Subject must be a non-empty string
  if (typeof q.subject !== "string" || !q.subject.trim()) return false;
  
  return true;
}

// ── Step 3: Fetch all existing DB questions to prevent duplicates ──────────────
async function getExistingQuestions(token) {
  console.log("[Import] Fetching existing questions from DB to build deduplication map...");
  const existing = [];
  let limit = 200;
  let offset = 0;
  while (true) {
    const res = await fetch(`${BASE_URL}/api/questions?limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!data.questions || data.questions.length === 0) {
      break;
    }
    existing.push(...data.questions);
    offset += limit;
    if (data.questions.length < limit) {
      break;
    }
  }
  console.log(`[Import] Loaded ${existing.length} existing questions from DB.`);
  return existing;
}

// ── Step 4: Post a batch ──────────────────────────────────────────────────────
async function postBatch(questions, token) {
  const res = await fetch(`${BASE_URL}/api/questions/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questions }),
  });
  const data = await res.json();
  return data;
}

// ── Step 5: Import a file ─────────────────────────────────────────────────────
async function importFile(filePath, token, existingTextsSet) {
  console.log(`\n[Import] Reading ${path.basename(filePath)}...`);
  const raw = fs.readFileSync(filePath, "utf8");
  const all = JSON.parse(raw);
  console.log(`[Import]   Total records: ${all.length}`);

  // Validate questions
  const valid = all.filter(isValid);
  console.log(`[Import]   Valid questions: ${valid.length}`);
  console.log(`[Import]   Skipped (invalid): ${all.length - valid.length}`);

  // Deduplicate and apply defaults/schema mapping
  const uniqueToImport = [];
  let skippedDuplicatesCount = 0;

  for (const q of valid) {
    const textCleaned = q.question.trim().toLowerCase();
    if (existingTextsSet.has(textCleaned)) {
      skippedDuplicatesCount++;
      continue;
    }

    const answerUpper = q.answer.toUpperCase().trim();
    
    // Construct mapped question with defaults
    const mapped = {
      id: q.id || `gen-${Math.random().toString(36).substr(2, 9)}`,
      subject: q.subject,
      topic: q.topic || tag_topic(q.question, q.subject),
      subtopic: q.subtopic || "",
      year: q.year ? parseInt(q.year, 10) : 2020,
      exam_body: q.exam_body || "WAEC",
      type: q.type || "MCQ",
      question: q.question,
      options: q.options,
      answer: answerUpper,
      explanation: q.explanation || `The correct answer is option ${answerUpper}.`,
      difficulty: q.difficulty || "medium",
      tags: q.tags || [q.subject.toLowerCase()]
    };

    uniqueToImport.push(mapped);
    existingTextsSet.add(textCleaned); // Avoid duplicates within the same import files run
  }

  console.log(`[Import]   Unique new questions: ${uniqueToImport.length}`);
  console.log(`[Import]   Skipped (duplicate): ${skippedDuplicatesCount}`);

  let totalImported = 0;
  let batchNum = 0;

  for (let i = 0; i < uniqueToImport.length; i += BATCH_SIZE) {
    const batch = uniqueToImport.slice(i, i + BATCH_SIZE);
    batchNum++;
    try {
      const result = await postBatch(batch, token);
      totalImported += result.imported || 0;
      process.stdout.write(
        `\r[Import]   Batch ${batchNum}/${Math.ceil(uniqueToImport.length / BATCH_SIZE)} — imported so far: ${totalImported}`
      );
    } catch (err) {
      console.error(`\n[Import]   Batch ${batchNum} ERROR: ${err.message}`);
    }
  }
  console.log(`\n[Import]   Done! Imported ${totalImported} questions from ${path.basename(filePath)}`);
  return totalImported;
}

// ── Step 6: Verify total count ────────────────────────────────────────────────
async function getCount() {
  const res = await fetch(`${BASE_URL}/api/questions/stats`);
  const data = await res.json();
  return data.total;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(60));
  console.log("  ExamEdge Question Importer");
  console.log("=".repeat(60));

  let token;
  try {
    token = await getToken();
    console.log("[Auth] Token obtained.");
  } catch (err) {
    console.error("[Auth] FAILED:", err.message);
    process.exit(1);
  }

  const before = await getCount();
  console.log(`\n[DB] Questions before import: ${before}`);

  // Load existing question texts into a Set
  const existingQs = await getExistingQuestions(token);
  const existingTextsSet = new Set(existingQs.map(q => q.question.trim().toLowerCase()));

  const root = path.join(__dirname);
  const files = [
    path.join(root, "extra_questions.json"),
    path.join(root, "generated_questions.json"),
  ];

  let grandTotal = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.warn(`[Import] File not found, skipping: ${file}`);
      continue;
    }
    grandTotal += await importFile(file, token, existingTextsSet);
  }

  const after = await getCount();
  console.log("\n" + "=".repeat(60));
  console.log(`  Import Complete!`);
  console.log(`  Questions before: ${before}`);
  console.log(`  Questions after:  ${after}`);
  console.log(`  New records:      ${after - before}`);
  console.log("=".repeat(60));

  console.log(`Question bank: ${after} questions total`);

  if (after < 5000) {
    console.warn(`\n⚠️  Target is 5,000+ questions. Current: ${after}`);
  } else {
    console.log(`\n✅  Target reached! ${after} questions in DB.`);
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
