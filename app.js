const express = require('express');
const { join } = require('path');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Handlebars with .hbs extension and register partials
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'views/layouts'),
    partialsDir: join(__dirname, 'views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// MongoDB connection (replace with your connection string)
const mongoURI = 'mongodb+srv://michelelrochon:z1uxGMXfMnPdn0oc@beecluster1.wgm60.mongodb.net/BennetsBees?retryWrites=true&w=majority&appName=beecluster1';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Set up routes
app.use('/', require('./routes/index'));
app.use('/products', require('./routes/products')); // Ensure this is correct
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/', require('./routes/home2')); // Use the new route

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});





