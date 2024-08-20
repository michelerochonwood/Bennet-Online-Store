// products.js in routes
const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Route to render the add product form
router.get('/add', (req, res) => {
    res.render('add-product');
});

// Route to handle form submission
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

// Route to display all products
router.get('/', async (req, res) => {
    console.log('GET /products route hit'); // Add this line to debug
    try {
        const products = await Product.find();
        console.log(products); // Add this line to debug
        res.render('product-list', { products });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products: ' + err.message);
    }
});



module.exports = router;




