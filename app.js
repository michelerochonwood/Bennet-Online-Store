const express = require('express');
const { join } = require('path');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

require('dotenv').config();

// Create Express app
const app = express();

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up Helmet to enhance security
app.use(helmet());

// Set up Handlebars with .hbs extension and register partials
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'views/layouts'),
    partialsDir: join(__dirname, 'views/partials'),
    helpers: {
        multiply: (a, b) => a * b,
        totalCartPrice: (cart) => cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
    }
}));
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Set up session management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize passport and restore session
app.use(passport.initialize());
app.use(passport.session());

// Set up passport-local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Specify that 'email' should be used instead of 'username'
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found with email:', email);
                return done(null, false, { message: 'Incorrect email.' });
            }

            console.log('User found:', user.email);

            // Directly compare the plain text password
            if (password !== user.password) {
                console.log('Password does not match for user:', email);
                return done(null, false, { message: 'Incorrect password.' });
            }

            console.log('Password matches for user:', email);
            return done(null, user);
        } catch (err) {
            console.error('Error during authentication:', err);
            return done(err);
        }
    }
));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean(); // Use .lean() here if needed for Handlebars
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Middleware to set user in response locals
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Set up routes
app.use('/', require('./routes/index'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/auth', require('./routes/auth'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
















