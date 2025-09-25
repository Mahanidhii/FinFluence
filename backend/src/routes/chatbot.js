const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chatbot/query
// @desc    Process chatbot query and return response
// @access  Private
router.post('/query', auth, (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // Generate response based on query
    const response = generateFinancialResponse(query);
    
    res.json({
      success: true,
      response: {
        content: response.content,
        data: response.data,
        suggestions: response.suggestions
      }
    });

  } catch (error) {
    console.error('Chatbot query error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process query'
    });
  }
});

// @route   GET /api/chatbot/suggestions
// @desc    Get suggested queries for the user
// @access  Private
router.get('/suggestions', auth, (req, res) => {
  const suggestions = [
    "How much did I spend on food this week?",
    "What's my investment portfolio performance?",
    "How much did I invest in ETFs this month?",
    "Show me my savings goal progress",
    "What are my biggest expenses?",
    "How much money is in my round-up savings?",
    "What's my current budget status?",
    "Show me my expense breakdown by category"
  ];

  res.json({
    success: true,
    suggestions
  });
});

// Generate financial response based on query
const generateFinancialResponse = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Food and dining queries
  if (lowerQuery.includes('food') || lowerQuery.includes('dining') || lowerQuery.includes('restaurant')) {
    if (lowerQuery.includes('week')) {
      return {
        content: "This week you spent ₹1,250 on food. Breakdown: Zomato ₹450, Groceries ₹600, Cafe visits ₹200. This is 15% higher than last week.",
        data: {
          total: 1250,
          breakdown: [
            { category: 'Zomato', amount: 450 },
            { category: 'Groceries', amount: 600 },
            { category: 'Cafe visits', amount: 200 }
          ],
          comparison: { lastWeek: 1087, change: 15 }
        },
        suggestions: ["Show me monthly food expenses", "Compare with last month", "Set food budget reminder"]
      };
    } else if (lowerQuery.includes('month')) {
      return {
        content: "This month your food expenses are ₹6,500 (35% of total expenses). Top categories: Groceries ₹3,200, Dining out ₹2,100, Cafes ₹1,200.",
        data: {
          total: 6500,
          percentage: 35,
          breakdown: [
            { category: 'Groceries', amount: 3200 },
            { category: 'Dining out', amount: 2100 },
            { category: 'Cafes', amount: 1200 }
          ]
        },
        suggestions: ["Set food budget", "Compare with previous months", "Get food saving tips"]
      };
    }
  }
  
  // Investment queries
  if (lowerQuery.includes('invest') || lowerQuery.includes('stock') || lowerQuery.includes('mutual fund')) {
    if (lowerQuery.includes('gold') || lowerQuery.includes('etf')) {
      return {
        content: "Your ETF investments this month: Gold ETFs ₹8,500, Other ETFs ₹12,000. Total ETF portfolio value: ₹85,600 (+5.2% this month).",
        data: {
          monthlyInvestment: {
            goldETFs: 8500,
            otherETFs: 12000
          },
          portfolioValue: 85600,
          monthlyGain: 5.2
        },
        suggestions: ["Show portfolio performance", "Compare ETF returns", "Get investment recommendations"]
      };
    } else if (lowerQuery.includes('month')) {
      return {
        content: "This month you invested ₹20,500 across: Stocks ₹12,000, Mutual Funds ₹6,000, ETFs ₹2,500. Portfolio gain: +3.8%.",
        data: {
          totalInvestment: 20500,
          breakdown: [
            { type: 'Stocks', amount: 12000 },
            { type: 'Mutual Funds', amount: 6000 },
            { type: 'ETFs', amount: 2500 }
          ],
          portfolioGain: 3.8
        },
        suggestions: ["Analyze portfolio performance", "Get rebalancing advice", "Set investment goals"]
      };
    }
    return {
      content: "Your total investment portfolio: ₹85,600. Top performers: Reliance (+2.4%), HDFC Bank (+1.8%), Infosys (+2.3%).",
      data: {
        portfolioValue: 85600,
        topPerformers: [
          { name: 'Reliance', change: 2.4 },
          { name: 'HDFC Bank', change: 1.8 },
          { name: 'Infosys', change: 2.3 }
        ]
      },
      suggestions: ["View detailed portfolio", "Get investment insights", "Compare with benchmarks"]
    };
  }
  
  // Savings queries
  if (lowerQuery.includes('savings') || lowerQuery.includes('save')) {
    if (lowerQuery.includes('round') || lowerQuery.includes('roundup')) {
      return {
        content: "Your round-up savings have accumulated ₹2,340 this month from 156 transactions. Average round-up: ₹15 per transaction.",
        data: {
          roundUpTotal: 2340,
          transactions: 156,
          averageRoundUp: 15
        },
        suggestions: ["View round-up history", "Adjust round-up settings", "Transfer to savings goal"]
      };
    }
    return {
      content: "Total savings: ₹1,24,500 (+12% from last month). You're on a 15-day savings streak! Goal progress: 80% complete.",
      data: {
        totalSavings: 124500,
        monthlyGrowth: 12,
        streak: 15,
        goalProgress: 80
      },
      suggestions: ["View savings goals", "Increase savings rate", "Track spending patterns"]
    };
  }
  
  // Expense queries
  if (lowerQuery.includes('expense') || lowerQuery.includes('spend') || lowerQuery.includes('spent')) {
    if (lowerQuery.includes('transport') || lowerQuery.includes('travel')) {
      return {
        content: "Transport expenses this month: ₹4,600. Breakdown: Fuel ₹2,800, Public transport ₹1,200, Cab rides ₹600.",
        data: {
          total: 4600,
          breakdown: [
            { category: 'Fuel', amount: 2800 },
            { category: 'Public transport', amount: 1200 },
            { category: 'Cab rides', amount: 600 }
          ]
        },
        suggestions: ["Optimize transport costs", "Try carpooling", "Set transport budget"]
      };
    }
    return {
      content: "Total expenses this month: ₹18,420. Food (35%), Transport (25%), Entertainment (20%), Shopping (15%), Others (5%).",
      data: {
        total: 18420,
        breakdown: [
          { category: 'Food', amount: 6447, percentage: 35 },
          { category: 'Transport', amount: 4605, percentage: 25 },
          { category: 'Entertainment', amount: 3684, percentage: 20 },
          { category: 'Shopping', amount: 2763, percentage: 15 },
          { category: 'Others', amount: 921, percentage: 5 }
        ]
      },
      suggestions: ["Set category budgets", "Find cost-cutting opportunities", "Compare with previous months"]
    };
  }
  
  // Budget queries
  if (lowerQuery.includes('budget') || lowerQuery.includes('limit')) {
    return {
      content: "Monthly budget: ₹25,000. Current spending: ₹18,420 (74% used). You have ₹6,580 remaining for this month.",
      data: {
        budget: 25000,
        spent: 18420,
        remaining: 6580,
        percentageUsed: 74
      },
      suggestions: ["Adjust budget categories", "Set spending alerts", "Plan remaining budget"]
    };
  }
  
  // Default response
  return {
    content: "I can help you with expenses, investments, savings, budgets, and financial goals. What specific information do you need?",
    data: {},
    suggestions: [
      "How much did I spend this month?",
      "Show my investment portfolio",
      "What's my savings progress?",
      "Compare expenses with last month"
    ]
  };
};

module.exports = router;