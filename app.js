const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const financeRoutes = require('./routes/financeRoutes');
require('./config/passportConfig')(passport);

const app = express();

// EJS Setup
app.set('view engine', 'ejs');

// Bodyparser Middleware
app.use(express.urlencoded({ extended: false }));

// Static Folder
app.use(express.static(path.join(__dirname, 'public/css/')));

// Express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware for displaying messages
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.warning_msg = req.flash('warning_msg'); // Added for warning messages
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render('index'); // Ensure you have a file named 'index.ejs' in your views directory
});

// Routes
app.use('/auth', authRoutes);
app.use('/finance', financeRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
