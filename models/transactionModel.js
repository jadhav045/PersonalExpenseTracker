const db = require('./db');

// Create a new transaction
exports.createTransaction = (transaction, callback) => {
    const { userId, type, amount, category, description } = transaction;
    const sql = 'INSERT INTO transactions (user_id, type, amount, category, description) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, type, amount, category, description], (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
    });
};

// Find transactions by user ID and type Income && Expense
exports.findByUserId = (userId, callback) => {
    const sql = 'SELECT * FROM transactions WHERE user_id = ? AND type IN (?, ?)';
    db.query(sql, [userId, 'Income', 'Expense'], (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
    });
};

// Delete a transaction by ID
exports.deleteById = (id, callback) => {
    const sql = 'DELETE FROM transactions WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
    });
};
