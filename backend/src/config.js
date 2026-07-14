const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// Default: pg-mem (no Docker). Set USE_PG_MEM=false + DATABASE_URL for real PostgreSQL.
const usePgMem =
  process.env.USE_PG_MEM === "true" ||
  (process.env.USE_PG_MEM !== "false" && !process.env.DATABASE_URL);

module.exports = {
  port: parseInt(process.env.PORT || "8000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "prepfast-dev-secret-change-in-production",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  appUrl: process.env.APP_URL || "http://127.0.0.1:8000",
  usePgMem,
  pgMemBackupPath:
    process.env.PG_MEM_BACKUP ||
    path.join(__dirname, "../../data/prepfast-db.json"),
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://prepfast:prepfast@localhost:5432/prepfast",
  redisUrl: process.env.REDIS_URL || "",
  termii: {
    apiKey: process.env.TERMII_API_KEY || "",
    senderId: process.env.TERMII_SENDER_ID || "PrepFast",
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || "",
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  },
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "prepfast_verify_token",
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
    fromEmail: process.env.FROM_EMAIL || "reports@prepfast.app",
  },
  freeTier: {
    dailyQuestionLimit: 20,
    mockExamsPerMonth: 1,
  },
  premium: {
    monthlyKobo: 250000,
    yearlyKobo: 15000000,
    parentAddonKobo: 100000,
  },
};
