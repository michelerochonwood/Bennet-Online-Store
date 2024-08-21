// routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Route to render registration form
router.get('/register', (req, res) => {
    res.render('register'); // Render the register.hbs page
});

// Route for user registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.redirect('/auth/registered'); // Redirect to a success page after registration
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).send('Error registering user: ' + err.message);
    }
});

// Route to render registered success page
router.get('/registered', (req, res) => {
    res.render('registered'); // Render the registered.hbs page
});

// Route for user login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/products', // Redirect after successful login
    failureRedirect: '/auth/login', // Redirect back to login on failure
    failureFlash: true
}));

// Route to render login form
router.get('/login', (req, res) => {
    res.render('login'); // Render the login.hbs page
});

// Route for user logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/'); // Redirect to home page after logout
});

module.exports = router;




