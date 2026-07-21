# AI Usage Log

## Prompt 1

I am building a Car Dealership Inventory Management System using the MERN stack. What are the prerequisites needed to follow a Test-Driven Development (TDD) approach?

### AI Response

* Separate `app.js` (Express app) from `server.js` (starts server).
* Use `mongodb-memory-server` for an isolated test database.
* Follow a layered architecture (Models, Controllers, Routes, Middleware).
* Install `jest`, `supertest`, `mongodb-memory-server`, and `cross-env`.
* Configure a test database setup file.
* Follow the TDD cycle: **Red → Green → Refactor**.
* Define feature requirements before writing tests.

---

## Prompt 2

Is there any configuration file required for testing?

### AI Response

Yes. Create a `jest.config.js` file to configure:

* Node test environment
* Test file matching
* Automatic mock clearing
* Test timeout
* Coverage reporting
* Exclude `server.js` from coverage

---

## Prompt 3

Create the required Jest configuration and update `package.json` test scripts.

### AI Response

Created `jest.config.js` with the required Jest settings and updated `package.json` with:

* `npm test` – Run tests
* `npm run test:watch` – Run tests in watch mode
* `npm run test:coverage` – Generate code coverage reports
