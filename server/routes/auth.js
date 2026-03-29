const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const passport = require('passport');
const crypto = require('crypto');

// Update Profile
router.put('/update-profile', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No authentication token, access denied' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.status(401).json({ message: 'Token verification failed, authorization denied' });

        const { username, title, about, profileImage } = req.body;

        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== verified.id) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            verified.id,
            { $set: { username, title, about, profileImage } },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username, email and password are required' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Google OAuth Login
router.get('/google', (req, res, next) => {
    const backendBase = (process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `${backendBase}/auth/google/callback`;
    console.log('[Auth] Initiating Google OAuth, callbackUrl=', callbackUrl);
    passport.authenticate('google', { scope: ['profile', 'email'], callbackURL: callbackUrl })(req, res, next);
});

// Google OAuth Callback Handler
const handleGoogleCallback = (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    // Redirect to root with token so LandingPage can handle it and show Dashboard
    const redirectUrl = `${frontend.replace(/\/$/, '')}/?token=${token}`;
    console.log('[Auth] Google OAuth success, redirecting to Dashboard:', redirectUrl);
    res.redirect(redirectUrl);
};

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), handleGoogleCallback);
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), handleGoogleCallback);

// Regular Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Current User
router.get('/me', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No authentication token, access denied' });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User with that email does not exist.' });

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontend.replace(/\/$/, '')}/?resetToken=${token}`;
        console.log('\n--- PASSWORD RESET ---', resetUrl, '\n');

        res.json({ message: 'Password reset link generated.', resetUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Token invalid or expired.' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Password reset successful.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
