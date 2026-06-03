# ExamEdge

Past questions and exam readiness platform for Nigerian secondary schools (WAEC, NECO, JAMB).

**Phases 0–2** are implemented: waitlist, full backend API, student PWA, teacher/parent/school portals, Paystack, Claude AI tutor, study planner, WhatsApp bot hooks, offline bundles, gamification.

## Quick start

### 1. Prerequisites

- Node.js 18+
- Docker (for PostgreSQL) **or** a hosted `DATABASE_URL`
- Python 3 (optional, for ALOC question import)

### 2. Install and configure

```bash
cp .env.example .env
npm install
docker compose up -d
npm run db:setup
```

### 3. Run

```bash
npm start
```

Open:

| URL | Purpose |
|-----|---------|
| http://127.0.0.1:8000/landing.html | Marketing + waitlist (Phase 0) |
| http://127.0.0.1:8000/index.html | Student PWA (Phases 1–2) |
| http://127.0.0.1:8000/teacher.html | Teacher dashboard |
| http://127.0.0.1:8000/parent.html | Parent portal |
| http://127.0.0.1:8000/school-portal.html | School admin |
| http://127.0.0.1:8000/api/health | API health check |

### 4. Environment keys (optional but recommended)

| Variable | Purpose |
|----------|---------|
| `TERMII_API_KEY` | Real SMS OTP |
| `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` | Payments |
| `ANTHROPIC_API_KEY` | AI tutor + study plans |
| `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business bot |

Without keys, the app runs in **dev mode** (OTP printed to server console, simulated Paystack, AI fallback messages).

## Architecture

```
examedge/
├── backend/src/          # Express + PostgreSQL API
│   ├── routes/           # auth, questions, progress, ai, payments, …
│   ├── services/         # OTP, Paystack, Claude, WhatsApp, analytics
│   └── db/schema.sql     # Full data model
├── index.html + app.js   # Student PWA (offline-first)
├── examedge-api.js       # Frontend API client
├── examedge-bridge.js    # API ↔ localStorage sync
├── examedge-features.js  # Paystack, AI tutor, study planner
├── questions.js          # Question bank (seeded into Postgres)
└── import_aloc_questions.py
```

## API overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/otp/send` | Send phone OTP |
| `POST /api/auth/otp/verify` | Verify OTP → JWT |
| `GET /api/questions` | Filter question bank |
| `POST /api/progress` | Log attempt + weakness/readiness |
| `POST /api/ai/tutor` | Claude tutor (Premium) |
| `POST /api/ai/study-plan` | AI study calendar |
| `POST /api/payments/initialize` | Paystack checkout |
| `POST /api/whatsapp/webhook` | WhatsApp Cloud API |
| `POST /api/waitlist` | Phase 0 waitlist |

## Question bank (5,000+ target)

Current seed loads all questions from `questions.js`. To grow the bank:

```bash
python import_aloc_questions.py YOUR_ALOC_TOKEN 30
npm run db:seed
```

Or bulk upload via `POST /api/questions/bulk` (admin).

## Subscription tiers (enforced in API)

- **Free:** 20 questions/day (`daily_limits` table)
- **Premium:** Unlimited + AI tutor + offline downloads
- **School:** Teacher + analytics (see school routes)

## Phase status

| Phase | Status |
|-------|--------|
| 0 — Validate | Waitlist + docs; market tasks manual |
| 1 — MVP | Backend, auth, CBT, progress, Paystack, WhatsApp hooks, PWA offline |
| 2 — AI | Weakness/readiness (server), Claude tutor, study planner, badges, leaderboards |
| 3+ | React Native app scaffold in `/mobile` — build when ready |

## License

MIT
