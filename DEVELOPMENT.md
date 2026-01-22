# Tarsify Studio - Development Notes

> This document tracks mock data, TODOs, and implementation notes for future reference.

---

## Table of Contents

- [Mock Data Overview](#mock-data-overview)
- [Phase Status](#phase-status)
- [Mock Data Details](#mock-data-details)
- [API Integration TODOs](#api-integration-todos)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)

---

## Mock Data Overview

| Module            | Status  | Mock Data Location          | Real API Ready   |
| ----------------- | ------- | --------------------------- | ---------------- |
| Authentication    | ✅ Real | N/A                         | ✅ Firebase Auth |
| Notebooks CRUD    | 🟡 Mock | `src/lib/mock/notebooks.ts` | ❌ Needs API     |
| Analytics         | 🟡 Mock | `src/lib/mock/analytics.ts` | ❌ Needs API     |
| Earnings          | 🟡 Mock | `src/lib/mock/earnings.ts`  | ❌ Needs API     |
| Developer Profile | 🟡 Mock | `src/lib/mock/developer.ts` | ❌ Needs API     |

---

## Phase Status

### ✅ Phase 1: Project Setup

- Next.js 15, TypeScript, Tailwind CSS 4
- All dependencies installed
- ESLint, Prettier configured

### ✅ Phase 2: Core Infrastructure

- API client with auth headers
- Firebase Auth integration
- Zustand stores
- React Query setup

### ✅ Phase 3: Authentication

- Login page
- Register page
- Firebase Auth working (tarsify-studio project)
- Auth state management

### ✅ Phase 4: Dashboard Layout

- Sidebar navigation
- Header with user menu
- Mobile responsive
- Protected routes

### ✅ Phase 5: Notebooks Module

- Notebooks list page
- Create/Edit/View pages
- File upload component (UI only)
- Publish workflow

### 🚧 Phase 6: Analytics & Earnings (Current)

- Using mock data
- Charts with recharts (not yet installed)
- Stats cards
- Earnings breakdown

### ⬜ Phase 7: Settings

- Not started

---

## Mock Data Details

### Notebooks Mock Data

**File:** `src/lib/mock/notebooks.ts`

```typescript
// Returns array of mock notebooks with realistic data
// Used by: useNotebooks, useNotebook hooks
// TODO: Replace with GET /api/developers/notebooks
```

**What's Mocked:**

- Notebook listing
- Single notebook fetch
- Create/Update/Delete operations
- File upload (simulated delay)
- Publish/Unpublish (simulated)

**Integration Points:**

```
GET    /api/developers/notebooks         → useNotebooks()
GET    /api/developers/notebooks/:id     → useNotebook(id)
POST   /api/developers/notebooks         → useCreateNotebook()
PUT    /api/developers/notebooks/:id     → useUpdateNotebook()
DELETE /api/developers/notebooks/:id     → useDeleteNotebook()
POST   /api/developers/notebooks/:id/publish   → usePublishNotebook()
POST   /api/developers/notebooks/:id/unpublish → useUnpublishNotebook()
```

---

### Analytics Mock Data

**File:** `src/lib/mock/analytics.ts`

```typescript
// Returns analytics overview and per-notebook stats
// Used by: useAnalyticsOverview, useNotebookAnalytics hooks
// TODO: Replace with GET /api/developers/analytics
```

**What's Mocked:**

- Total views, runs, earnings
- Daily/weekly/monthly trends
- Per-notebook breakdown
- Chart data (time series)

**Integration Points:**

```
GET /api/developers/analytics           → useAnalyticsOverview()
GET /api/developers/analytics/notebooks/:id → useNotebookAnalytics(id)
GET /api/developers/analytics/trends    → useAnalyticsTrends()
```

---

### Earnings Mock Data

**File:** `src/lib/mock/earnings.ts`

```typescript
// Returns earnings summary, breakdown, and payout history
// Used by: useEarningsSummary, useEarningsBreakdown, usePayouts hooks
// TODO: Replace with GET /api/developers/earnings
```

**What's Mocked:**

- Available/pending balance
- Total earned
- Per-notebook earnings breakdown
- Payout history
- Payout request (simulated)

**Integration Points:**

```
GET  /api/developers/earnings              → useEarningsSummary()
GET  /api/developers/earnings/breakdown    → useEarningsBreakdown()
GET  /api/developers/earnings/payouts      → usePayouts()
POST /api/developers/earnings/payouts/request → useRequestPayout()
```

---

### Developer Profile Mock Data

**File:** `src/lib/mock/developer.ts`

```typescript
// Returns developer profile data
// Used by: useDeveloperProfile hook
// TODO: Replace with GET /api/developers/me
```

**What's Mocked:**

- Developer profile info
- Profile update (simulated)

**Integration Points:**

```
GET  /api/developers/me              → useDeveloperProfile()
PUT  /api/developers/me              → useUpdateProfile()
POST /api/developers/me/avatar       → useUploadAvatar()
```

---

## API Integration TODOs

When the API is ready, follow these steps:

### 1. Remove Mock Data Flag

```typescript
// In src/lib/api/client.ts
const USE_MOCK_DATA = false; // Change from true to false
```

### 2. Update Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.tarsify.com
```

### 3. Update Hook Implementations

Each hook has a comment marking where to switch from mock to real:

```typescript
// Look for comments like:
// TODO: Replace with real API call when ready
// const data = await api.get<T>(endpoint);
```

### 4. Test Each Endpoint

Use the API testing checklist:

- [ ] `GET /api/developers/me` - Profile fetch
- [ ] `PUT /api/developers/me` - Profile update
- [ ] `GET /api/developers/notebooks` - List notebooks
- [ ] `POST /api/developers/notebooks` - Create notebook
- [ ] `GET /api/developers/notebooks/:id` - Get notebook
- [ ] `PUT /api/developers/notebooks/:id` - Update notebook
- [ ] `DELETE /api/developers/notebooks/:id` - Delete notebook
- [ ] `POST /api/developers/notebooks/:id/file` - Upload file
- [ ] `DELETE /api/developers/notebooks/:id/file` - Delete file
- [ ] `POST /api/developers/notebooks/:id/publish` - Publish
- [ ] `POST /api/developers/notebooks/:id/unpublish` - Unpublish
- [ ] `GET /api/developers/analytics` - Analytics overview
- [ ] `GET /api/developers/analytics/notebooks/:id` - Notebook analytics
- [ ] `GET /api/developers/earnings` - Earnings summary
- [ ] `GET /api/developers/earnings/breakdown` - Breakdown
- [ ] `GET /api/developers/earnings/payouts` - Payout history
- [ ] `POST /api/developers/earnings/payouts/request` - Request payout

---

## Known Limitations

### Current Mock Data Limitations

1. **No Persistence**
   - Data resets on page refresh
   - Changes only exist in memory

2. **No Real File Upload**
   - FileUpload component shows UI only
   - Files are not actually stored

3. **No Real Analytics**
   - Charts show randomized fake data
   - No actual tracking

4. **No Real Payments**
   - Payout request is simulated
   - No Stripe integration yet

5. **Search/Filter**
   - Works on mock data only
   - May behave differently with real API

---

## Future Enhancements

### Priority 1 (Required for Launch)

- [ ] Connect to real API
- [ ] Real file upload to cloud storage
- [ ] Stripe Connect for payouts
- [ ] Email notifications

### Priority 2 (Nice to Have)

- [ ] Real-time analytics updates
- [ ] Notebook preview/renderer
- [ ] Markdown editor for descriptions
- [ ] Bulk operations (select multiple notebooks)

### Priority 3 (Future)

- [ ] A/B testing for thumbnails
- [ ] AI-powered notebook suggestions
- [ ] Collaboration features
- [ ] Webhook integrations

---

## Notes

### Environment Configuration

```env
# .env.local (real values, not committed)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tarsify-studio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_API_URL=http://localhost:3001

# Mock data flag (in code)
USE_MOCK_DATA=true  # Set to false when API is ready
```

### Testing Mock Data

To test with mock data:

1. Hooks automatically use mock data when `USE_MOCK_DATA=true`
2. Mock data has realistic delays (300-800ms)
3. Some operations randomly fail to test error handling

---

_Last Updated: Phase 6 - Analytics & Earnings Module_
