// index.js (or app.js)
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Route for home page with home2 partial
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('home', { 
            // You might need to use the main layout or another template
            home2Partial: 'home2', // Ensure this points to your partial
            products 
        });
    } catch (err) {
        res.status(500).send('Error fetching products: ' + err.message);
    }
});

module.exports = router;





