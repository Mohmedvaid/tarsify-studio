# Tarsify Studio - Development Guide

> Developer portal for creating and publishing AI models

---

## Quick Reference

| Resource        | Location                           |
| --------------- | ---------------------------------- |
| API Docs        | [docs/api/API.md](./docs/api/API.md) |
| Migration Guide | [docs/MIGRATION.md](./docs/MIGRATION.md) |
| Deployment      | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) |
| Archived Docs   | [docs/archive/](./docs/archive/)   |
| API Client      | `src/lib/api/client.ts`            |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         DOMAINS                             │
│  tarsify.com → Consumer Marketplace                         │
│  studio.tarsify.com → Developer Portal (this repo)         │
│  api.tarsify.com → Backend API                             │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION                         │
│  Firebase Project: tarsify-studio                           │
│  Token passed to API via: Authorization: Bearer <token>     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND API                           │
│  /api/studio/auth/*        → Developer auth & profile       │
│  /api/studio/tars-models/* → Tars Models CRUD (NEW)         │
│  /api/studio/notebooks/*   → DEPRECATED (do not use)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Concept: Notebooks → Tars Models

The platform has **migrated from Jupyter notebooks to Tars Models**:

| Before (Deprecated)                     | After (Current)                              |
| --------------------------------------- | -------------------------------------------- |
| Developers uploaded `.ipynb` files      | Developers pick platform **base models**     |
| Routes: `/api/studio/notebooks/*`       | Routes: `/api/studio/tars-models/*`          |
| Manual notebook configuration           | Select base model + add `configOverrides`    |
| No real GPU execution                   | Real GPU execution via RunPod Serverless     |

### What is a Base Model?
Platform-provided AI capability (e.g., SDXL, Whisper, Chatterbox TTS) that developers build on.

### What is a Tars Model?
Developer's branded/configured version of a base model with custom title, slug, description, and optional `configOverrides`.

---

## Implementation Status

### ✅ Foundation (Complete)

- [x] Next.js 15 + TypeScript + Tailwind CSS 4
- [x] shadcn/ui components
- [x] Firebase Auth integration
- [x] API client with auth headers
- [x] React Query + Zustand setup
- [x] Protected routes (next.config.ts redirects)
- [x] CI/CD pipeline (GitHub Actions + Firebase App Hosting)

### ✅ Auth API Integration (Complete)

| Endpoint                         | Status |
| -------------------------------- | ------ |
| `POST /api/studio/auth/register` | ✅     |
| `GET /api/studio/auth/me`        | ✅     |
| `PUT /api/studio/auth/profile`   | ✅     |

### ⚠️ Notebooks API (Deprecated - Remove)

The current UI uses notebook APIs which are **deprecated**. These need to be removed:

- `/notebooks` page → Remove or repurpose for Tars Models
- `use-notebooks.ts` hook → Replace with Tars Models hooks
- Notebook components → Delete

### 🔴 Phase 1: Remove Notebook UI (TODO)

- [ ] Delete notebook-related components
- [ ] Remove notebook file upload logic
- [ ] Clean up notebook state/hooks

### 🔴 Phase 2: Base Models Browser (TODO)

- [ ] Create "Browse Base Models" page
- [ ] Fetch: `GET /api/studio/tars-models/base-models`
- [ ] Display cards: name, description, category, outputType
- [ ] Filter by category (IMAGE, AUDIO, TEXT, VIDEO, DOCUMENT)
- [ ] "Create Tars Model" button on each card

### 🔴 Phase 3: Tars Models CRUD (TODO)

- [ ] Create "My Tars Models" dashboard
- [ ] List: `GET /api/studio/tars-models`
- [ ] Create: `POST /api/studio/tars-models`
- [ ] View/Edit: `GET/PUT /api/studio/tars-models/:id`
- [ ] Delete: `DELETE /api/studio/tars-models/:id` (draft only)
- [ ] Publish/Archive: `POST /api/studio/tars-models/:id/publish`

### 🔴 Phase 4: Create Flow (TODO)

Multi-step wizard:
1. Select base model
2. Brand your model (title, slug, description)
3. Configure (optional `configOverrides`)
4. Review & create

### ⏸️ Phase 5: Analytics & Earnings (Deferred)

- Analytics page currently shows "Coming Soon"
- Earnings removed from navigation
- Will implement post-MVP

---

## API Endpoints Reference

### Auth (Working)

```
POST /api/studio/auth/register  → Register developer
GET  /api/studio/auth/me        → Get profile
PUT  /api/studio/auth/profile   → Update profile
```

### Tars Models (To Implement)

```
GET  /api/studio/tars-models/base-models  → List base models
GET  /api/studio/tars-models              → List my models
POST /api/studio/tars-models              → Create model
GET  /api/studio/tars-models/:id          → Get model
PUT  /api/studio/tars-models/:id          → Update model
DELETE /api/studio/tars-models/:id        → Delete (draft only)
POST /api/studio/tars-models/:id/publish  → Publish/archive
```

See [docs/api/API.md](./docs/api/API.md) for full request/response formats.

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://127.0.0.2:8080

# Firebase (tarsify-studio project)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tarsify-studio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tarsify-studio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

---

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Run ESLint
npm run test       # Run unit tests
npm run typecheck  # TypeScript check
```

---

## Deployment

Push to `main` branch triggers:
1. **GitHub Actions** - Lint, test, security scan, build check
2. **Firebase App Hosting** - Build and deploy to Cloud Run

Live URL: https://tarsify-studio-backend--tarsify-studio.us-central1.hosted.app

---

## Key Files

| File                              | Purpose                      |
| --------------------------------- | ---------------------------- |
| `src/lib/api/client.ts`           | API client with auth headers |
| `src/lib/api/endpoints.ts`        | Endpoint definitions         |
| `src/hooks/use-*.ts`              | React Query data hooks       |
| `src/providers/auth-provider.tsx` | Firebase auth logic          |
| `src/types/api.ts`                | TypeScript API types         |

---

_Last Updated: February 16, 2026_
