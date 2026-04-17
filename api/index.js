const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Expense = require('../models/Expense'); // Pulls in the schema you just made

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// GET all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// POST a new expense
app.post('/api/expenses', async (req, res) => {
    try {
        const { text, amount } = req.body;
        const expense = await Expense.create({ text, amount });
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        } else {
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
});

// Local testing fallback
if (process.env.NODE_ENV !== 'production') {
    app.listen(5000, () => console.log('🚀 API running on port 5000'));
}

module.exports = app;