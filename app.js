"use strict"

/** Express app */

const express = require('express');
const cors = require('cors');
const { NotFoundError } = require('./ExError');

const { authenticateToken } = require('./middleware/auth')

const staffRoutes = require('./routes/staff');
const playersRoutes = require('./routes/players');
const teamRoutes = require('./routes/teams');

const morgan = require('morgan');
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

/* Middleware: check for jwt and verify */
app.use(authenticateToken);

/* ROUTES */
app.use("/staff", staffRoutes);
app.use("/players", playersRoutes);
app.use("/teams", teamRoutes);

// handle 404
app.use((req, res, next) => {
    return next(new NotFoundError());
});

// general error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.msg || 'server error'

    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;