const financialDataService = require('./financialDataService');

class SmartFinancialChatbot {
  constructor() {
    console.log('🤖 Initializing Smart Financial Chatbot...');
    this.initializeKnowledgeBase();
    console.log('✅ Smart Financial Chatbot initialized successfully');
  }

  initializeKnowledgeBase() {
    // Financial knowledge patterns and responses
    this.knowledgeBase = {
      // Intent patterns with keywords
      intents: {
        budget: {
          keywords: ['budget', 'budgeting', 'monthly budget', 'spending limit', 'budget planning'],
          patterns: /budget|spending limit|monthly allowance|expense control/i
        },
        savings: {
          keywords: ['save', 'saving', 'savings', 'emergency fund', 'saving tips'],
          patterns: /save|saving|emergency fund|savings account/i
        },
        investment: {
          keywords: ['invest', 'investment', 'portfolio', 'stocks', 'mutual fund', 'returns'],
          patterns: /invest|portfolio|stocks|mutual fund|returns|gains|losses/i
        },
        expenses: {
          keywords: ['expense', 'spending', 'costs', 'expenditure', 'money spent'],
          patterns: /expense|spending|cost|expenditure|money.*spent|where.*money/i
        },
        debt: {
          keywords: ['debt', 'loan', 'emi', 'credit', 'borrowing', 'repayment'],
          patterns: /debt|loan|emi|credit|borrow|repay|interest/i
        },
        tax: {
          keywords: ['tax', 'taxation', 'tax saving', 'deduction', 'tax planning'],
          patterns: /tax|taxation|deduction|tax.*sav|80c|tax.*plan/i
        },
        financial_tips: {
          keywords: ['tips', 'advice', 'help', 'guidance', 'suggestions', 'recommendations'],
          patterns: /tip|advice|help|guidance|suggest|recommend|what.*should/i
        },
        greeting: {
          keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
          patterns: /hello|hi|hey|good.*morning|good.*evening|greet/i
        }
      },

      // Response templates with dynamic content
      responses: {
        budget: {
          withData: [
            "Based on your spending data, I can see you've spent ₹{monthlyExpenses} this month. Here's my budget analysis:",
            "Looking at your expense pattern, your top spending category is {topCategory} with ₹{topAmount}. Let me help you optimize:",
            "Your current budget utilization is {budgetUsed}%. Here are personalized recommendations:"
          ],
          withoutData: [
            "I'd love to help you with budgeting! Here are some proven budgeting strategies:",
            "Great question about budgeting! Let me share some effective approaches:",
            "Budgeting is crucial for financial health. Here's how to get started:"
          ]
        },
        savings: {
          withData: [
            "I can see you have ₹{savingsTotal} in savings. Here's how to optimize your savings strategy:",
            "With your current saving pattern, here are ways to accelerate your savings:",
            "Based on your expense data, you could potentially save ₹{potentialSavings} more monthly:"
          ],
          withoutData: [
            "Saving money is a great goal! Here are proven strategies to build your savings:",
            "Let me share some effective saving techniques that work for most people:",
            "Building savings requires strategy. Here's how to start:"
          ]
        },
        investment: {
          withData: [
            "Your investment portfolio is worth ₹{portfolioValue} with {investmentGrowth}% returns. Here's my analysis:",
            "Looking at your {investmentCount} investments, here are optimization suggestions:",
            "Your current investment strategy shows {returns}. Let me provide insights:"
          ],
          withoutData: [
            "Investing is key to wealth building! Here's how to start your investment journey:",
            "Great that you're thinking about investments! Here are beginner-friendly options:",
            "Let me guide you through smart investment strategies:"
          ]
        },
        expenses: {
          withData: [
            "I've analyzed your expenses totaling ₹{totalExpenses}. Here's the breakdown and optimization tips:",
            "Your spending pattern shows ₹{monthlyExpenses} monthly. Top categories and suggestions:",
            "Based on your {expenseCount} transactions, here's my expense analysis:"
          ],
          withoutData: [
            "Managing expenses effectively is crucial! Here are proven expense management strategies:",
            "I'd be happy to help you track and optimize your expenses. Here's how:",
            "Smart expense management can significantly improve your finances:"
          ]
        }
      },

      // Financial tips database
      tips: {
        budget: [
          "Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
          "Track every expense for a month to understand your spending patterns",
          "Use the envelope method for discretionary spending categories",
          "Review and adjust your budget monthly based on actual spending",
          "Set up automatic transfers to savings before you can spend the money"
        ],
        savings: [
          "Start with an emergency fund of 6 months of expenses",
          "Automate your savings - save first, spend what's left",
          "Use high-yield savings accounts for better returns",
          "Try the 52-week savings challenge to build the habit",
          "Cut one unnecessary subscription and redirect that money to savings"
        ],
        investment: [
          "Start with SIP in diversified mutual funds for consistent investing",
          "Don't put all eggs in one basket - diversify across asset classes",
          "Stay invested for the long term to benefit from compounding",
          "Consider ELSS funds for tax saving under 80C",
          "Review your portfolio quarterly but don't make frequent changes"
        ],
        expenses: [
          "Use the 24-hour rule for non-essential purchases over ₹1000",
          "Compare prices before making any purchase above ₹500",
          "Cook at home more often - it can save ₹5000+ monthly",
          "Cancel unused subscriptions and memberships",
          "Use cash for discretionary spending to control impulse purchases"
        ],
        general: [
          "Set specific, measurable financial goals with deadlines",
          "Educate yourself about personal finance through books and courses",
          "Review your financial progress monthly",
          "Build good credit by paying bills on time",
          "Consider term insurance for financial protection"
        ]
      }
    };
  }

