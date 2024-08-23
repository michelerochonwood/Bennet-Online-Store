const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Render the registration page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle registration form submission
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.redirect('/auth/register');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect('/auth/register');
        }

        // Create a new user with isAdmin set to false by default
        const newUser = new User({
            username,
            email,
            password, // Save plain text password directly
            isAdmin: false // Default to non-admin user
        });

        await newUser.save();

        req.logIn(newUser, (err) => {
            if (err) {
                console.error('Login Error:', err);
                return res.redirect('/auth/login');
            }
            req.session.username = username;
            return res.redirect('/');
        });
    } catch (err) {
        console.error('Registration Error:', err);
        res.redirect('/auth/register');
    }
});

// Render the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login form submission
router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/auth/login');
        }

        // Compare the plain text password
        const isMatch = req.body.password === user.password;
        if (!isMatch) {
            return res.redirect('/auth/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.username = user.username;
            return res.redirect('/');
        });
    })(req, res, next);
});

// Handle logout and redirect to the homepage
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout Error:', err);
            return res.redirect('/');
        }
        req.session.destroy(() => {
            res.redirect('/'); // Redirect to the homepage
        });
    });
});

module.exports = router;






