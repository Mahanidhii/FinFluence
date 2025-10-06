/**
 * Test script to demonstrate the intelligent chatbot functionality
 * This shows how the chatbot provides real financial insights
 */

// Sample user context with real financial data
const sampleUserContext = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
    profile: { occupation: 'Software Engineer' }
  },
  expenses: [
    { category: 'Food', amount: 15000, date: new Date('2024-10-01') },
    { category: 'Transportation', amount: 8000, date: new Date('2024-10-02') },
    { category: 'Entertainment', amount: 5000, date: new Date('2024-10-03') },
    { category: 'Food', amount: 3000, date: new Date('2024-10-04') },
    { category: 'Shopping', amount: 12000, date: new Date('2024-10-05') },
    { category: 'Utilities', amount: 6000, date: new Date('2024-10-06') },
    { category: 'Food', amount: 2500, date: new Date('2024-10-07') }
  ],
  investments: [
    { name: 'SIP - Large Cap Fund', amount: 50000, currentValue: 55000, investedAmount: 50000 },
    { name: 'Direct Equity - TCS', amount: 30000, currentValue: 32500, investedAmount: 30000 },
    { name: 'PPF', amount: 25000, currentValue: 26000, investedAmount: 25000 }
  ],
  savings: {
    total: 75000,
    emergencyFund: 45000,
    fixedDeposit: 30000
  },
  budget: {
    total: 60000,
    used: 51500,
    categories: {
      'Food': { limit: 20000, used: 20500 },
      'Transportation': { limit: 10000, used: 8000 },
      'Entertainment': { limit: 8000, used: 5000 }
    }
  },
  summary: {
    monthlyExpenses: 51500,
    portfolioValue: 113500,
    savingsTotal: 75000,
    budgetUsed: 85.8,
    investmentGrowth: 7.5,
    topExpenseCategory: { category: 'Food', amount: 20500 }
  }
};

// Test queries and expected intelligent responses
const testQueries = [
  "Show me my spending by category",
  "How are my investments performing?",
  "What's my savings progress?",
  "Am I staying within my budget?",
  "Give me my weekly spending breakdown",
  "What's my portfolio return?",
  "How much did I spend this month?",
  "Help me with my emergency fund goal"
];

// Import the response generation functions (simulated)
function generateIntelligentFallbackResponse(query, userContext) {
  const lowerQuery = query.toLowerCase();
  const { summary, expenses, investments, savings, budget, user } = userContext;
  
  // Expense Analysis Queries
  if (lowerQuery.includes('spend') || lowerQuery.includes('expense') || lowerQuery.includes('category')) {
    return generateExpenseAnalysis(expenses, summary, lowerQuery);
  }
  
  // Investment Analysis Queries
  if (lowerQuery.includes('invest') || lowerQuery.includes('portfolio') || lowerQuery.includes('return')) {
    return generateInvestmentAnalysis(investments, summary, lowerQuery);
  }
  
  // Savings Analysis Queries
  if (lowerQuery.includes('save') || lowerQuery.includes('saving') || lowerQuery.includes('goal')) {
    return generateSavingsAnalysis(savings, summary, lowerQuery);
  }
  
  // Budget Analysis Queries
  if (lowerQuery.includes('budget') || lowerQuery.includes('limit') || lowerQuery.includes('plan')) {
    return generateBudgetAnalysis(budget, summary, lowerQuery);
  }
  
  // General Financial Overview
  return generateFinancialOverview(summary, user);
}

function generateExpenseAnalysis(expenses, summary, query) {
  let response = `📊 **Your Expense Analysis:**\n\n`;
  response += `💰 **This Month:** ₹${summary.monthlyExpenses?.toLocaleString() || 0}\n`;
  
  if (summary.topExpenseCategory) {
    response += `🔝 **Top Category:** ${summary.topExpenseCategory.category} (₹${summary.topExpenseCategory.amount?.toLocaleString()})\n`;
  }
  
  if (query.includes('category')) {
    const categories = {};
    expenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });
    
    response += `\n📈 **Category Breakdown:**\n`;
    Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([category, amount]) => {
        response += `• ${category}: ₹${amount.toLocaleString()}\n`;
      });
  }
  
  if (query.includes('week') || query.includes('month')) {
    const weeklyAvg = Math.round(summary.monthlyExpenses / 4);
    response += `\n📅 **Weekly Average:** ₹${weeklyAvg.toLocaleString()}\n`;
    response += `📊 **Daily Average:** ₹${Math.round(summary.monthlyExpenses / 30).toLocaleString()}\n`;
  }
  
  response += `\n💡 **Quick Tip:** Your biggest expense is ${summary.topExpenseCategory?.category || 'miscellaneous'}. Consider setting a specific budget for this category!`;
  
  return response;
}

