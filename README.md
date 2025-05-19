# Community Barter System

A modern web application for community-driven bartering, built as a DBMS/SQL project. This app enables users to list, offer, and trade goods, with a secure admin dashboard for management.

## 🌟 Key Features

- **User Management**
  - Secure registration and login
  - Profile management with reputation system
  - User statistics and activity tracking
  - Trade history and reviews

- **Item Management**
  - List items for barter
  - Browse marketplace
  - Make and receive offers
  - Track item status

- **Trading System**
  - Real-time offer notifications
  - Trade history tracking
  - User reputation system
  - Rating and review system

- **Admin Features**
  - User management dashboard
  - Item moderation
  - Trade monitoring
  - Analytics and reporting

## 🛠️ Tech Stack

- **Frontend**
  - React with TypeScript
  - Vite for build tooling
  - Tailwind CSS for styling
  - Shadcn UI components
  - React Query for data fetching

- **Backend**
  - Node.js with Express
  - TypeScript
  - PostgreSQL database
  - Prisma ORM
  - WebSocket for real-time updates

- **Development Tools**
  - ESLint for code linting
  - Jest for testing
  - GitHub Actions for CI/CD
  - Docker support

## 🚀 Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Karthikprasadm/community-barter-system.git
   cd community-barter-system
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd barter-backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cd barter-backend
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Frontend
   cd ..
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Database Setup**
   ```bash
   cd barter-backend
   npx prisma migrate dev --name init
   ```

5. **Start the Application**
   ```bash
   # Start backend (in barter-backend directory)
   npm run dev
   
   # Start frontend (in root directory)
   npm run dev
   ```

## 📱 Features in Detail

### User Profile
- Profile customization
- Activity statistics
- Reputation score
- Trade history
- Item management

### Marketplace
- Browse items
- Search and filter
- Make offers
- Track trades

### Admin Dashboard
- User management
- Content moderation
- Analytics
- System settings

## 🔧 Development

### Available Scripts
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests

# Backend
cd barter-backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration-name>

# Open Prisma Studio
npx prisma studio
```

## 📚 Documentation

- [API Documentation](./API.md)
- [Setup Guide](./HOW_TO_RUN_AND_USE.md)
- [Testing Guide](./TESTS.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- Karthik Prasad M - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by community barter systems
- Built with modern web technologies

## 🚦 CI/CD & Deployment

- **CI/CD:**
  - Automated tests and linting via GitHub Actions on every push and PR.
  - Coverage reports generated for backend tests.
- **Deployment:**
  - Easily deployable to cloud platforms (Render, Heroku, Vercel, Netlify, etc.).
  - Configure environment variables for production in `.env` files.
  - For Docker-based deployment, add a `Dockerfile` and use `docker-compose` for multi-service orchestration.

## Project info

## How can I edit this code?

There are several ways of editing your application.

Clone this repository and follow the local setup instructions below to start developing and contributing.

Changes made locally should be committed and pushed to your remote repository as usual.

**Use your preferred IDE**

# Community Barter System

A full-stack application for managing a barter-based community marketplace. Includes real-time sync, robust admin tools, and analytics.

---

## 🏁 Quick Start

For detailed setup and usage instructions, see [HOW_TO_RUN_AND_USE.md](./HOW_TO_RUN_AND_USE.md).

### TL;DR
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
cd barter-backend
npm install
cp .env.example .env
# Edit .env with your DB credentials
npx prisma migrate dev --name init
npm run start
# In another terminal:
cd ../
npm run dev
```

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Testing:** Jest, Supertest
- **Dev Tools:** Prisma Studio, pgAdmin4

---

## 📂 Project Structure
```
barter-community-nexus/
├── barter-backend/      # Express API, Prisma, DB logic
├── src/                # Frontend React code
├── public/             # Static assets
├── docs/               # Documentation
├── .env.example        # Sample environment variables
└── ...
```

---

## 🚀 Features
- User, Item, Offer, Trade, and Rating management
- Real-time dashboard with WebSocket sync
- Admin analytics, activity log, and SQL query tool
- Secure authentication and environment variable management
- Database admin via Prisma Studio and pgAdmin4

---

## 📦 Dependency Management
- Regularly check for outdated packages:
  ```sh
  npm outdated
  ```
- Update all safe dependencies:
  ```sh
  npm update
  ```
- For major version upgrades, check changelogs and run:
  ```sh
  npm install <package>@latest
  ```

### Security Checks
- Regularly audit for vulnerabilities:
  ```sh
  npm audit
  ```
- Apply available fixes:
  ```sh
  npm audit fix
  ```
- For forceful fixes (may introduce breaking changes):
  ```sh
  npm audit fix --force
  ```

### Cleaning Up
- Remove unused dependencies:
  ```sh
  npm prune
  ```
- Clean install (if you notice issues):
  ```sh
  rm -rf node_modules package-lock.json # (use File Explorer or PowerShell on Windows)
  npm install
  ```

### General Best Practices
- Pin or review versions in `package.json` as needed.
- Use TypeScript for type safety.
- Keep your `.env` file up to date and **never commit secrets**.
- Document your update process for future contributors.
- Use version control (git) and commit regularly.

### After Any Update
- Run your app and tests to ensure nothing is broken:
  ```sh
  npm run dev
  npm run build
  # ...and your test scripts
  ```
- Check for new warnings or errors in the terminal and browser.

---

_Keeping dependencies updated and following these practices will help ensure your project stays stable, secure, and easy to work with for years to come!_

---

## 🗄️ Backend, Database & Prisma Best Practices

Follow these guidelines to keep your backend and database healthy, reliable, and maintainable:

### Environment Variables & Security
- Store secrets (like `DATABASE_URL`) in your `.env` file. **Never commit secrets to version control!**
- Use environment variables for all credentials and sensitive config.
- Rotate database credentials regularly and after any suspected leak.

### Prisma ORM
- After editing your Prisma schema:
  ```sh
  npx prisma generate
  # If you changed the schema (models/tables):
  npx prisma migrate dev --name <migration-name>
  ```
- Use `npx prisma studio` to visually inspect and edit your data.
- Keep your `prisma/schema.prisma` file in sync with your actual database structure.
- Review [Prisma best practices](https://www.prisma.io/docs/concepts/components/prisma-best-practices).

### Database Management
- Use a tool like pgAdmin or Prisma Studio for safe database inspection and edits.
- Always back up your database before running destructive migrations or bulk updates.
- Use migrations (not manual SQL) to change your schema so everything is tracked and reproducible.
- Version control your migration files (`prisma/migrations`).

### Backend Code
- Use TypeScript for type safety and fewer runtime errors.
- Validate all user input on the backend (e.g., with Zod or Joi).
- Handle errors gracefully and log them for debugging.
- Write automated tests for key endpoints (see `barter-backend/tests`).

### Keeping Up-to-Date
- Regularly update Prisma and database drivers:
  ```sh
  npm update @prisma/client prisma
  ```
- Check for breaking changes in Prisma's release notes before major upgrades.

### After Any Backend/DB Update
- Run all tests:
  ```sh
  npm test
  # or your test command
  ```
- Start your backend and check logs for errors.
- Verify that data changes in pgAdmin/Prisma Studio are reflected in your app and vice versa.

---

_Following these backend and database best practices will keep your app robust, secure, and easy to evolve!_

- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

To publish or share your project, use your preferred platform or deployment method (see deployment instructions below).

## Custom Domains

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Refer to your deployment provider's documentation for instructions on connecting a custom domain.
