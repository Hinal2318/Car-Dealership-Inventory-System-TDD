const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/authRouter.js');
const vehicleRouter = require('./routers/vehicleRouter.js'); // Import vehicle router

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/vehicles', vehicleRouter); // Mount vehicle router

module.exports = app;
