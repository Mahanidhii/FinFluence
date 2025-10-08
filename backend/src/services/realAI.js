/**
 * Real AI Financial Assistant Service
 * Uses OpenAI GPT models to provide genuine financial advice
 * No fallbacks, no templates - just real AI responses
 */

const OpenAI = require('openai');

class RealAIFinancialService {
  constructor() {
    console.log('🤖 Initializing Real AI Financial Service...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    console.log('✅ Real AI Service initialized with OpenAI API');
  }

  /**
   * Generate real AI financial advice
   */
  async generateFinancialResponse(query, userContext = {}, conversationHistory = []) {
    try {
      console.log('🧠 Generating real AI response for:', query.substring(0, 50) + '...');
      
      // Build comprehensive system prompt
      const systemPrompt = this.buildFinancialAdvisorPrompt(userContext);
      
      // Build conversation messages
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: query }
      ];

      console.log('📤 Sending request to OpenAI API...');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 600,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const aiResponse = response.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response generated from AI');
      }

      console.log('✅ Real AI response generated successfully');
      return aiResponse;

    } catch (error) {
      console.error('❌ OpenAI API Error:', error.message);
      
      if (error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your billing.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Invalid OpenAI API key.');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }

  /**
   * Build comprehensive financial advisor system prompt
   */
  buildFinancialAdvisorPrompt(userContext) {
    const { user, expenses, investments, savings, budget, summary } = userContext;
    
    let prompt = `You are FinFluence AI, an expert financial advisor and personal finance assistant. You provide practical, actionable financial advice tailored to each user's specific situation.

PERSONALITY & TONE:
- Professional yet approachable and friendly
- Use emojis sparingly but effectively
- Give specific, actionable advice
- Be encouraging and supportive
- Ask follow-up questions to provide better help

CORE EXPERTISE:
- Personal budgeting and expense management
- Investment strategies and portfolio optimization
- Savings planning and emergency funds
- Debt management and financial planning
- Indian financial context (₹ currency, tax implications, investment options)

USER PROFILE:`;

    if (user) {
      prompt += `\n- Name: ${user.firstName} ${user.lastName || ''}`;
      if (user.profile?.occupation) {
        prompt += `\n- Occupation: ${user.profile.occupation}`;
      }
    }

    if (summary) {
      prompt += `\n\nCURRENT FINANCIAL SNAPSHOT:`;
      if (summary.monthlyExpenses > 0) {
        prompt += `\n- Monthly Expenses: ₹${summary.monthlyExpenses.toLocaleString()}`;
      }
      if (summary.portfolioValue > 0) {
        prompt += `\n- Investment Portfolio: ₹${summary.portfolioValue.toLocaleString()}`;
        if (summary.investmentGrowth !== undefined) {
          prompt += ` (${summary.investmentGrowth > 0 ? '+' : ''}${summary.investmentGrowth.toFixed(1)}% returns)`;
        }
      }
      if (summary.savingsTotal > 0) {
        prompt += `\n- Total Savings: ₹${summary.savingsTotal.toLocaleString()}`;
      }
      if (summary.budgetUsed) {
        prompt += `\n- Budget Utilization: ${summary.budgetUsed.toFixed(1)}%`;
      }
      if (summary.topExpenseCategory) {
        prompt += `\n- Top Expense Category: ${summary.topExpenseCategory.category} (₹${summary.topExpenseCategory.amount.toLocaleString()})`;
      }
    }

    if (expenses && expenses.length > 0) {
      prompt += `\n\nRECENT EXPENSES:`;
      const categoryTotals = {};
      expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      });
      
      const topCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      topCategories.forEach(([category, amount]) => {
        prompt += `\n- ${category}: ₹${amount.toLocaleString()}`;
      });
    }

    if (investments && investments.length > 0) {
      prompt += `\n\nINVESTMENT PORTFOLIO:`;
      investments.forEach(inv => {
        const returns = (inv.currentValue || inv.amount) - (inv.investedAmount || inv.amount);
        const returnPct = (inv.investedAmount || inv.amount) > 0 ? 
          (returns / (inv.investedAmount || inv.amount)) * 100 : 0;
        prompt += `\n- ${inv.name}: ₹${(inv.currentValue || inv.amount).toLocaleString()} (${returnPct > 0 ? '+' : ''}${returnPct.toFixed(1)}%)`;
      });
    }

    prompt += `\n\nINSTRUCTIONS:
- Analyze the user's question in context of their financial data
- Provide specific, actionable advice
- Use actual numbers from their financial data when relevant
- Suggest concrete next steps
- Ask clarifying questions if needed
- Focus on practical solutions
- Consider Indian financial instruments and tax implications
- Be encouraging about their financial journey

Remember: You are helping real people make better financial decisions. Be thorough, accurate, and genuinely helpful.`;

    return prompt;
  }

  /**
   * Health check for the AI service
   */
  async healthCheck() {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello, are you working?' }
        ],
        max_tokens: 10
      });
      
      return !!response.choices[0]?.message?.content;
    } catch (error) {
      console.error('AI Health check failed:', error.message);
      return false;
    }
  }

  /**
   * Generate financial insights
   */
  async generateInsights(userContext) {
    const insightsQuery = `Based on my financial data, provide 3 key insights and actionable recommendations for improving my financial health. Focus on specific areas where I can optimize my spending, increase savings, or improve investments.`;
    
    return await this.generateFinancialResponse(insightsQuery, userContext, []);
  }
}

module.exports = new RealAIFinancialService();