# Tarsify Studio - API Reference

> **Base URL:** `https://api.tarsify.com` (Production) | `http://localhost:3001` (Local)

All `/api/studio/*` endpoints require Firebase Auth token in header:

```
Authorization: Bearer <firebase_id_token>
```

---

## Authentication

### POST `/api/studio/auth/register`

Create developer record after Firebase signup.

**Request Body:**

```json
{
  "email": "dev@example.com",
  "name": "Alex Developer"
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "firebaseUid": "firebase_uid",
  "email": "dev@example.com",
  "name": "Alex Developer",
  "verified": false,
  "createdAt": "2026-01-27T00:00:00Z"
}
```

---

### GET `/api/studio/auth/me`

Get current developer profile.

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "firebaseUid": "firebase_uid",
  "email": "dev@example.com",
  "name": "Alex Developer",
  "avatarUrl": "https://...",
  "bio": "AI developer",
  "earningsBalance": 5000,
  "payoutEmail": "payout@example.com",
  "verified": true,
  "createdAt": "2026-01-27T00:00:00Z",
  "updatedAt": "2026-01-27T00:00:00Z"
}
```

---

### PUT `/api/studio/auth/profile`

Update developer profile.

**Request Body:**

```json
{
  "name": "Alex Developer",
  "bio": "AI developer building cool stuff",
  "avatarUrl": "https://...",
  "payoutEmail": "payout@example.com"
}
```

**Response:** `200 OK` - Returns updated developer object

---

## Notebooks

### GET `/api/studio/notebooks`

List developer's notebooks with pagination.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 10 | Items per page |
| `status` | string | - | Filter: `draft`, `published`, `archived` |
| `search` | string | - | Search title/description |

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Image Generator",
      "shortDescription": "Generate images with AI",
      "status": "published",
      "priceCredits": 100,
      "gpuType": "T4",
      "category": "image",
      "totalRuns": 1500,
      "hasFile": true,
      "createdAt": "2026-01-27T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### POST `/api/studio/notebooks`

Create a new notebook (draft).

**Request Body:**

```json
{
  "title": "My AI Notebook",
  "shortDescription": "A short description",
  "description": "Full markdown description",
  "priceCredits": 50,
  "gpuType": "T4",
  "category": "image"
}
```

**Response:** `201 Created` - Returns notebook object

---

### GET `/api/studio/notebooks/:id`

Get notebook details.

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "developerId": "uuid",
  "title": "Image Generator",
  "shortDescription": "Generate images with AI",
  "description": "Full markdown...",
  "thumbnailUrl": "https://...",
  "priceCredits": 100,
  "gpuType": "T4",
  "category": "image",
  "status": "published",
  "totalRuns": 1500,
  "averageRating": 4.5,
  "hasFile": true,
  "createdAt": "2026-01-27T00:00:00Z",
  "updatedAt": "2026-01-27T00:00:00Z"
}
```

---

### PUT `/api/studio/notebooks/:id`

Update notebook metadata.

**Request Body:** Same as POST (partial updates allowed)

**Response:** `200 OK` - Returns updated notebook

---

### DELETE `/api/studio/notebooks/:id`

Delete a notebook (must be draft or archived).

**Response:** `204 No Content`

---

## Notebook Files

### POST `/api/studio/notebooks/:id/file`

Upload .ipynb file.

**Request:** `multipart/form-data`

- `file`: The .ipynb file (max 50MB)

**Response:** `200 OK`

```json
{
  "message": "File uploaded successfully",
  "fileUrl": "gs://bucket/notebooks/uuid.ipynb"
}
```

---

### GET `/api/studio/notebooks/:id/file`

Download .ipynb file.

**Response:** `200 OK` - File download or signed URL

---

### DELETE `/api/studio/notebooks/:id/file`

Delete .ipynb file.

**Response:** `204 No Content`

---

## Publishing

### POST `/api/studio/notebooks/:id/publish`

Publish notebook to marketplace.

**Requirements:**

- Has uploaded .ipynb file
- Title and descriptions filled
- Price set

**Response:** `200 OK`

```json
{
  "message": "Notebook published",
  "status": "published"
}
```

---

### POST `/api/studio/notebooks/:id/unpublish`

Unpublish notebook (remove from marketplace).

**Response:** `200 OK`

```json
{
  "message": "Notebook unpublished",
  "status": "draft"
}
```

---

## Analytics (Deferred to Post-MVP)

### GET `/api/studio/analytics`

Get overall analytics.

**Response:** `200 OK`

```json
{
  "totalNotebooks": 5,
  "totalRuns": 1500,
  "totalEarnings": 75000,
  "viewsToday": 120,
  "runsToday": 45
}
```

---

### GET `/api/studio/analytics/notebooks/:id`

Get per-notebook analytics.

---

## Earnings (Deferred to Post-MVP)

### GET `/api/studio/earnings`

Get earnings summary.

**Response:** `200 OK`

```json
{
  "availableBalance": 50000,
  "pendingBalance": 10000,
  "totalEarned": 75000
}
```

---

### POST `/api/studio/payouts/request`

Request payout (min 5000 credits).

---

### GET `/api/studio/payouts`

Get payout history.

---

## Error Responses

All errors return:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

| Status | Code               | Description                      |
| ------ | ------------------ | -------------------------------- |
| 400    | `VALIDATION_ERROR` | Invalid request body             |
| 401    | `UNAUTHORIZED`     | Missing/invalid auth token       |
| 403    | `FORBIDDEN`        | Not owner of resource            |
| 404    | `NOT_FOUND`        | Resource not found               |
| 409    | `CONFLICT`         | Cannot delete published notebook |
| 500    | `SERVER_ERROR`     | Internal error                   |

---

## Types Reference

```typescript
type NotebookStatus = 'draft' | 'published' | 'archived';
type GpuType = 'T4' | 'L4' | 'A100' | 'H100';
type NotebookCategory = 'image' | 'text' | 'video' | 'audio' | 'other';
type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
```
