# Tarsify Studio - Development Guide

> Developer portal for AI notebook creators

---

## Quick Reference

| Resource      | Location                         |
| ------------- | -------------------------------- |
| API Docs      | [API.MD](./API.MD)               |
| Archived Docs | [docs/archive/](./docs/archive/) |
| Mock Data     | `src/lib/mock/index.ts`          |
| API Client    | `src/lib/api/client.ts`          |

---

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         DOMAINS                             │
│  tarsify.com → Consumer Web                                 │
│  studio.tarsify.com → Developer Portal (this repo)         │
│  api.tarsify.com → Backend API                             │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION                         │
│  Firebase Project: tarsify-studio (separate from consumer)  │
│  Token passed to API via: Authorization: Bearer <token>     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND API                           │
│  /api/studio/auth/*      → Developer auth & profile         │
│  /api/studio/notebooks/* → Notebook CRUD & files            │
│  /api/studio/analytics   → Stats (deferred)                 │
│  /api/studio/earnings    → Revenue (deferred)               │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase Status

### ✅ Phase 1: Foundation (Complete)

- [x] Next.js 15 + TypeScript + Tailwind CSS 4
- [x] shadcn/ui components
- [x] Firebase Auth integration
- [x] API client with auth headers
- [x] React Query + Zustand setup
- [x] Protected routes middleware

### ✅ Phase 2: UI Complete (Complete)

- [x] Auth pages (login, register)
- [x] Dashboard layout (sidebar, header)
- [x] Notebooks list, create, edit, view pages
- [x] File upload component (UI only)
- [x] Settings page (profile, account, payout)
- [x] Analytics page (mock data)
- [x] Earnings page (mock data)

### 🔴 Phase 3: Auth API Integration (Current)

Connect real API endpoints for authentication:

| Endpoint                         | Hook                  | Status  |
| -------------------------------- | --------------------- | ------- |
| `POST /api/studio/auth/register` | After Firebase signup | 🔴 TODO |
| `GET /api/studio/auth/me`        | `useDeveloperProfile` | 🟡 Mock |
| `PUT /api/studio/auth/profile`   | `useUpdateProfile`    | 🟡 Mock |

**Tasks:**

- [ ] Call register API after Firebase signup in auth-provider
- [ ] Switch `useDeveloperProfile` to real API
- [ ] Switch `useUpdateProfile` to real API
- [ ] Handle 404 (new user) vs 200 (existing user) on `/me`

### 🔴 Phase 4: Notebooks API Integration

Connect real API endpoints for notebooks:

| Endpoint                                   | Hook                   | Status  |
| ------------------------------------------ | ---------------------- | ------- |
| `GET /api/studio/notebooks`                | `useNotebooks`         | 🟡 Mock |
| `POST /api/studio/notebooks`               | `useCreateNotebook`    | 🟡 Mock |
| `GET /api/studio/notebooks/:id`            | `useNotebook`          | 🟡 Mock |
| `PUT /api/studio/notebooks/:id`            | `useUpdateNotebook`    | 🟡 Mock |
| `DELETE /api/studio/notebooks/:id`         | `useDeleteNotebook`    | 🟡 Mock |
| `POST /api/studio/notebooks/:id/publish`   | `usePublishNotebook`   | 🟡 Mock |
| `POST /api/studio/notebooks/:id/unpublish` | `useUnpublishNotebook` | 🟡 Mock |

### 🔴 Phase 5: File Upload

Connect file upload endpoints:

| Endpoint                                | Hook                    | Status     |
| --------------------------------------- | ----------------------- | ---------- |
| `POST /api/studio/notebooks/:id/file`   | `useUploadNotebookFile` | 🔴 UI only |
| `DELETE /api/studio/notebooks/:id/file` | `useDeleteNotebookFile` | 🔴 UI only |

**Tasks:**

- [ ] Implement actual file upload (multipart/form-data)
- [ ] Show upload progress
- [ ] Handle large files (up to 50MB)

### ⏸️ Phase 6: Analytics & Earnings (Deferred)

_Postponed to post-MVP - UI exists with mock data_

- Analytics overview and charts
- Earnings summary and breakdown
- Payout request flow
- Stripe Connect integration

### ⏸️ Phase 7: Deploy & Polish (Deferred)

- Cloud Run deployment
- Error boundaries
- Loading state improvements
- E2E tests

---

## Mock Data Configuration

All hooks check `USE_MOCK_DATA` flag:

```typescript
// src/lib/mock/index.ts
export const USE_MOCK_DATA = true; // Set to false when API is ready
```

**To switch to real API:**

1. Set `USE_MOCK_DATA = false`
2. Ensure `NEXT_PUBLIC_API_URL` is set in `.env.local`
3. Test each endpoint individually

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# Firebase (tarsify-studio project)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tarsify-studio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tarsify-studio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

---

## Key Files

| File                              | Purpose                        |
| --------------------------------- | ------------------------------ |
| `src/lib/api/client.ts`           | API client with auth           |
| `src/lib/api/endpoints.ts`        | Endpoint definitions           |
| `src/lib/mock/index.ts`           | Mock data & USE_MOCK_DATA flag |
| `src/hooks/use-*.ts`              | Data fetching hooks            |
| `src/providers/auth-provider.tsx` | Firebase auth listener         |

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
npm run test     # Run unit tests
```

---

## Current Limitations

1. **No real file upload** - FileUpload component is UI only
2. **No persistence** - Mock data resets on refresh
3. **Analytics/Earnings** - Fully mocked, deferred to post-MVP

---

## Next Steps

1. **Verify backend API is running** at `localhost:3001`
2. **Start with Phase 3** - Auth API integration
3. **Test register flow** - Firebase signup + API register call
4. **Proceed to Phase 4** - Notebooks API

---

_Last Updated: January 27, 2026_
