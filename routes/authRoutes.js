const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/userModel');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register Page
router.get('/register', (req, res) => res.render('register', { errors: [], name: '', email: '', password: '', password2: '' }));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
        errors.push({ msg: 'Invalid email format' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', { errors, name, email, password, password2 });
    } else {
        User.findByEmail(email, (err, user) => {
            if (err) throw err;
            if (user) {
                errors.push({ msg: 'Email is already registered' });
                res.render('register', { errors, name, email, password, password2 });
            } else {
                User.createUser({ name, email, password }, (err, result) => {
                    if (err) throw err;
                    req.flash('success_msg', 'You are registered and can log in');
                    res.redirect('/auth/login');
                });
            }
        });
    }
});

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/finance/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
});

module.exports = router;
