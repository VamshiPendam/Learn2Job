const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load .env only in local dev (Vercel uses its own env vars)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Auth routes
const authRoute = require('./routes/auth.js');
app.use('/api/auth', authRoute);

// Local dev server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`[Server] Listening on port ${PORT}`));
}

module.exports = app;
