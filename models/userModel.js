const db = require('./db');
const bcrypt = require('bcryptjs');

// Find user by email
exports.findByEmail = (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(null, null);
        return callback(null, results[0]);
    });
};

// Find user by ID
exports.findById = (id, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(null, null);
        return callback(null, results[0]);
    });
};

// Create a new user
exports.createUser = (user, callback) => {
    const { name, email, password } = user;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return callback(err, null);
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [name, email, hash], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results);
        });
    });
};
