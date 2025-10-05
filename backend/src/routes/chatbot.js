const express = require('express');
const { auth } = require('../middleware/auth');
const groqService = require('../services/groqService');
const financialDataService = require('../services/financialDataService');

const router = express.Router();

// @route   POST /api/chatbot/query
// @desc    Process chatbot query and return AI response
// @access  Private
router.post('/query', auth, async (req, res) => {
  try {
    const { query, conversationHistory = [] } = req.body;
    const userId = req.user.id;
    
    console.log('💬 Chatbot Query Received:', {
      userId: userId,
      query: query?.substring(0, 100) + '...',
      historyLength: conversationHistory.length
    });
    
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // Get user's financial context
    console.log('📊 Fetching user financial context...');
    const userContext = await financialDataService.getUserFinancialContext(userId);
    console.log('✅ User context retrieved:', {
      hasUser: !!userContext.user,
      expensesCount: userContext.expenses?.length || 0,
      investmentsCount: userContext.investments?.length || 0
    });
    
    let aiResponse;
    let fallbackUsed = false;

    try {
      console.log('🤖 Attempting GROQ AI response...');
      // Try to get AI response from GROQ
      aiResponse = await groqService.generateFinancialResponse(
        query, 
        userContext, 
        conversationHistory
      );
      console.log('✅ GROQ AI response successful');
    } catch (groqError) {
      console.warn('❌ GROQ API failed, using fallback:', groqError.message);
      
      // Fallback to template-based response
      aiResponse = generateFallbackResponse(query, userContext);
      fallbackUsed = true;
      console.log('🔄 Using fallback response');
    }

    // Generate suggestions based on context
    const suggestions = generateContextualSuggestions(query, userContext);
    
    res.json({
      success: true,
      response: {
        content: aiResponse,
        suggestions,
        context: {
          hasData: !!userContext.user,
          fallbackUsed
        }
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
// @desc    Get personalized suggested queries for the user
// @access  Private
router.get('/suggestions', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userContext = await financialDataService.getUserFinancialContext(userId);
    
    const suggestions = generatePersonalizedSuggestions(userContext);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    
    // Fallback suggestions
    const defaultSuggestions = [
      "How much did I spend this month?",
      "What's my investment portfolio performance?",
      "Show me my savings progress",
      "Give me expense breakdown by category",
      "How can I reduce my spending?",
      "What are some investment tips?",
      "Help me plan my budget",
      "Show me my financial trends"
    ];
    
    res.json({
      success: true,
      suggestions: defaultSuggestions
    });
  }
});

// @route   POST /api/chatbot/insights
// @desc    Get AI-powered financial insights
// @access  Private
router.post('/insights', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userContext = await financialDataService.getUserFinancialContext(userId);
    
    const insights = await groqService.generateInsights(userContext);
    
    res.json({
      success: true,
      insights,
      context: userContext.summary
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate insights'
    });
  }
});

// @route   GET /api/chatbot/health
// @desc    Check GROQ service health
// @access  Private
router.get('/health', auth, async (req, res) => {
  try {
    console.log('🏥 Health check requested...');
    const isHealthy = await groqService.healthCheck();
    
    res.json({
      success: true,
      groqHealthy: isHealthy,
      apiKeyPresent: !!process.env.GROQ_API_KEY,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: true,
      groqHealthy: false,
      error: error.message,
      apiKeyPresent: !!process.env.GROQ_API_KEY,
      timestamp: new Date().toISOString()
    });
  }
});

// @route   POST /api/chatbot/test
// @desc    Test GROQ API directly
// @access  Private
router.post('/test', auth, async (req, res) => {
  try {
    console.log('🧪 Direct GROQ test requested...');
    
    const testResponse = await groqService.groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello and confirm you are working.' }
      ],
      model: 'llama3-8b-8192',
      max_tokens: 50
    });

    const content = testResponse.choices[0]?.message?.content || 'No response';
    
    res.json({
      success: true,
      testResponse: content,
      model: 'llama3-8b-8192',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🧪 Direct GROQ test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: {
        status: error.status,
        code: error.code,
        type: error.type
      },
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Generate fallback response when GROQ API fails
 */
function generateFallbackResponse(query, userContext) {
  const lowerQuery = query.toLowerCase();
  const { summary } = userContext;
  
  if (lowerQuery.includes('spend') || lowerQuery.includes('expense')) {
    return `Based on your recent activity, you've spent ₹${summary.monthlyExpenses?.toLocaleString() || 0} this month. Your top expense category is ${summary.topExpenseCategory?.category || 'Food'} with ₹${summary.topExpenseCategory?.amount?.toLocaleString() || 0}. Would you like me to help you analyze your spending patterns?`;
  }
  
  if (lowerQuery.includes('invest') || lowerQuery.includes('portfolio')) {
    return `Your investment portfolio is currently valued at ₹${summary.portfolioValue?.toLocaleString() || '0'} with a growth of ${summary.investmentGrowth?.toFixed(1) || '0'}%. Your investments are performing well! Would you like specific advice on rebalancing or new investment opportunities?`;
  }
  
  if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
    return `You have ₹${summary.savingsTotal?.toLocaleString() || '0'} in savings. You're doing great! I can help you optimize your savings strategy or set up new financial goals. What specific savings goal would you like to work on?`;
  }
  
  if (lowerQuery.includes('budget')) {
    return `You've used ${summary.budgetUsed?.toFixed(1) || '0'}% of your monthly budget. ${summary.budgetUsed > 80 ? 'You might want to watch your spending for the rest of the month.' : 'You\'re doing well with your budget!'} Would you like tips on budget optimization?`;
  }
  
  return `I'm here to help you with your finances! You've spent ₹${summary.monthlyExpenses?.toLocaleString() || '0'} this month and have ₹${summary.portfolioValue?.toLocaleString() || '0'} in investments. What specific financial question can I help you with?`;
}

/**
 * Generate contextual suggestions based on user data
 */
function generateContextualSuggestions(query, userContext) {
  const { summary } = userContext;
  const suggestions = [];
  
  // Budget-related suggestions
  if (summary.budgetUsed > 80) {
    suggestions.push("How can I reduce my spending this month?");
    suggestions.push("Show me my biggest expenses");
  } else {
    suggestions.push("How much budget do I have left?");
  }
  
  // Investment suggestions
  if (summary.portfolioValue > 0) {
    suggestions.push("How is my portfolio performing?");
    suggestions.push("Should I rebalance my investments?");
  } else {
    suggestions.push("How should I start investing?");
    suggestions.push("What are good investment options for beginners?");
  }
  
  // Savings suggestions
  if (summary.savingsTotal > 0) {
    suggestions.push("How can I increase my savings rate?");
    suggestions.push("Show me my savings progress");
  } else {
    suggestions.push("Help me start a savings plan");
  }
  
  // Expense analysis
  suggestions.push(`Analyze my ${summary.topExpenseCategory?.category?.toLowerCase() || 'food'} expenses`);
  suggestions.push("Compare this month with last month");
  
  return suggestions.slice(0, 6); // Return top 6 suggestions
}

/**
 * Generate personalized suggestions based on user context
 */
function generatePersonalizedSuggestions(userContext) {
  const suggestions = [];
  const { summary, expenses, savings, budget } = userContext;
  
  // Expense-based suggestions
  if (summary.monthlyExpenses > 0) {
    suggestions.push(`I spent ₹${summary.monthlyExpenses.toLocaleString()} this month - is that good?`);
    suggestions.push(`Help me reduce my ${summary.topExpenseCategory?.category?.toLowerCase() || 'food'} expenses`);
  }
  
  // Investment suggestions
  if (summary.portfolioValue > 0) {
    suggestions.push("How is my investment portfolio doing?");
    suggestions.push("Should I invest more this month?");
  } else {
    suggestions.push("I want to start investing - where should I begin?");
  }
  
  // Budget suggestions
  if (budget && summary.budgetUsed) {
    if (summary.budgetUsed > 90) {
      suggestions.push("I'm over budget! What should I do?");
    } else {
      suggestions.push("How much budget do I have left?");
    }
  }
  
  // Savings suggestions
  if (savings) {
    suggestions.push("How can I save more money?");
    suggestions.push("Show me my savings goals progress");
  }
  
  // General financial health
  suggestions.push("Give me a financial health checkup");
  suggestions.push("What should I focus on this month?");
  suggestions.push("Help me plan for next month");
  
  return suggestions.slice(0, 8);
}

// Legacy function - keeping for backward compatibility
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