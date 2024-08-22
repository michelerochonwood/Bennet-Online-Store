const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Route to handle form submission for adding a new product
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
    try {
        const products = await Product.find().lean(); // Use .lean() to get plain objects
        res.render('product-list', { 
            products, 
            user: req.user // Pass the user data to the template
        });
    } catch (err) {
        res.status(500).send('Error fetching products: ' + err.message);
    }
});

// Route to handle editing a product
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('edit-product', { product, user: req.user });
    } catch (err) {
        res.status(500).send('Error fetching product for editing: ' + err.message);
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { title, subtitle, image, description, price } = req.body;
        await Product.findByIdAndUpdate(req.params.id, {
            title,
            subtitle,
            image,
            description,
            price
        });
        res.redirect('/products'); // Redirect back to product list after editing
    } catch (err) {
        res.status(500).send('Error editing product: ' + err.message);
    }
});

// Route to handle deleting a product
router.post('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products'); // Redirect back to product list after deletion
    } catch (err) {
        res.status(500).send('Error deleting product: ' + err.message);
    }
});

// Route to display an individual product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('product', { product, user: req.user });
    } catch (err) {
        res.status(500).send('Error fetching product: ' + err.message);
    }
});


module.exports = router;








