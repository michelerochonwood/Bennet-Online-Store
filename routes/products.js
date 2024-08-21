const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Route to handle form submission (no change needed here)
router.post('/add', async (req, res) => {
    try {
        const { title, subtitle, image, description, price } = req.body;
        
        // Create a new product
        const newProduct = new Product({
            title,
            subtitle,
            image,
            description,
            price
        });

        // Save the product to the database
        await newProduct.save();
        
        res.redirect('/products'); // Redirect to the product listing page
    } catch (err) {
        res.status(500).send('Error adding product: ' + err.message);
    }
});

// Route to display all products (include the add product form in this view)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean(); // Use .lean() to get plain objects
        res.render('product-list', { products }); // Render the product-list view with products
    } catch (err) {
        res.status(500).send('Error fetching products: ' + err.message);
    }
});

module.exports = router;






