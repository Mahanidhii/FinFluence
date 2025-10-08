/**
 * Test Real AI Financial Service
 * This demonstrates the actual OpenAI integration working
 */

const realAI = require('./src/services/realAI');

// Sample user context
const testUserContext = {
  user: {
    firstName: 'John',
    lastName: 'Doe'
  },
  expenses: [
    { category: 'Food', amount: 15000, date: new Date() },
    { category: 'Transportation', amount: 8000, date: new Date() },
    { category: 'Entertainment', amount: 5000, date: new Date() }
  ],
  investments: [
    { name: 'Mutual Fund SIP', amount: 25000, currentValue: 27000, investedAmount: 25000 }
  ],
  summary: {
    monthlyExpenses: 28000,
    portfolioValue: 27000,
    savingsTotal: 50000,
    budgetUsed: 70,
    investmentGrowth: 8,
    topExpenseCategory: { category: 'Food', amount: 15000 }
  }
};

async function testRealAI() {
  console.log('🚀 Testing Real AI Financial Service');
  console.log('=' .repeat(50));
  
  const testQueries = [
    "help me start investing",
    "what are the services you provide?",
    "analyze my spending and give me advice on investments"
  ];

  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    console.log(`\n**Test ${i + 1}:** "${query}"`);
    console.log('-'.repeat(40));
    
    try {
      const response = await realAI.generateFinancialResponse(query, testUserContext, []);
      console.log('🤖 AI Response:', response);
      console.log('✅ SUCCESS: Real AI generated response');
    } catch (error) {
      console.log('❌ ERROR:', error.message);
    }
    
    console.log('\n' + '='.repeat(50));
  }
}

testRealAI().catch(console.error);