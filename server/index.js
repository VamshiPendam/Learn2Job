const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Load env only in non-production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, '../.env') });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection Singleton for Serverless
let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) return cachedDb;

    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is missing');
        return null;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = db;
        console.log('MongoDB connected');
        return db;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        return null;
    }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
const authRoute = require('./routes/auth.js');
app.use('/api/auth', authRoute);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend is running',
        dbConnected: mongoose.connection.readyState === 1,
        env: process.env.NODE_ENV
    });
});

app.get('/', (req, res) => {
    res.send('AI Career Nexus Backend is running');
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
