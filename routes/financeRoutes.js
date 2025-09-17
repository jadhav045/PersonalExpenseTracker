const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactionModel');
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Transaction.findByUserId(req.user.id, (err, transactions) => {
        if (err) console.error(err);
        res.render('dashboard', { user: req.user, transactions });
    });
});


// Add Transaction Page
router.get('/add', ensureAuthenticated, (req, res) => {
    // Example list of categories
    const categories = [
        'Food', 'Entertainment', 'Transport', 'Utilities', 'Rent', 'Healthcare', 
        'Education', 'Salary', 'Gift', 'Investment', 'Travel', 'Other'
    ];
    
    res.render('addTransaction', {
        user: req.user,        // Pass the current user
        categories: categories // Pass categories for the dropdown
    });
});




// Add Transaction
router.post('/add', ensureAuthenticated, (req, res) => {
    const { type, amount, category, description } = req.body;
    const newTransaction = { userId: req.user.id, type, amount, category, description };
    Transaction.createTransaction(newTransaction, (err) => {
        if (err) console.log(err);
        req.flash('success_msg', 'Transaction added');
        return res.redirect('/finance/dashboard');  
    });
});
// Receipt Page
router.get('/receipt', ensureAuthenticated, (req, res) => {
    Transaction.findByUserId(req.user.id, (err, transactions) => {
        if (err) {
            console.error('Error retrieving transactions:', err);
            return res.status(500).send('Server Error');
        }

        // Debugging: Print all transactions
        // console.log('All Transactions:', transactions);

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            // Debugging: Print each transaction
            // console.log('Processing transaction:', transaction);

            if (transaction.type === 'income') {
                totalIncome += parseFloat(transaction.amount);
                // console.log('Total Income:', totalIncome);
            } else if (transaction.type === 'expense') {
                totalExpense += parseFloat(transaction.amount);
                // console.log('Total Expense:', totalExpense);
            }
        });
        

        const balance = totalIncome - totalExpense;
        if (balance < 0) {
            req.flash('warning_msg', 'Your account balance is negative. Consider reducing your expenses.');
        }

        res.render('receipt', {
            user: req.user,
            totalIncome,
            totalExpense,
            balance
        });
    });
});




// Delete Transaction
router.post('/delete/:id', ensureAuthenticated, (req, res) => {
    Transaction.deleteById(req.params.id, (err) => {
        if (err) {
            console.error(err);
            req.flash('error_msg', 'An error occurred while deleting the transaction.');
            return res.redirect('/finance/dashboard');
        }
        req.flash('success_msg', 'Transaction deleted');
        res.redirect('/finance/dashboard');
    });
});

module.exports = router;
