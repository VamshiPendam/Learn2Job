const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load .env only in local dev (Vercel uses its own env vars)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
}


const passport = require('passport');
require('./config/passport');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Passport session (required for OAuth)
const session = require('express-session');
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Singleton — reuse connection across warm serverless invocations
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    if (!process.env.MONGODB_URI) {
        console.error('[DB] MONGODB_URI not set');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('[DB] Connected to MongoDB');
    } catch (err) {
        console.error('[DB] Connection failed:', err.message);
    }
}

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Health check — visit /api/health to verify the function is working
app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        dbState: mongoose.connection.readyState, // 1 = connected
        mongoUri: process.env.MONGODB_URI ? 'set' : 'MISSING',
        jwtSecret: process.env.JWT_SECRET ? 'set' : 'MISSING',
    });
});

// Generic error handler to log errors and return JSON in dev
app.use((err, req, res, next) => {
    console.error('[Server] Unhandled error:', err && err.stack ? err.stack : err);
    if (res.headersSent) return next(err);
    res.status(err && err.status ? err.status : 500).json({ message: err && err.message ? err.message : 'Internal Server Error' });
});

// Process-level handlers for uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
    console.error('[Process] uncaughtException:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
    console.error('[Process] unhandledRejection:', reason && reason.stack ? reason.stack : reason);
});

// Auth routes
const authRoute = require('./routes/auth.js');
app.use('/api/auth', authRoute);
app.use('/auth', authRoute);

// Local dev server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, async () => {
        console.log(`[Server] Listening on port ${PORT}`);
        await connectDB();
    });
}

module.exports = app;
