# ExamEdge Mobile (React Native — Phase 2)

Phase 2 of the blueprint includes Play Store / App Store apps. This folder is reserved for the **React Native (Expo)** project.

## Scaffold when ready

```bash
npx create-expo-app@latest examedge-mobile --template blank
```

Share business logic with the web app via:

- Same API base URL (`/api/*`)
- JWT auth from phone OTP
- Offline SQLite sync from `/api/offline/bundle/:subject`

The web PWA remains the primary delivery channel until the native app is built.
