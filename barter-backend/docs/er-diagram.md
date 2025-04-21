# ER Diagram

Below is a description of the Entity-Relationship (ER) diagram for the Barter Community System. Include a visual diagram (draw.io, dbdiagram.io, or hand-drawn and scanned) in your project submission for best results.

**Entities and Relationships:**
- **User**: id, username, email, reputation, joinedDate
- **Item**: id, name, description, category, condition, isAvailable, postedDate, userId (FK to User)
- **Offer**: id, fromUserId (FK), toUserId (FK), itemOfferedId (FK), itemRequestedId (FK), status, offerDate
- **Trade**: id, offerId (FK), tradeDate, notes
- **Rating**: id, userId (FK), raterId (FK), tradeId (FK), ratingValue, comment, ratingDate
- **AdminUser**: id, username, email, isHeadAdmin, createdBy, createdAt

**Relationships:**
- User has many Items
- User can send/receive many Offers
- Offer involves two Users and two Items
- Trade is created from an accepted Offer
- Rating is given for a completed Trade
- AdminUser is a special User


---

## Text-Based ER Diagram

```
User (id PK)
  | 1
  |——< owns >——N | Item (id PK, userId FK)
  | 1
  |——< makes >——N | Offer (id PK, fromUserId FK, toUserId FK, itemOfferedId FK, itemRequestedId FK)
  | 1
  |——< rates >——N | Rating (id PK, userId FK, raterId FK, tradeId FK)
Offer (id PK)
  | 1
  |——< results in >——N | Trade (id PK, offerId FK)
```

---

## dbdiagram.io Script

Table User {
  id int [pk, increment, note: "Primary key, unique user ID"]
  username varchar [unique, not null, note: "User's unique username"]
  email varchar [unique, not null, note: "User's unique email"]
  reputation float [note: "User's reputation score"]
  joined_date date [note: "Date the user joined"]
}

Table Item {
  id int [pk, increment, note: "Primary key, unique item ID"]
  user_id int [ref: > User.id, not null, note: "Owner (FK to User)"]
  name varchar [not null, note: "Name of the item"]
  description text [note: "Description of the item"]
  category varchar [note: "Category (e.g., Books, Electronics)"]
  condition varchar [note: "Condition (e.g., New, Used)"]
  is_available boolean [note: "Is the item available for trade?"]
  posted_date date [note: "Date item was posted"]
}

Table Offer {
  id int [pk, increment, note: "Primary key, unique offer ID"]
  from_user_id int [ref: > User.id, not null, note: "User making the offer"]
  to_user_id int [ref: > User.id, not null, note: "User receiving the offer"]
  item_offered_id int [ref: > Item.id, not null, note: "Item being offered"]
  item_requested_id int [ref: > Item.id, not null, note: "Item requested in exchange"]
  status varchar [note: "Offer status (pending, accepted, rejected)"]
  offer_date date [note: "Date the offer was made"]
}

Table Trade {
  id int [pk, increment, note: "Primary key, unique trade ID"]
  offer_id int [ref: > Offer.id, not null, note: "Offer that resulted in this trade"]
  trade_date date [note: "Date of trade"]
  notes text [note: "Additional notes about the trade"]
}

Table Rating {
  id int [pk, increment, note: "Primary key, unique rating ID"]
  user_id int [ref: > User.id, not null, note: "User being rated"]
  rater_id int [ref: > User.id, not null, note: "User who gave the rating"]
  trade_id int [ref: > Trade.id, not null, note: "Trade associated with this rating"]
  rating_value int [not null, note: "Rating value (1-5)"]
  comment text [note: "Optional comment"]
  rating_date date [note: "Date of rating"]
}

Table Admin {
  id int [pk, increment, note: "Primary key, unique admin ID"]
  user_id int [ref: > User.id, not null, note: "Admin user (FK to User)"]
  is_head_admin boolean [note: "Is this user a head admin?"]
  created_at timestamp [note: "Admin creation timestamp"]
}

#ER Diagram
![ER Diagram - Barter Community System](er-diagram.png)

---

## Why Do We Need the Community Barter System Application?

While PostgreSQL and pgAdmin4 are powerful for managing and querying data, the **Community Barter System application** is essential for providing a secure, user-friendly, and scalable platform where real users can interact safely and efficiently. Here’s why the application layer is necessary:

### Real-World Usability
- End users cannot and should not interact directly with a database or pgAdmin4.
- The application provides a user-friendly interface for registration, browsing items, making offers, trading, and leaving ratings—no SQL required.

### Security & Data Integrity
- The app enforces authentication and authorization (e.g., only logged-in users can make offers).
- Direct DB access would be a security risk—users could bypass business rules.

### Business Logic & Validation
- The backend and frontend enforce business rules (e.g., prevent duplicate offers, validate input, only allow trades between available items).
- SQL alone cannot handle all complex business logic.

### Automation & Integration
- The app can send notifications, emails, or integrate with other systems (analytics, payments, etc.).
- These workflows are not possible with just SQL or pgAdmin4.

### Scalability & Maintainability
- The app can scale to thousands of users and can be deployed online.
- All logic is version-controlled and maintainable, unlike ad-hoc SQL scripts.

### Separation of Concerns
- The DBMS (PostgreSQL) is for data storage and integrity.
- The application is for user experience, business logic, and security.

#### Summary Table
| Tool/Layer         | Role/Responsibility                                      |
|--------------------|---------------------------------------------------------|
| PostgreSQL         | Store data, enforce constraints, run SQL                |
| pgAdmin4           | DBA/admin tool for setup, debugging, and direct queries |
| Barter App         | User interface, business logic, API, automation, security|

> **In summary:** The application layer is critical for real-world use. It ensures security, usability, and proper business workflows—things that a database alone cannot provide.

---

## Live Data Sync Between PostgreSQL and the Community Barter System App

The Community Barter System app is always in sync with the PostgreSQL database. Any changes made directly in PostgreSQL (using SQL, pgAdmin4, or psql) are instantly reflected in the app.

- **Direct Database Connection:** The app backend connects directly to PostgreSQL using the `.env` connection string. All data in the app comes straight from the live database.
- **Real-Time Reflection:** If you insert, update, or delete data using SQL queries in pgAdmin4 or psql, those changes are instantly visible in your app (after a page refresh or API call). For example:
  - Add a new user in pgAdmin4 → instantly appears in the app’s user list.
  - Change an item’s details in the database → app shows the updated info.
- **No Caching or Duplication:** The app does not cache or duplicate data. Every time you use the app, it fetches fresh data from PostgreSQL. The database is the single source of truth.
- **Schema Changes:** If you change the structure of your tables (add/remove columns, etc.), update your Prisma schema and regenerate the client:
  ```sh
  npx prisma db pull
  npx prisma generate
  ```
  For data changes (inserts, updates, deletes), no extra steps are needed—changes are immediate.