  /**
   * Process user query and generate intelligent response
   */
  async processQuery(query, userContext = {}, conversationHistory = []) {
    try {
      console.log('🧠 Processing financial query:', query.substring(0, 50) + '...');
      
      // Normalize query
      const normalizedQuery = query.toLowerCase().trim();
      
      // Detect intent
      const intent = this.detectIntent(normalizedQuery);
      console.log('🎯 Detected intent:', intent);
      
      // Generate personalized response
      const response = await this.generateResponse(intent, normalizedQuery, userContext);
      
      console.log('✅ Response generated successfully');
      return response;
      
    } catch (error) {
      console.error('❌ Error processing query:', error);
      return this.getErrorResponse();
    }
  }

  /**
   * Detect user intent from query
   */
  detectIntent(query) {
    const intents = this.knowledgeBase.intents;
    let maxScore = 0;
    let detectedIntent = 'financial_tips';
    
    for (const [intentName, intentData] of Object.entries(intents)) {
      let score = 0;
      
      // Check pattern match
      if (intentData.patterns.test(query)) {
        score += 3;
      }
      
      // Check keyword matches
      const keywordMatches = intentData.keywords.filter(keyword => 
        query.includes(keyword.toLowerCase())
      );
      score += keywordMatches.length;
      
      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intentName;
      }
    }
    
