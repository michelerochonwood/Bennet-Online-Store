const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Middleware to ensure cart exists in session
function ensureCart(req, res, next) {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
}

// Add product to cart
router.post('/add/:id', ensureCart, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const quantity = parseInt(req.body.quantity) || 1;

        // Compare IDs as strings
        const existingProductIndex = req.session.cart.findIndex(item => item.product._id.toString() === product._id.toString());
        if (existingProductIndex > -1) {
            req.session.cart[existingProductIndex].quantity += quantity;
        } else {
            req.session.cart.push({ product, quantity });
        }

        res.redirect('/cart'); // Redirect to cart after adding
    } catch (err) {
        res.status(500).send('Error adding to cart: ' + err.message);
    }
});

// Display cart
router.get('/', ensureCart, (req, res) => {
    res.render('cart', { cart: req.session.cart });
});

// Remove product from cart
router.post('/remove/:id', ensureCart, (req, res) => {
    req.session.cart = req.session.cart.filter(item => item.product._id.toString() !== req.params.id);
    res.redirect('/cart');
});

module.exports = router;


