# Barter Community Nexus Backend

_Last updated: 2025-04-19_

---

## Project Overview
Barter Community Nexus is a feature-rich barter marketplace backend built with Node.js, Express, TypeScript, and PostgreSQL (managed via Prisma ORM). This README covers setup, features, API, database, and developer instructions.
- **Relationships:** Clearly show PKs, FKs, and cardinality (1:N, etc.).
- *Tip: Use draw.io or dbdiagram.io for clean diagrams.*

---

## 2. SQL Schema Overview
- **Full schema:** See [`docs/schema.sql`](docs/schema.sql) for table definitions, keys, and constraints.
- **Key tables:**
  - `User`: Stores user info (id, username, email, ...)
  - `Item`: Barterable items, linked to users
  - `Offer`: Proposals between users for item exchange
  - `Trade`: Completed exchanges, references offers
  - `Rating`: User feedback on trades
- **Data integrity:** Enforced via primary keys, foreign keys, and constraints.

---

## 3. Sample Data Insertion
To insert users:
```sql
INSERT INTO "User" (username, email) VALUES ('alice', 'alice@example.com');
```
To insert items:
```sql
INSERT INTO "Item" (name, description, category, condition, "userId") VALUES ('Book', 'Novel', 'Books', 'Good', 1);
```
*Repeat for offers, trades, and ratings as needed. See [`docs/advanced-sql.sql`](docs/advanced-sql.sql) for more sample data.*

---

## 4. Example SQL Queries
- **Basic SELECT:**
  ```sql
  SELECT * FROM "User";
  ```
- **JOIN:**
  ```sql
  SELECT i.name, u.username FROM "Item" i JOIN "User" u ON i."userId" = u.id;
  ```
- **GROUP BY & HAVING:**
  ```sql
  SELECT u.username, COUNT(i.id) FROM "User" u JOIN "Item" i ON u.id = i."userId" GROUP BY u.username HAVING COUNT(i.id) > 1;
  ```
- **Window Function:**
  ```sql
  SELECT username, COUNT(i.id) AS item_count, RANK() OVER (ORDER BY COUNT(i.id) DESC) FROM "User" u LEFT JOIN "Item" i ON u.id = i."userId" GROUP BY u.username;
  ```
- **See [`docs/sample-queries.sql`](docs/sample-queries.sql) for more.**

---

## 5. Advanced SQL Features
- **Views:** Simplify complex queries (see `trade_details` view in advanced-sql.sql).
- **Stored Procedures:** Encapsulate logic, e.g., `add_rating` procedure for ratings.
- **Indexes:** Improve performance on large tables.
- **Window Functions & CTEs:** For analytics and reporting (see advanced examples).

---

## 6. API to SQL Mapping
See [`docs/api-sql-mapping.md`](docs/api-sql-mapping.md) for how each API endpoint translates to SQL operations.

---

## 7. Backend Implementation
- **DBMS:** PostgreSQL
- **ORM:** Prisma (type safety, migrations)
- **Main logic:** `src/index.ts` (Express endpoints, SQL integration)

---

## 8. Profiling & Performance
- The backend logs request durations for all API endpoints (see `[PROFILE]` log lines in the backend console).
- For advanced profiling, use tools like `clinic.js`, `autocannon`, or APMs.

## 9. Test Coverage
- All core API endpoints are covered by Jest/Supertest tests.
- Edge cases and error scenarios are covered in `tests/api.edge.test.ts`.
- To run all tests:
```sh
npm test
```

## 10. How to Present in Your Report/Viva
- **Include**: ER diagram, schema, and sample queries in your report.
- **Demonstrate**: How frontend actions trigger API calls and SQL queries.
- **Show**: Data integrity via PKs, FKs, and constraints.
- **Explain**: Advanced features (views, stored procedures, window functions, etc.).
- **Run**: SQL queries live using pgAdmin, DBeaver, or psql CLI.

---

**Good luck with your DBMS project and viva! If you need more examples or diagrams, see the docs folder or ask your mentor.**
