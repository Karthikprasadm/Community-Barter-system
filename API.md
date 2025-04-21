# Community Barter System API Reference

This document describes the REST API endpoints for the Community Barter System backend. All endpoints are prefixed with `/api` and return JSON.

---

## Authentication
- Most endpoints require authentication (session/cookie or JWT token).
- Admin endpoints require admin credentials.

---

## Endpoints Overview

### Users
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| GET    | /api/users     | List all users       |
| GET    | /api/users/:id | Get user by ID       |
| POST   | /api/users     | Create user          |
| PUT    | /api/users/:id | Update user          |
| DELETE | /api/users/:id | Delete user          |

### Items
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| GET    | /api/items     | List all items       |
| GET    | /api/items/:id | Get item by ID       |
| POST   | /api/items     | Create item          |
| PUT    | /api/items/:id | Update item          |
| DELETE | /api/items/:id | Delete item          |

### Offers
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| GET    | /api/offers    | List all offers      |
| GET    | /api/offers/:id| Get offer by ID      |
| POST   | /api/offers    | Create offer         |
| PUT    | /api/offers/:id| Update offer         |
| DELETE | /api/offers/:id| Delete offer         |

### Trades
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| GET    | /api/trades    | List all trades      |
| GET    | /api/trades/:id| Get trade by ID      |
| POST   | /api/trades    | Create trade         |
| PUT    | /api/trades/:id| Update trade         |
| DELETE | /api/trades/:id| Delete trade         |

### Ratings
| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| GET    | /api/ratings     | List all ratings    |
| GET    | /api/ratings/:id | Get rating by ID    |
| POST   | /api/ratings     | Create rating       |
| PUT    | /api/ratings/:id | Update rating       |
| DELETE | /api/ratings/:id | Delete rating       |

### Admin & Analytics
| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | /api/admin-login         | Admin login                |
| GET    | /api/analytics/overview  | Dashboard stats            |
| GET    | /api/analytics/trades    | Trade analytics            |
| GET    | /api/analytics/items     | Item analytics             |
| GET    | /api/activity-log        | Recent activity log        |
| POST   | /api/sql-query           | Run custom SQL queries     |

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

---

## Notes
- All timestamps are in ISO 8601 format (UTC).
- For more details on request/response fields, see the Prisma schema or inspect the API with tools like Postman.
- For advanced database queries, use the SQL Query Tool in the admin dashboard.

---

For setup, running, and usage, see [HOW_TO_RUN_AND_USE.md](./HOW_TO_RUN_AND_USE.md).
