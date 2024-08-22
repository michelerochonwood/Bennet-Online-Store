const express = require('express');
const router = express.Router();

// Middleware to ensure cart exists and isn't empty
function ensureCartNotEmpty(req, res, next) {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect('/cart');
    }
    next();
}

// Display checkout page
router.get('/', ensureCartNotEmpty, (req, res) => {
    res.render('checkout', { cart: req.session.cart });
});

// Handle checkout form submission
router.post('/', ensureCartNotEmpty, (req, res) => {
    const { name, email, address, city, state, zip, paymentMethod } = req.body;

    // In a real application, you would process the payment here
    // For now, let's assume the payment is successful and clear the cart

    req.session.cart = []; // Clear the cart

    res.render('checkout-success', { name, email });
});

module.exports = router;

