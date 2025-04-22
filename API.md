# Community Barter System API Reference

This document describes the REST API endpoints for the Community Barter System backend. All endpoints are prefixed with `/api` and return JSON.

---

## Authentication
- **User Endpoints:** Require a valid login session (cookie or JWT token).
- **Admin Endpoints:** Require admin session cookie (`admin_session`) or admin JWT token.
- **Public Endpoints:** Some endpoints (e.g., registration, login) are public.
- Always send credentials/cookies with requests to access protected endpoints.

---

## Endpoints Overview

### Users
| Method | Endpoint        | Description          | Auth Required |
|--------|----------------|----------------------|---------------|
| GET    | /api/users     | List all users       | Admin         |
| GET    | /api/users/:id | Get user by ID       | User/Admin    |
| POST   | /api/users     | Create user          | No            |
| PUT    | /api/users/:id | Update user          | User/Admin    |
| DELETE | /api/users/:id | Delete user          | User/Admin    |

### Items
| Method | Endpoint        | Description          | Auth Required |
|--------|----------------|----------------------|---------------|
| GET    | /api/items     | List all items       | User/Admin    |
| GET    | /api/items/:id | Get item by ID       | User/Admin    |
| POST   | /api/items     | Create item          | User/Admin    |
| PUT    | /api/items/:id | Update item          | User/Admin    |
| DELETE | /api/items/:id | Delete item          | User/Admin    |

### Offers
| Method | Endpoint        | Description          | Auth Required |
|--------|----------------|----------------------|---------------|
| GET    | /api/offers    | List all offers      | User/Admin    |
| GET    | /api/offers/:id| Get offer by ID      | User/Admin    |
| POST   | /api/offers    | Create offer         | User/Admin    |
| PUT    | /api/offers/:id| Update offer         | User/Admin    |
| DELETE | /api/offers/:id| Delete offer         | User/Admin    |

### Trades
| Method | Endpoint        | Description          | Auth Required |
|--------|----------------|----------------------|---------------|
| GET    | /api/trades    | List all trades      | User/Admin    |
| GET    | /api/trades/:id| Get trade by ID      | User/Admin    |
| POST   | /api/trades    | Create trade         | User/Admin    |
| PUT    | /api/trades/:id| Update trade         | User/Admin    |
| DELETE | /api/trades/:id| Delete trade         | User/Admin    |

### Ratings
| Method | Endpoint         | Description         | Auth Required |
|--------|------------------|---------------------|---------------|
| GET    | /api/ratings     | List all ratings    | User/Admin    |
| GET    | /api/ratings/:id | Get rating by ID    | User/Admin    |
| POST   | /api/ratings     | Create rating       | User/Admin    |
| PUT    | /api/ratings/:id | Update rating       | User/Admin    |
| DELETE | /api/ratings/:id | Delete rating       | User/Admin    |

### Admin & Analytics
| Method | Endpoint                 | Description                | Auth Required |
|--------|--------------------------|----------------------------|---------------|
| POST   | /api/admin-login         | Admin login                | No            |
| GET    | /api/analytics/overview  | Dashboard stats            | Admin         |
| GET    | /api/analytics/trades    | Trade analytics            | Admin         |
| GET    | /api/analytics/items     | Item analytics             | Admin         |
| GET    | /api/activity-log        | Recent activity log        | Admin         |
| POST   | /api/sql-query           | Run custom SQL queries     | Admin         |

---

## Example Request/Response

### Get All Users
```http
GET /api/users
```
**Response:**
```json
[
  {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "joinedDate": "2025-04-17T21:47:58.382Z"
  },
  ...
]
```

### Create Item
```http
POST /api/items
Content-Type: application/json

{
  "name": "Sample Item",
  "description": "A test item",
  "category": "Books",
  "condition": "New",
  "available": true,
  "userId": 1
}
```
**Response:**
```json
{
  "id": 101,
  "name": "Sample Item",
  ...
}
```

---

## Error Handling
- All errors are returned as JSON with an `error` field and appropriate HTTP status code.
- Example:
```json
{
  "error": "Not authorized"
}
```

---

## WebSockets
- Real-time updates for dashboard and trades are delivered via WebSocket at `ws://localhost:15000`.
- **Events:**
  - `item:created` — Sent when a new item is added
  - `item:updated` — Sent when an item is updated
  - `item:deleted` — Sent when an item is deleted
  - `trade:created` — Sent when a trade is created
  - `trade:updated` — Sent when a trade is updated
  - `trade:deleted` — Sent when a trade is deleted
- **Example WebSocket Message:**
```json
{
  "event": "item:created",
  "data": {
    "id": 123,
    "name": "Sample Item",
    ...
  }
}
```
- Connect using a WebSocket client to receive real-time updates for your dashboard or marketplace UI.

---

## Notes
- All timestamps are in ISO 8601 format (UTC).
- For more details on request/response fields, see the Prisma schema or inspect the API with tools like Postman.
- For advanced database queries, use the SQL Query Tool in the admin dashboard.

---

For setup, running, and usage, see [HOW_TO_RUN_AND_USE.md](./HOW_TO_RUN_AND_USE.md).
