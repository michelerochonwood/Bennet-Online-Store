const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Route to add a test product
router.get('/add-test-product', async (req, res) => {
    try {
        const newProduct = new Product({
            title: 'Test Product',  // Change to match your model
            price: 9.99,
            image: 'https://via.placeholder.com/150'
        });
        await newProduct.save();
        res.send('Test product added successfully!');
    } catch (err) {
        res.status(500).send('Error adding test product: ' + err.message);
    }
});

// Route to list all products
router.get('/list-products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Error fetching products: ' + err.message);
    }
});

// Route to render test page
router.get('/', (req, res) => {
    res.render('test');
});

module.exports = router;