    return detectedIntent;
  }

  /**
   * Generate personalized response based on intent and user data
   */
  async generateResponse(intent, query, userContext) {
    const { user, expenses = [], investments = [], savings = [], summary = {} } = userContext;
    const hasFinancialData = expenses.length > 0 || investments.length > 0 || Object.keys(summary).length > 0;
    
    let response = '';
    
    // Personalized greeting
    if (intent === 'greeting') {
      const userName = user?.firstName ? `, ${user.firstName}` : '';
      response = `Hello${userName}! 👋 I'm your FinFluence AI assistant, ready to help you with all your financial questions. I can analyze your spending, provide investment insights, help with budgeting, and share personalized financial tips. What would you like to explore today?`;
      return response;
    }
    
    // Get base response template
    const responseTemplates = this.knowledgeBase.responses[intent];
    if (responseTemplates) {
      const templates = hasFinancialData ? responseTemplates.withData : responseTemplates.withoutData;
      const template = templates[Math.floor(Math.random() * templates.length)];
      response = this.populateTemplate(template, userContext);
    } else {
      response = "I'm here to help with your financial questions! ";
    }
    
    // Add specific insights based on intent and data
    response += await this.generateSpecificInsights(intent, userContext);
    
    // Add relevant tips
    response += this.getRelevantTips(intent);
    
    // Add follow-up suggestions
    response += this.getFollowUpSuggestions(intent, userContext);
    
    return response;
  }

  /**
   * Populate response template with user data
   */
  populateTemplate(template, userContext) {
    const { expenses = [], investments = [], summary = {} } = userContext;
    
    // Calculate dynamic values
    const monthlyExpenses = summary.monthlyExpenses || this.calculateMonthlyExpenses(expenses);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const portfolioValue = summary.portfolioValue || investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount), 0);
    const savingsTotal = summary.savingsTotal || 0;
    const investmentGrowth = summary.investmentGrowth || this.calculateInvestmentGrowth(investments);
    const budgetUsed = summary.budgetUsed || 0;
    
    // Get top expense category
    const topCategory = this.getTopExpenseCategory(expenses);
    const potentialSavings = Math.round(monthlyExpenses * 0.15); // Estimated 15% savings potential
    
    return template
      .replace('{monthlyExpenses}', monthlyExpenses.toLocaleString())
      .replace('{totalExpenses}', totalExpenses.toLocaleString())
      .replace('{portfolioValue}', portfolioValue.toLocaleString())
      .replace('{savingsTotal}', savingsTotal.toLocaleString())
      .replace('{investmentGrowth}', investmentGrowth.toFixed(1))
      .replace('{budgetUsed}', budgetUsed.toFixed(1))
      .replace('{topCategory}', topCategory.category)
      .replace('{topAmount}', topCategory.amount.toLocaleString())
      .replace('{expenseCount}', expenses.length)
      .replace('{investmentCount}', investments.length)
      .replace('{potentialSavings}', potentialSavings.toLocaleString())
      .replace('{returns}', investmentGrowth > 0 ? `positive returns of ${investmentGrowth.toFixed(1)}%` : 'some volatility');
  }

  /**
   * Generate specific insights based on intent and user data
   */
  async generateSpecificInsights(intent, userContext) {
    const { expenses = [], investments = [], summary = {} } = userContext;
    let insights = '\n\n';
    
    switch (intent) {
      case 'budget':
        if (expenses.length > 0) {
          insights += '📊 **Budget Analysis:**\n';
          const categoryBreakdown = this.getCategoryBreakdown(expenses);
          categoryBreakdown.slice(0, 3).forEach(cat => {
            insights += `• ${cat.category}: ₹${cat.amount.toLocaleString()} (${cat.percentage.toFixed(1)}%)\n`;
          });
          
          if (categoryBreakdown[0]?.percentage > 40) {
            insights += `\n⚠️ Your top category (${categoryBreakdown[0].category}) takes ${categoryBreakdown[0].percentage.toFixed(1)}% of your budget. Consider optimizing this area.\n`;
          }
        }
        break;
        
      case 'expenses':
        if (expenses.length > 0) {
          insights += '💳 **Expense Insights:**\n';
          const recentExpenses = expenses.slice(-5);
          insights += `• Recent transactions: ${recentExpenses.length}\n`;
          
          const avgDailySpend = expenses.reduce((sum, exp) => sum + exp.amount, 0) / 30;
          insights += `• Average daily spending: ₹${avgDailySpend.toFixed(0)}\n`;
          
          const highestExpense = Math.max(...expenses.map(e => e.amount));
          insights += `• Highest single expense: ₹${highestExpense.toLocaleString()}\n`;
        }
        break;
        
      case 'investment':
        if (investments.length > 0) {
          insights += '📈 **Investment Analysis:**\n';
          const totalInvested = investments.reduce((sum, inv) => sum + (inv.investedAmount || inv.amount), 0);
          const currentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount), 0);
          const returns = ((currentValue - totalInvested) / totalInvested) * 100;
          
          insights += `• Total invested: ₹${totalInvested.toLocaleString()}\n`;
          insights += `• Current value: ₹${currentValue.toLocaleString()}\n`;
          insights += `• Overall returns: ${returns > 0 ? '+' : ''}${returns.toFixed(2)}%\n`;
          
          if (returns < 8) {
            insights += '\n💡 Consider reviewing your investment strategy for better returns.\n';
          }
        }
        break;
        
      case 'savings':
        const monthlyExpenses = summary.monthlyExpenses || this.calculateMonthlyExpenses(expenses);
        const emergencyFundNeeded = monthlyExpenses * 6;
        const currentSavings = summary.savingsTotal || 0;
        
        insights += '💰 **Savings Strategy:**\n';
        insights += `• Emergency fund target: ₹${emergencyFundNeeded.toLocaleString()}\n`;
        insights += `• Current savings: ₹${currentSavings.toLocaleString()}\n`;
        
        if (currentSavings < emergencyFundNeeded) {
          const savingsGap = emergencyFundNeeded - currentSavings;
          insights += `• Gap to fill: ₹${savingsGap.toLocaleString()}\n`;
        } else {
          insights += '✅ Great! You have adequate emergency funds.\n';
        }
        break;
    }
    
    return insights;
  }

  /**
   * Get relevant tips based on intent
   */
  getRelevantTips(intent) {
    const tips = this.knowledgeBase.tips[intent] || this.knowledgeBase.tips.general;
    const selectedTips = tips.slice(0, 3); // Get top 3 tips
    
    let tipSection = '\n\n💡 **Quick Tips:**\n';
    selectedTips.forEach((tip, index) => {
      tipSection += `${index + 1}. ${tip}\n`;
    });
    
    return tipSection;
  }

  /**
   * Generate follow-up suggestions
   */
  getFollowUpSuggestions(intent, userContext) {
    const suggestions = [];
    
    switch (intent) {
      case 'budget':
        suggestions.push('Track your expenses', 'Set spending limits', 'Review monthly budget');
        break;
      case 'investment':
        suggestions.push('Portfolio analysis', 'Investment recommendations', 'Risk assessment');
        break;
      case 'savings':
        suggestions.push('Savings goals', 'Emergency fund planning', 'Savings optimization');
        break;
      case 'expenses':
        suggestions.push('Expense categorization', 'Spending patterns', 'Cost reduction tips');
        break;
      default:
        suggestions.push('Budget planning', 'Investment advice', 'Expense analysis');
    }
    
    let followUp = '\n\n🔍 **What else would you like to explore?**\n';
    suggestions.forEach(suggestion => {
      followUp += `• Ask me about "${suggestion}"\n`;
    });
    
    return followUp;
  }

  /**
   * Helper methods for calculations
   */
  calculateMonthlyExpenses(expenses) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    return expenses
      .filter(exp => new Date(exp.date) >= thirtyDaysAgo)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }

  calculateInvestmentGrowth(investments) {
    if (investments.length === 0) return 0;
    
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.investedAmount || inv.amount), 0);
    const currentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount), 0);
    
    return totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
  }

  getTopExpenseCategory(expenses) {
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];
    
    return topCategory ? { category: topCategory[0], amount: topCategory[1] } : { category: 'Miscellaneous', amount: 0 };
  }

  getCategoryBreakdown(expenses) {
    const categoryTotals = {};
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  getErrorResponse() {
    return "I apologize, but I'm having trouble processing your request right now. Please try asking about budgeting, investments, savings, or expense management, and I'll do my best to help you! 💪";
  }

  /**
   * Health check for the chatbot service
   */
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'Smart Financial Chatbot',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new SmartFinancialChatbot();