const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/finance/dashboard
// @desc    Get finance dashboard data
// @access  Private
router.get('/dashboard', auth, (req, res) => {
  // Mock financial dashboard data
  const dashboardData = {
    portfolio: {
      totalValue: 247800,
      todayChange: 3420,
      todayPercentage: 1.4,
      stocks: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 50, price: 2485, change: 24.50, changePercent: 1.0 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 20, price: 3674, change: -18.25, changePercent: -0.5 },
        { symbol: 'INFY', name: 'Infosys Ltd', quantity: 30, price: 1456, change: 32.40, changePercent: 2.3 },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', quantity: 25, price: 1587, change: 12.80, changePercent: 0.8 }
      ]
    },
    savings: {
      totalSavings: 185000,
      monthlyGoal: 15000,
      achieved: 12000,
      goalProgress: 80
    },
    investments: {
      mutual_funds: 98000,
      stocks: 126000,
      fd: 45000,
      gold: 18500
    },
    expenses: {
      thisMonth: 18420,
      budget: 25000,
      budgetUsed: 74
    }
  };

  res.json({
    success: true,
    data: dashboardData
  });
});

// @route   GET /api/finance/ai-prediction
// @desc    Get AI expense prediction
// @access  Private
router.get('/ai-prediction', auth, (req, res) => {
  // Mock AI prediction data
  const prediction = {
    nextMonthExpected: 19200,
    confidence: 0.87,
    recommendations: [
      "Based on your spending pattern, you might exceed your food budget by ₹800 next month",
      "Consider reducing entertainment expenses by 15% to meet your savings goal",
      "Your transport costs are trending upward, maybe explore carpooling options"
    ],
    categoryPredictions: [
      { category: 'Food', predicted: 6800, current: 6500, trend: 'up' },
      { category: 'Transport', predicted: 4200, current: 4600, trend: 'down' },
      { category: 'Entertainment', predicted: 4100, current: 3700, trend: 'up' },
      { category: 'Shopping', predicted: 2600, current: 2800, trend: 'down' },
      { category: 'Others', predicted: 1500, current: 820, trend: 'up' }
    ]
  };

  res.json({
    success: true,
    prediction
  });
});

// @route   GET /api/finance/investment-insights
// @desc    Get investment insights
// @access  Private
router.get('/investment-insights', auth, (req, res) => {
  const insights = {
    recommendations: [
      {
        type: 'stock',
        symbol: 'ICICIBANK',
        name: 'ICICI Bank Ltd',
        currentPrice: 945,
        targetPrice: 1020,
        rating: 'BUY',
        reason: 'Strong Q3 results and good asset quality improvement'
      },
      {
        type: 'mutual_fund',
        name: 'SBI Bluechip Fund',
        category: 'Large Cap',
        rating: 'BUY',
        expectedReturn: '12-15%',
        reason: 'Consistent performance and low expense ratio'
      }
    ],
    marketSentiment: {
      nifty50: { value: 21737, change: 124.5, changePercent: 0.58 },
      sensex: { value: 72240, change: 340.2, changePercent: 0.47 },
      bankNifty: { value: 47125, change: -156.8, changePercent: -0.33 }
    }
  };

  res.json({
    success: true,
    insights
  });
});

module.exports = router;