function generateInvestmentAnalysis(investments, summary, query) {
  let response = `📈 **Your Investment Portfolio:**\n\n`;
  response += `💎 **Total Value:** ₹${summary.portfolioValue?.toLocaleString() || 0}\n`;
  
  if (summary.investmentGrowth !== undefined) {
    const growthIcon = summary.investmentGrowth >= 0 ? '📈' : '📉';
    response += `${growthIcon} **Returns:** ${summary.investmentGrowth > 0 ? '+' : ''}${summary.investmentGrowth.toFixed(2)}%\n`;
  }
  
  if (query.includes('performance') || query.includes('return')) {
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.investedAmount || inv.amount), 0);
    const currentValue = investments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount), 0);
    const returns = currentValue - totalInvested;
    const returnPercentage = totalInvested > 0 ? (returns / totalInvested) * 100 : 0;
    
    response += `\n💰 **Invested:** ₹${totalInvested.toLocaleString()}\n`;
    response += `💵 **Current Value:** ₹${currentValue.toLocaleString()}\n`;
    response += `${returns >= 0 ? '🟢' : '🔴'} **P&L:** ${returns >= 0 ? '+' : ''}₹${returns.toLocaleString()} (${returnPercentage.toFixed(2)}%)\n`;
  }
  
  response += `\n🎯 **Portfolio Health:** ${investments.length} investments tracked. `;
  response += summary.investmentGrowth >= 5 ? "Excellent performance! 🎉" : "Consider diversifying for better returns.";
  
  return response;
}

function generateSavingsAnalysis(savings, summary, query) {
  let response = `💰 **Your Savings Overview:**\n\n`;
  response += `🏦 **Total Savings:** ₹${summary.savingsTotal?.toLocaleString() || 0}\n`;
  
  if (query.includes('goal')) {
    const monthlyExpenses = summary.monthlyExpenses || 50000;
    const emergencyFund = monthlyExpenses * 6;
    const emergencyProgress = Math.min(100, (summary.savingsTotal / emergencyFund) * 100);
    
    response += `\n🎯 **Emergency Fund Goal:**\n`;
    response += `• Target: ₹${emergencyFund.toLocaleString()} (6 months expenses)\n`;
    response += `• Progress: ${emergencyProgress.toFixed(1)}% completed\n`;
    response += `• Remaining: ₹${Math.max(0, emergencyFund - summary.savingsTotal).toLocaleString()}\n`;
  }
  
  return response;
}

function generateBudgetAnalysis(budget, summary, query) {
  let response = `📋 **Your Budget Analysis:**\n\n`;
  response += `💳 **Budget Used:** ${summary.budgetUsed.toFixed(1)}%\n`;
  
  const budgetStatus = summary.budgetUsed > 90 ? '🔴 Over Budget!' : 
                     summary.budgetUsed > 75 ? '🟡 Close to Limit' : '🟢 On Track';
  response += `📊 **Status:** ${budgetStatus}\n`;
  
  if (summary.budgetUsed > 80) {
    const remaining = Math.max(0, 100 - summary.budgetUsed);
    response += `\n⚠️ **Warning:** Only ${remaining.toFixed(1)}% budget remaining this month!\n`;
    response += `💡 **Suggestion:** Focus on essential expenses and avoid discretionary spending.`;
  } else {
    response += `\n✅ **Good Job:** You're managing your budget well! Keep tracking expenses.`;
  }
  
  return response;
}

function generateFinancialOverview(summary, user) {
  let response = `👋 **Hi ${user?.firstName || 'there'}! Here's your financial snapshot:**\n\n`;
  
  response += `📊 **Monthly Expenses:** ₹${summary.monthlyExpenses?.toLocaleString() || 0}\n`;
  response += `📈 **Investments:** ₹${summary.portfolioValue?.toLocaleString() || 0}\n`;
  response += `💰 **Savings:** ₹${summary.savingsTotal?.toLocaleString() || 0}\n`;
  
  if (summary.budgetUsed) {
    response += `📋 **Budget Used:** ${summary.budgetUsed.toFixed(1)}%\n`;
  }
  
  response += `\n🎯 **I can help you with:**\n`;
  response += `• Expense tracking by category, week, or month\n`;
  response += `• Investment portfolio performance analysis\n`;
  response += `• Savings goal planning and progress tracking\n`;
  response += `• Budget monitoring and optimization\n`;
  response += `\n💬 **Ask me:** "Show my expense breakdown" or "How are my investments performing?"`;
  
  return response;
}

// Test the chatbot responses
console.log('🤖 **CRCE Finance Chatbot - Intelligent Response Demo**\n');
console.log('='.repeat(60));

testQueries.forEach((query, index) => {
  console.log(`\n**Query ${index + 1}:** "${query}"`);
  console.log('-'.repeat(50));
  const response = generateIntelligentFallbackResponse(query, sampleUserContext);
  console.log(response);
  console.log('\n');
});

console.log('🎉 **Demo Complete!** The chatbot now provides intelligent, data-driven responses!');