# 🧪 Testing Guide: Community Barter System

This document describes all automated tests run with **Jest** for the Community Barter System backend, how to run them, and what each test file covers.

---

## 🚀 How to Run Tests

1. **Install dependencies** (if not done):
   ```sh
   cd barter-backend
   npm install
   ```
2. **Run all tests:**
   ```sh
   npm test
   # or
   npx jest
   ```
3. **Run a specific test file:**
   ```sh
   npx jest tests/<test-file>.test.ts
   ```

---

## 🗂️ Test Files & Specifications

### Backend Tests

### 1. `api.test.ts`
- **Purpose:** Core API CRUD tests for users, items, offers, trades, and ratings.
- **Specs:**
  - Create, list, and delete users/items
  - Offer, trade, and rating flows
  - Checks for correct status codes and response structures

### 2. `api.edge.test.ts`
- **Purpose:** Edge cases & permissions for API endpoints.
- **Specs:**
  - Rejects invalid/missing fields
  - Invalid user/item/offer/rating IDs
  - Unauthorized actions (e.g., deleting another user's item)
  - 404/400 error handling

### 3. `api.rare-edge.test.ts`
- **Purpose:** Rare and extreme API edge cases.
- **Specs:**
  - Malformed JSON payloads
  - Unsupported HTTP methods (e.g., PATCH)
  - Large payloads (2MB+)
  - Foundation for future tests (rate limiting, unusual roles, etc.)

### 4. `api.search.test.ts`
- **Purpose:** Advanced search and filtering for users and items.
- **Specs:**
  - Search by name, category, generic query (`q`)
  - User search by username
  - Ensures search endpoints return correct filtered results

### 5. `bulk-api.test.ts`
- **Purpose:** Bulk operations for items and offers.
- **Specs:**
  - Bulk create/update/delete for items
  - Bulk delete for offers
  - Verifies correct count and state after operations

### 6. `websocket-events.test.ts`
- **Purpose:** Real-time WebSocket event emission and handling.
- **Specs:**
  - WebSocket server setup
  - Emits `item:created` event when new item is added
  - Validates event payload and timing

### 7. `sanity.test.ts`
- **Purpose:** Sanity check for Jest setup.
- **Specs:**
  - Simple test: `1 + 1 === 2`

---

### Frontend Tests (Planned)
- **Purpose:** Unit and integration tests for React components and pages.
- **Specs:**
  - To be added: Use Jest and React Testing Library for component and UI logic tests.
  - Run with: `npm test` or `npx jest` from the project root (when implemented).

---

## 📋 Notes
- **Coverage:** These tests cover API correctness, error handling, real-time events, and bulk operations.

---

## 📊 Test Coverage & CI
- **Coverage:**
  - Run `npx jest --coverage` to generate a test coverage report (HTML/text summary in `coverage/` directory).
- **Continuous Integration (CI):**
  - All pushes and pull requests trigger automated testing and linting via GitHub Actions.
  - Coverage and build status are checked on every commit.
- **Frontend:**
  - When frontend tests are implemented, they will be included in the CI workflow.
- **Extending:** Add new `.test.ts` files in `barter-backend/tests/` as features grow.
- **Best Practice:** Run tests before each deployment or after major changes.

---

**For more details, open each test file in `barter-backend/tests/` and review the test cases!**
