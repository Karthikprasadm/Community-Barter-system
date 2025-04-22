# 🚀 How to Run & Use the Community Barter Application

A complete, step-by-step guide to setting up, running, and using the Community Barter System. This covers backend, frontend, database tools (Prisma Studio, pgAdmin4), and all essential workflows.

---

## 📋 Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (local or remote)
- **Git**
- **Recommended:** [pgAdmin4](https://www.pgadmin.org/) & a modern browser

---

## 🐳 Docker Deployment (Optional)

You can run the entire stack using Docker for easier setup and deployment.

1. **Create a `.env` file** (as described below) for both backend and frontend.
2. **Add a `Dockerfile` and `docker-compose.yml`** (see project root or sample below):

**Sample `docker-compose.yml`:**
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: barter
      POSTGRES_PASSWORD: barterpass
      POSTGRES_DB: barterdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  backend:
    build: ./barter-backend
    env_file:
      - ./barter-backend/.env
    depends_on:
      - db
    ports:
      - "15000:15000"
  frontend:
    build: .
    env_file:
      - ./.env
    depends_on:
      - backend
    ports:
      - "8080:8080"
volumes:
  pgdata:
```
3. **Run everything:**
```sh
docker-compose up --build
```

---

## 1️⃣ Clone the Repository
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

---

## 2️⃣ Install Dependencies
```sh
npm install            # In project root
cd barter-backend
npm install            # In backend directory
```

---

## 3️⃣ Configure Environment
- Copy the example env file:
  ```sh
  cp .env.example .env
  ```
- Edit `.env` with your PostgreSQL credentials and required settings (e.g., `DATABASE_URL`, `VITE_API_URL`).

---

## 4️⃣ Set Up the Database
- Run migrations to create tables:
  ```sh
  npx prisma migrate dev --name init
  ```

---

## 5️⃣ Start the Application
- **Backend:**
  ```sh
  npm run start
  # (from barter-backend directory)
  ```
- **Frontend:** (in a new terminal)
  ```sh
  cd ../
  npm run dev
  # (from project root)
  ```
- **Frontend URL:** [http://localhost:8080](http://localhost:8080)
- **Backend API:** [http://localhost:15000](http://localhost:15000)

---

## 6️⃣ Prisma Studio (Database Admin UI)
- **Start Studio:**
  ```sh
  npx prisma studio
  # (from barter-backend directory)
  ```
- Open [http://localhost:5555](http://localhost:5555) in your browser.
- Browse, edit, add, or delete users, items, trades, etc.

---

## 7️⃣ pgAdmin4 (Advanced DB GUI)
- Download & install: [pgAdmin4](https://www.pgadmin.org/)
- Add your PostgreSQL server (use credentials from `.env`)
- Browse tables, run SQL, manage DB visually

---

## 8️⃣ Using the Application
- **Admin Login:** [http://localhost:8080/admin-login](http://localhost:8080/admin-login)
- **Dashboard:** View/manage users, items, trades, analytics, and database tools
- **SQL Query Tool:** Use the Database tab to run custom SQL queries
- **Trade/Offer/Rate:** Use the UI to create offers, complete trades, and rate users/items
- **Live Updates:** Dashboard reflects real-time changes (WebSocket-powered)

---

## 9️⃣ Useful Scripts & Commands
- **Frontend:**
  ```sh
  cd D:/communitu-barter-system/barter-community-nexus
  npm run dev
  ```
- **Backend:**
  ```sh
  cd D:/communitu-barter-system/barter-community-nexus/barter-backend
  npm run start
  ```
- **Build Frontend:**
  ```sh
  npm run build
  ```
- **Run Migrations:**
  ```sh
  npx prisma migrate dev
  ```
- **Prisma Studio:**
  ```sh
  cd D:/communitu-barter-system/barter-community-nexus/barter-backend
  npx prisma studio
  ```

---

## 🔧 Troubleshooting
- **Ports in Use:** Ensure 8080 (frontend), 15000 (backend), 5555 (Prisma Studio) are free
- **Database Errors:** Double-check `.env` and PostgreSQL status
- **API Issues:** Use browser DevTools (Network tab) to inspect requests/responses
- **Studio/pgAdmin Errors:** Restart the tool or check permissions
- **Bulk Deletes:** For errors deleting many records in Prisma Studio, try smaller batches or clear related records first

---

## 📚 Resources
- [Prisma Docs](https://www.prisma.io/docs/)
- [pgAdmin4 Docs](https://www.pgadmin.org/docs/)
- [Node.js Docs](https://nodejs.org/en/docs)

---

## ❓ FAQ & Common Issues

### Q: "Ports are already in use!"
A: Make sure ports 8080 (frontend), 15000 (backend), and 5555 (Prisma Studio) are not used by other processes. Use `lsof -i :PORT` or Task Manager to free them.

### Q: "Database connection error"
A: Check your `.env` file for correct `DATABASE_URL`. Ensure PostgreSQL is running and credentials are correct.

### Q: "Frontend can't reach backend API"
A: Ensure `VITE_API_URL` in your frontend `.env` matches the backend URL/port. Both servers must be running.

### Q: "Migrations or Prisma errors"
A: Try running `npx prisma generate` and `npx prisma migrate dev` again. Make sure the database is accessible.

### Q: "Bulk deletes fail in Prisma Studio"
A: Try deleting records in smaller batches or clear dependent records first (e.g., delete offers before users).

### Q: "Docker build fails"
A: Check Docker logs for errors. Ensure your Dockerfiles and `docker-compose.yml` are up to date and environment variables are set correctly.

---

> **You’re now ready to develop, run, and manage the Community Barter System!**

---

## 4. Set Up the Database
Run migrations to set up your schema:
```sh
npx prisma migrate dev --name init
```

---

## 5. Start the Servers
### Start Backend
```sh
npm run start
```
### Start Frontend (in a new terminal)
```sh
cd ../
npm run dev
```
- Frontend: http://localhost:8080
- Backend API: http://localhost:15000

---

## 6. Using Prisma Studio
Prisma Studio is a web GUI for managing your database records.

- **Start Prisma Studio**
  ```sh
  npx prisma studio
  ```
- Open [http://localhost:5555](http://localhost:5555) in your browser.
- View, edit, add, or delete users, items, trades, etc. directly from the UI.

---

## 7. Using pgAdmin4
pgAdmin4 is a powerful GUI for PostgreSQL.

- Download and install pgAdmin4: https://www.pgadmin.org/
- Add your PostgreSQL server connection (use credentials from your `.env`).
- Browse tables, run SQL queries, and manage your database visually.

---

## 8. Using the Application
- **Admin Access:** Log in at http://localhost:8080/admin-login with admin credentials.
- **Dashboard:** View users, items, trades, analytics, and database tools.
- **SQL Query Tool:** Run custom SQL queries from the dashboard's Database tab.
- **Trade/Offer/Rate:** Use the UI to create offers, complete trades, and rate users/items.

---

## 9. Useful Scripts
- go to "cd D:\communitu-barter-system\barter-community-nexus" 
`npm run dev` — Start frontend in development mode
- go to "cd d:/communitu-barter-system/barter-community-nexus/barter-backend"
`npm run start` — Start backend server
- `npm run build` — Build frontend for production
- `npx prisma migrate dev` — Run migrations
-go to "cd d:/communitu-barter-system/barter-community-nexus/barter-backend" 
`npx prisma studio` — Open Prisma Studio

---

## 10. Troubleshooting
- **Ports in Use:** Make sure ports 8080 (frontend), 15000 (backend), and 5555 (Prisma Studio) are free.
- **Database Errors:** Double-check your `.env` settings and PostgreSQL status.
- **API Issues:** Use browser DevTools (Network tab) to inspect API requests and responses.

---

## 11. Additional Resources
- [Prisma Docs](https://www.prisma.io/docs/)
- [pgAdmin4 Docs](https://www.pgadmin.org/docs/)
- [Node.js Docs](https://nodejs.org/en/docs)

---

**You are now ready to run and use the Community Barter System!**
