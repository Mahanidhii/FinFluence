const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/expenses
// @desc    Get user expenses
// @access  Private
router.get('/', auth, (req, res) => {
  // Mock expense data
  const expenses = {
    thisMonth: 18420,
    lastMonth: 16200,
    categories: [
      { name: 'Food', amount: 6500, percentage: 35 },
      { name: 'Transport', amount: 4600, percentage: 25 },
      { name: 'Entertainment', amount: 3700, percentage: 20 },
      { name: 'Shopping', name: 2800, percentage: 15 },
      { name: 'Others', amount: 820, percentage: 5 }
    ],
    monthlyTrend: [
      { month: 'Jan', amount: 2400 },
      { month: 'Feb', amount: 1398 },
      { month: 'Mar', amount: 9800 },
      { month: 'Apr', amount: 3908 },
      { month: 'May', amount: 4800 },
      { month: 'Jun', amount: 3800 },
    ]
  };

  res.json({
    success: true,
    expenses
  });
});

// @route   POST /api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Add expense endpoint - to be implemented'
  });
});

module.exports = router;