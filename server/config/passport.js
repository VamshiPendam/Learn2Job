// Google OAuth setup for Express backend
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Determine callback URL. Prefer explicit GOOGLE_CALLBACK_URL, otherwise
    // fall back to BACKEND_URL + GOOGLE_CALLBACK_PATH (or default path).
    callbackURL: (process.env.GOOGLE_CALLBACK_URL || ((process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '') + (process.env.GOOGLE_CALLBACK_PATH || '/api/auth/google/callback'))),
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('[Passport] Google profile received:', profile.id, profile.emails && profile.emails[0] && profile.emails[0].value);
        
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
            return done(new Error('No email returned from Google'), null);
        }

        // 1. Try to find user by googleId
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            console.log('[Passport] User not found by googleId, searching by email:', email);
            // 2. Try to find user by email (account linking)
            user = await User.findOne({ email: email.toLowerCase() });
            
            if (user) {
                console.log('[Passport] Found existing user by email, linking googleId.');
                user.googleId = profile.id;
                // If the user's username is missing or somehow invalid, we can update it too.
                await user.save();
            } else {
                console.log('[Passport] Creating new user for Google login.');
                
                // Fallback for username if displayName is missing or too short
                let username = profile.displayName || email.split('@')[0];
                if (username.length < 3) username = username + '_' + Math.floor(Math.random() * 1000);

                // Check again for unique username collision
                const existingUsername = await User.findOne({ username });
                if (existingUsername) {
                    username = username + '_' + Math.floor(Math.random() * 1000);
                }

                user = await User.create({
                    googleId: profile.id,
                    username: username,
                    email: email.toLowerCase(),
                    // We can also pull the profile picture!
                    profileImage: (profile.photos && profile.photos[0] && profile.photos[0].value) || ''
                });
            }
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
