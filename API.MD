# SonarQube API Endpoints Documentation

This document details all API endpoints used by the SonarQube Project Tagger, including parameters, expected outputs, and response codes.

## Authentication

All endpoints use **HTTP Basic Authentication** with:

- **Username**: Personal Access Token (PAT) from `SONAR_PAT` environment variable
- **Password**: Empty string (not used)

**Header Format**: `Authorization: Basic <base64(pat:)>`

---

## 1. Get All Projects

**Endpoint**: `GET /api/projects/search`

**Purpose**: Fetch all projects from SonarQube (not just from a specific portfolio)

**Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `p` | integer | Yes | Page number (1-based) | `1`, `2`, `3` |
| `ps` | integer | Yes | Page size (max 500) | `500` |

**Request Example**:

```
GET /api/projects/search?p=1&ps=500
Authorization: Basic <token>
```

**Response Code**: `200 OK`

**Response Body** (JSON):

```json
{
  "paging": {
    "pageIndex": 1,
    "pageSize": 500,
    "total": 1362
  },
  "components": [
    {
      "key": "WBA:Digital:wag-cac-cart",
      "name": "WAG CAC Cart",
      "qualifier": "TRK",
      "visibility": "public"
    },
    {
      "key": "Rx-Renewal:Pharmacy-Modernization:assembly-ui",
      "name": "Assembly UI",
      "qualifier": "TRK",
      "visibility": "public"
    }
  ]
}
```

**Response Fields**:

- `paging.pageIndex`: Current page number
- `paging.pageSize`: Number of items per page
- `paging.total`: Total number of projects
- `components[]`: Array of project objects
  - `key`: Project key (unique identifier)
  - `name`: Project display name
  - `qualifier`: Project type (usually "TRK" for track)
  - `visibility`: Project visibility ("public" or "private")

**Error Responses**:

- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: SonarQube server error

---

## 2. Get All Portfolios

**Endpoint**: `GET /api/views/list`

**Purpose**: Fetch all portfolios (views) from SonarQube

**Parameters**: None

**Request Example**:

```
GET /api/views/list
Authorization: Basic <token>
```

**Response Code**: `200 OK`

**Response Body** (JSON):

```json
{
  "views": [
    {
      "key": "All-Projects",
      "name": "All Projects",
      "description": "All projects portfolio"
    },
    {
      "key": "digital_pharmacy_services",
      "name": "Digital Pharmacy Services",
      "description": "Digital pharmacy services portfolio"
    },
    {
      "key": "unassigned",
      "name": "Unassigned",
      "description": "Unassigned projects"
    }
  ]
}
```

**Response Fields**:

- `views[]`: Array of portfolio objects
  - `key`: Portfolio key (unique identifier)
  - `name`: Portfolio display name
  - `description`: Portfolio description (optional)

**Error Responses**:

- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: SonarQube server error

---

## 3. Get Projects in a Portfolio

**Endpoint**: `GET /api/views/show`

**Purpose**: Fetch all projects assigned to a specific portfolio

**Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `key` | string | Yes | Portfolio key | `All-Projects`, `digital_pharmacy_services` |

**Request Example**:

```
GET /api/views/show?key=digital_pharmacy_services
Authorization: Basic <token>
```

**Response Code**: `200 OK`

**Response Body** (JSON):

```json
{
  "key": "digital_pharmacy_services",
  "name": "Digital Pharmacy Services",
  "description": "Digital pharmacy services portfolio",
  "selectedProjects": [
    {
      "projectKey": "WBA:Digital:wag-cac-cart",
      "projectName": "WAG CAC Cart"
    },
    {
      "projectKey": "WBA:Digital:wag-findcare-findcareadminui",
      "projectName": "FindCare Admin UI"
    }
  ]
}
```

**Response Fields**:

- `key`: Portfolio key
- `name`: Portfolio display name
- `description`: Portfolio description
- `selectedProjects[]`: Array of project objects
  - `projectKey`: Project key (unique identifier)
  - `projectName`: Project display name

**Error Responses**:

- `400 Bad Request`: Invalid portfolio key
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Portfolio does not exist
- `500 Internal Server Error`: SonarQube server error

---

## 4. Create Portfolio

**Endpoint**: `POST /api/views/create`

**Purpose**: Create a new portfolio (view) in SonarQube

**Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `key` | string | Yes | Portfolio key (unique identifier) | `digital_pharmacy_services` |
| `name` | string | Yes | Portfolio display name | `Digital Pharmacy Services` |

**Request Example**:

```
POST /api/views/create?key=digital_pharmacy_services&name=Digital%20Pharmacy%20Services
Authorization: Basic <token>
```

**Response Code**: `200 OK` or `204 No Content`

**Response Body**: Empty or minimal JSON

**Error Responses**:

- `400 Bad Request`: Invalid parameters or portfolio key already exists
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions (requires "Portfolio Admin" or "Admin")
- `500 Internal Server Error`: SonarQube server error

**Note**: After creating a portfolio, the code also calls `/api/views/set_manual_mode` to set it to manual mode.

---

## 5. Set Portfolio to Manual Mode

**Endpoint**: `POST /api/views/set_manual_mode`

**Purpose**: Set a portfolio to manual mode (required before adding/removing projects)

**Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `portfolio` | string | Yes | Portfolio key | `digital_pharmacy_services` |

**Request Example**:

```
POST /api/views/set_manual_mode?portfolio=digital_pharmacy_services
Authorization: Basic <token>
```

**Response Code**: `200 OK` or `204 No Content`

**Response Body**: Empty

**Error Responses**:

- `400 Bad Request`: Invalid portfolio key
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Portfolio does not exist
- `500 Internal Server Error`: SonarQube server error

---

## 6. Add Project to Portfolio

**Endpoint**: `POST /api/views/add_project`

**Purpose**: Add a project to a portfolio

**Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `key` | string | Yes | Portfolio key | `digital_pharmacy_services` |
| `project` | string | Yes | Project key | `WBA:Digital:wag-cac-cart` |

**Request Example**:

```
POST /api/views/add_project?key=digital_pharmacy_services&project=WBA%3ADigital%3Awag-cac-cart
Authorization: Basic <token>
```

**Response Code**: `204 No Content`

**Response Body**: Empty

**Error Responses**:

- `400 Bad Request`:
  - Invalid parameters
  - Project already in portfolio
  - Portfolio not in manual mode
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Portfolio or project does not exist
- `500 Internal Server Error`: SonarQube server error

**Note**: Portfolio must be in manual mode before adding projects. The code automatically sets manual mode before adding.

---

## 7. Remove Project from Portfolio

**Endpoint**: `POST /api/views/remove_project`

**Purpose**: Remove a project from a portfolio

**Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `key` | string | Yes | Portfolio key | `digital_pharmacy_services` |
| `project` | string | Yes | Project key | `WBA:Digital:wag-cac-cart` |

**Request Example**:

```
POST /api/views/remove_project?key=digital_pharmacy_services&project=WBA%3ADigital%3Awag-cac-cart
Authorization: Basic <token>
```

**Response Code**: `204 No Content`

**Response Body**: Empty

**Error Responses**:

- `400 Bad Request`:
  - Invalid parameters
  - Project not in portfolio
  - Portfolio not in manual mode
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Portfolio or project does not exist
- `500 Internal Server Error`: SonarQube server error

**Note**: Portfolio must be in manual mode before removing projects. The code automatically sets manual mode before removing.

---

## 8. Refresh Portfolio

**Endpoint**: `POST /api/views/refresh`

**Purpose**: Trigger a refresh/recompute of portfolio metrics

**Parameters**:
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `key` | string | Yes | Portfolio key | `digital_pharmacy_services` |

**Request Example**:

```
POST /api/views/refresh?key=digital_pharmacy_services
Authorization: Basic <token>
```

**Response Code**: `200 OK` or `204 No Content`

**Response Body**: Empty or minimal JSON

**Error Responses**:

- `400 Bad Request`: Invalid portfolio key
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Portfolio does not exist
- `500 Internal Server Error`: SonarQube server error

**Note**: This endpoint triggers an asynchronous refresh. The portfolio metrics will be recomputed in the background.

---

## Summary Table

| Endpoint                     | Method | Purpose                       | Success Code | Key Parameters   |
| ---------------------------- | ------ | ----------------------------- | ------------ | ---------------- |
| `/api/projects/search`       | GET    | Get all projects              | 200          | `p`, `ps`        |
| `/api/views/list`            | GET    | Get all portfolios            | 200          | None             |
| `/api/views/show`            | GET    | Get projects in portfolio     | 200          | `key`            |
| `/api/views/create`          | POST   | Create portfolio              | 200/204      | `key`, `name`    |
| `/api/views/set_manual_mode` | POST   | Set manual mode               | 200/204      | `portfolio`      |
| `/api/views/add_project`     | POST   | Add project to portfolio      | 204          | `key`, `project` |
| `/api/views/remove_project`  | POST   | Remove project from portfolio | 204          | `key`, `project` |
| `/api/views/refresh`         | POST   | Refresh portfolio             | 200/204      | `key`            |

## Common Error Codes

| Code                        | Meaning                     | Common Causes                                       |
| --------------------------- | --------------------------- | --------------------------------------------------- |
| `200 OK`                    | Request successful          | -                                                   |
| `204 No Content`            | Request successful, no body | Used for POST operations                            |
| `400 Bad Request`           | Invalid request parameters  | Missing/invalid parameters, business rule violation |
| `401 Unauthorized`          | Authentication failed       | Invalid/missing PAT token                           |
| `403 Forbidden`             | Insufficient permissions    | User lacks required permissions                     |
| `404 Not Found`             | Resource not found          | Portfolio/project doesn't exist                     |
| `500 Internal Server Error` | Server error                | SonarQube internal error                            |

## Rate Limiting

SonarQube may implement rate limiting. If you encounter `429 Too Many Requests`:

- Reduce request frequency
- Implement exponential backoff
- Batch operations where possible

## Best Practices

1. **Always set manual mode** before adding/removing projects from portfolios
2. **Use fail-safe operations**: Add to target portfolio before removing from source
3. **Handle 400 errors gracefully**: May indicate project already in portfolio
4. **Cache portfolio membership**: Avoid repeated calls to `/api/views/show`
5. **Use pagination**: For `/api/projects/search`, use `ps=500` (max) to minimize requests
6. **Log all errors**: Include full error response in logs for debugging
