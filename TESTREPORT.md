# Car Dealership Inventory System - Test Report

**Generated on:** July 22, 2026
**Test Framework:** Jest (Latest)

## Overall Test Results

| Metric      | Result                   |
| ----------- | ------------------------ |
| Test Suites | **11 passed / 11 total** |
| Tests       | **37 passed / 37 total** |
| Snapshots   | **0 total**              |
| Time        | **23.46 seconds**        |

> ✅ **Result: ALL TESTS PASSED**

---

# Code Coverage Report

| File                     |   % Stmts |  % Branch |   % Funcs |   % Lines | Uncovered Line(s)                      |
| ------------------------ | --------: | --------: | --------: | --------: | -------------------------------------- |
| **All files**            | **85.89** | **78.43** | **95.23** | **85.89** |                                        |
| **src**                  |       100 |       100 |       100 |       100 |                                        |
| └── app.js               |       100 |       100 |       100 |       100 |                                        |
| **src/config**           |         0 |       100 |         0 |         0 |                                        |
| └── db.js                |         0 |       100 |         0 |         0 | 1–13 (unused in tests)                 |
| **src/controllers**      |     69.35 |         0 |       100 |     69.35 |                                        |
| ├── authController.js    |        60 |         0 |       100 |        60 | 21–22, 39–45                           |
| └── vehicleController.js |      73.8 |         0 |       100 |      73.8 | 16, 26, 36, 46–47, 57–58, 68–69, 80–81 |
| **src/middleware**       |     94.44 |       100 |       100 |     94.44 |                                        |
| ├── adminMiddleware.js   |       100 |       100 |       100 |       100 |                                        |
| └── authMiddleware.js    |      92.3 |       100 |       100 |      92.3 | 25                                     |
| **src/models**           |       100 |       100 |       100 |       100 |                                        |
| ├── User.js              |       100 |       100 |       100 |       100 |                                        |
| └── Vehicle.js           |       100 |       100 |       100 |       100 |                                        |
| **src/routers**          |       100 |       100 |       100 |       100 |                                        |
| ├── authRouter.js        |       100 |       100 |       100 |       100 |                                        |
| └── vehicleRouter.js     |       100 |       100 |       100 |       100 |                                        |
| **src/services**         |     95.49 |     92.10 |       100 |     95.49 |                                        |
| ├── addVehicle.js        |        90 |      90.9 |       100 |        90 | 15                                     |
| ├── deleteVehicle.js     |       100 |       100 |       100 |       100 |                                        |
| ├── loginUser.js         |     94.11 |        90 |       100 |     94.11 | 10                                     |
| ├── purchaseVehicle.js   |     92.85 |      87.5 |       100 |     92.85 | 6                                      |
| ├── registerUser.js      |       100 |       100 |       100 |       100 |                                        |
| ├── restockVehicle.js    |     92.85 |      90.9 |       100 |     92.85 | 6                                      |
| ├── searchVehicles.js    |     94.44 |     88.88 |       100 |     94.44 | 13                                     |
| ├── updateVehicle.js     |       100 |       100 |       100 |       100 |                                        |
| └── viewAllVehicles.js   |       100 |       100 |       100 |       100 |                                        |

---

# Detailed Test Results

## Integration Tests (Supertest)

### `tests/auth.test.js`

* Complete authentication flow:

  * User Registration
  * User Login
  * Access protected routes using JWT

### `tests/vehicle.test.js`

* Authentication validation (missing token → `401 Unauthorized`)
* Authorization validation (non-admin restrictions → `403 Forbidden`)
* Add Vehicle
* View All Vehicles
* Search Vehicles
* Update Vehicle
* Purchase Vehicle
* Restock Vehicle
* Delete Vehicle

---

## Unit Tests (Service Layer)

* `registerUser`
* `loginUser`
* `addVehicle`
* `deleteVehicle`
* `updateVehicle`
* `viewAllVehicles`
* `searchVehicles`
* `purchaseVehicle`
* `restockVehicle`

---

# Test Summary

| Test Suite Type   | Tests Passed | Tests Failed | Success Rate |
| ----------------- | -----------: | -----------: | -----------: |
| Integration Tests |           11 |            0 |     **100%** |
| Unit Tests        |           26 |            0 |     **100%** |
| **Total**         |       **37** |        **0** |     **100%** |

---

# Test Quality Metrics

## Error Handling & Edge Cases Covered

* Validation for missing registration and vehicle fields.
* Prevention of duplicate user registrations.
* Validation of invalid restock values (negative, zero, decimal, or non-numeric).
* Purchase validation preventing purchases when stock reaches zero.
* Authentication and authorization checks for protected routes.
* Search functionality tested with individual filters, combined filters, and no-match scenarios.

---

# Conclusion

## Success Criteria Met

* ✅ All **37 test cases** passed successfully.
* ✅ **95.49%** code coverage achieved for the business service layer (`src/services`).
* ✅ Authentication and authorization verified using Supertest integration tests.
* ✅ CRUD operations and inventory workflows thoroughly tested.

---

# Final Status

**✅ COMPLETE — ALL 37 TESTS PASSED**
