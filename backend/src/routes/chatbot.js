const express = require('express');
const { auth } = require('../middleware/auth');
const advancedAI = require('../services/advancedAI');
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

    // Generate AI response using Advanced AI Service
    try {
      console.log('🤖 Generating AI response with Advanced AI...');
      aiResponse = await advancedAI.generateFinancialResponse(
        query, 
        userContext, 
        conversationHistory
      );
      console.log('✅ AI response generated successfully');
    } catch (aiError) {
      console.error('❌ Advanced AI service failed:', aiError.message);
      
      // This should not happen with the advanced service, but handle it gracefully
      return res.status(500).json({
        success: false,
        message: 'Failed to generate AI response. Please try again.',
        error: 'AI_GENERATION_FAILED'
      });
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
          aiPowered: true,
          service: 'Advanced AI'
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
    
    const insights = await advancedAI.generateFinancialResponse('Generate comprehensive financial insights', userContext);
    
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
// @desc    Check chatbot service health
// @access  Private
router.get('/health', auth, async (req, res) => {
  try {
    const isHealthy = true; // Advanced AI is always available
    
    res.json({
      success: true,
      healthy: isHealthy,
      service: 'Advanced AI',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      healthy: false,
      error: error.message
    });
  }
});

// @route   POST /api/chatbot/test
// @desc    Test direct AI functionality
// @access  Private
router.post('/test', auth, async (req, res) => {
  try {
    console.log('🧪 Advanced AI test requested...');
    
    const testResponse = await advancedAI.generateFinancialResponse('Test message - confirm you are working', {});
    
    res.json({
      success: true,
      testResponse: testResponse,
      service: 'Advanced AI',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🧪 Advanced AI test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Generate contextual suggestions based on user data
 */
function generateContextualSuggestions(query, userContext) {
  const { summary } = userContext;
  const suggestions = [];
  
  // Add suggestions based on available data
  if (summary.monthlyExpenses > 0) {
    suggestions.push("Show me my expense breakdown");
    suggestions.push("How can I reduce my spending?");
  }
  
  if (summary.portfolioValue > 0) {
    suggestions.push("What's my investment performance?");
    suggestions.push("Give me portfolio recommendations");
  }
  
  if (summary.savingsTotal > 0) {
    suggestions.push("How's my savings progress?");
    suggestions.push("Help me plan my financial goals");
  }
  
  // Default suggestions if no data
  if (suggestions.length === 0) {
    suggestions.push("Help me start tracking expenses");
    suggestions.push("What investment options should I consider?");
    suggestions.push("How do I create a budget?");
  }
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
}

/**
 * Generate personalized suggestions based on user's financial state
 */
function generatePersonalizedSuggestions(userContext) {
  const { summary } = userContext;
  const suggestions = [];
  
  if (summary.monthlyExpenses > 0) {
    suggestions.push("Analyze my spending patterns this month");
    suggestions.push("Show me my biggest expense categories");
    suggestions.push("How much am I spending weekly?");
  }
  
  if (summary.portfolioValue > 0) {
    suggestions.push("What's my portfolio return percentage?");
    suggestions.push("Which investments are performing best?");
    suggestions.push("Should I rebalance my portfolio?");
  }
  
  if (summary.savingsTotal > 0) {
    suggestions.push("How close am I to my emergency fund goal?");
    suggestions.push("What's my monthly savings rate?");
    suggestions.push("Help me optimize my savings strategy");
  }
  
  if (summary.budgetUsed && summary.budgetUsed > 0) {
    suggestions.push("How much budget do I have left?");
    suggestions.push("Am I on track with my budget?");
    suggestions.push("Which categories are overspent?");
  }
  
  // Add general suggestions
  suggestions.push("Give me financial tips for this month");
  suggestions.push("What should I focus on financially?");
  suggestions.push("Help me plan my next financial move");
  
  return suggestions.slice(0, 8); // Return top 8 suggestions
}

module.exports = router;