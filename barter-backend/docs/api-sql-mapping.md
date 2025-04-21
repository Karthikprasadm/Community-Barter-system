# API to SQL Mapping

| Endpoint        | Method | SQL/Prisma Operation |
|-----------------|--------|----------------------|
| /api/users      | GET    | SELECT * FROM users; |
| /api/users      | POST   | INSERT INTO users (username, email) VALUES (...); |
| /api/items      | GET    | SELECT * FROM items; |
| /api/items      | POST   | INSERT INTO items (user_id, name, ...) VALUES (...); |
| /api/items/:id  | PUT    | UPDATE items SET ... WHERE id = ...; |
| /api/items/:id  | DELETE | DELETE FROM items WHERE id = ...; |
| /api/offers     | POST   | INSERT INTO offers (from_user_id, ...) VALUES (...); |
| /api/offers/:id | PUT    | UPDATE offers SET status = ... WHERE id = ...; |
| /api/trades     | POST   | INSERT INTO trades (offer_id, ...) VALUES (...); |
| /api/ratings    | POST   | INSERT INTO ratings (user_id, ...) VALUES (...); |
