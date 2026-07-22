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

## Prompt 4
Write boilerplate code to connect the database and start the server.

### AI Response

Created the following boilerplate files:

#### `src/config/db.js`
- Connects to MongoDB using Mongoose.
- Reads the `MONGO_URI` environment variable.
- Logs a successful connection or exits on connection failure.

#### `src/app.js`
- Creates and configures the Express application.
- Adds essential middleware (`cors` and `express.json()`).
- Exports the Express app.

#### `src/server.js`
- Loads environment variables using `dotenv`.
- Connects to MongoDB.
- Starts the Express server after a successful database connection using the configured `PORT` (default: `5000`).

## Prompt 5
What test cases should I write for the `registerUser` service? Guide me to implement it step by step instead of giving the complete code.

### AI Response

Suggested the following test cases for the `registerUser` service:

- Create a user with a hashed password.
- Reject registration if the email already exists.
- Throw an error if the email or password is missing.

Then provided step-by-step guidance following the TDD approach:

#### Step 1 (RED)
- Create `tests/services/registerUser.test.js`.
- Set up an in-memory MongoDB database for testing.
- Write tests for each expected behavior.
- Run the tests and confirm they fail.

#### Step 2 (GREEN)
- Create `src/services/registerUser.js`.
- Validate that the required fields are provided.
- Check whether a user with the given email already exists.
- Hash the password before saving it.
- Save the new user and return the created user.
- Run the tests again and verify they pass.

#### Step 3 (REFACTOR)
- Improve code readability if needed.
- Ensure all tests continue to pass after refactoring.

## Prompt 6
Guide me step by step to implement the `loginUser` service using TDD instead of giving the complete code.

### AI Response

Suggested the following test cases for the `loginUser` service:

- Return a JWT token when the email and password are correct.
- Throw an error if the password is incorrect.
- Throw an error if the email does not exist.

Then provided step-by-step guidance following the TDD approach:

#### Step 1 (RED)
- Create `tests/services/loginUser.test.js`.
- Set up an in-memory MongoDB database for testing.
- Create a test user with a hashed password.
- Write tests for successful login, incorrect password, and unknown email.
- Verify the returned JWT contains the expected payload (`userId` and `role`).
- Run the tests and confirm they fail.

#### Step 2 (GREEN)
- Create `src/services/loginUser.js`.
- Validate that the email and password are provided.
- Find the user by email.
- Compare the provided password with the stored hashed password using `bcrypt.compare()`.
- Generate and return a JWT using `jwt.sign()` with the user's ID and role.
- Run the tests again and verify they pass.

#### Step 3 (REFACTOR)
- Improve the implementation without changing its behavior.
- Run all tests to ensure they continue to pass.

## Prompt 7
Write boilerplate code for the authentication controller and router setup.

### AI Response

Created the following boilerplate files:

#### `src/controllers/authController.js`
- Created `register(req, res)` and `login(req, res)` controller functions.
- Connected each controller to its corresponding service (`registerUser` and `loginUser`).
- Returned appropriate JSON responses with the correct HTTP status codes.
- Added basic error handling for invalid requests.

#### `src/routers/authRouter.js`
- Created an Express router.
- Added `POST /register` route mapped to `authController.register`.
- Added `POST /login` route mapped to `authController.login`.
- Exported the router for use in the main application.