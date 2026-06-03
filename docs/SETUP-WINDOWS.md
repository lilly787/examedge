# ExamEdge on Windows (no Docker)

## 1. Install Node.js

1. Download **Node.js 18 LTS** from https://nodejs.org/
2. Run the installer (check **"Add to PATH"**).
3. Close and reopen PowerShell, then verify:

```powershell
node -v
npm -v
```

## 2. Start ExamEdge

```powershell
cd "C:\Users\Fr Norbert\.gemini\antigravity-ide\scratch\examedge"
copy .env.example .env
npm install
npm run db:setup
npm start
```

Open in your browser:

- http://127.0.0.1:8000/landing.html
- http://127.0.0.1:8000/index.html

## 3. Login (dev mode)

1. Enter phone + name → **Get Activation OTP**
2. Check the **PowerShell window** where `npm start` is running — the 4-digit code is printed there, e.g. `[OTP] Dev mode — 2348031234567: 5821`
3. Enter that code and continue

## Troubleshooting

| Error | Fix |
|-------|-----|
| `docker is not recognized` | **Ignore Docker** — you don't need it. Use steps above. |
| `npm is not recognized` | Install Node.js and restart PowerShell |
| `Migration failed` | Run `npm install` again, then `npm run db:setup` |
| API offline in app | Ensure `npm start` is running; open http://127.0.0.1:8000/api/health |

## Optional: Docker + PostgreSQL later

Only for production-style testing:

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. In `.env`: `USE_PG_MEM=false` and `DATABASE_URL=postgresql://examedge:examedge@localhost:5432/examedge`
3. `docker compose up -d` then `npm run db:setup`
