/**
 * GROQ AI Service for Financial Chatbot
 * Provides intelligent, context-aware responses for financial queries
 */

const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    // Debug: Check if API key is loaded
    console.log('🤖 Initializing GROQ Service...');
    console.log('🔑 API Key present:', !!process.env.GROQ_API_KEY);
    console.log('🔑 API Key length:', process.env.GROQ_API_KEY?.length || 0);
    
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY is missing from environment variables!');
    }
    
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    this.model = 'llama-3.1-8b-instant'; // Updated model name
    
    // Test available models
    this.testConnection();
    
    console.log('✅ GROQ Service initialized successfully');
  }

  /**
   * Generate AI response for financial queries
   * @param {string} query - User's financial question
   * @param {Object} userContext - User's financial data context
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {Promise<string>} AI-generated response
   */
  async generateFinancialResponse(query, userContext = {}, conversationHistory = []) {
    try {
      console.log('🤖 Generating AI response for query:', query.substring(0, 50) + '...');
      
      // Build system prompt for financial assistant
      const systemPrompt = this.buildSystemPrompt(userContext);
      
      // Build conversation messages
      const messages = this.buildMessages(systemPrompt, query, conversationHistory);

      console.log('📤 Sending request to GROQ API...');
      console.log('📝 Messages count:', messages.length);
      console.log('🎯 Model:', this.model);

      const response = await this.groq.chat.completions.create({
        messages,
        model: this.model,
        temperature: 0.7, // Balanced creativity and accuracy
        max_tokens: 500,   // Reasonable response length
        top_p: 0.9,
        stream: false
      });

      console.log('✅ GROQ API response received successfully');
      console.log('📊 Response length:', response.choices[0]?.message?.content?.length || 0);

      return response.choices[0]?.message?.content || "I apologize, but I'm having trouble processing your request right now. Please try again.";

    } catch (error) {
      console.error('❌ GROQ API Error Details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        type: error.type
      });
      
      // More specific error handling
      if (error.message?.includes('API key')) {
        throw new Error('Invalid GROQ API key');
      } else if (error.message?.includes('rate limit')) {
        throw new Error('GROQ API rate limit exceeded');
      } else if (error.message?.includes('model')) {
        throw new Error('GROQ model not available');
      } else {
        throw new Error(`GROQ API failed: ${error.message}`);
      }
    }
  }

  /**
   * Build system prompt with user context
   */
  buildSystemPrompt(userContext) {
    const { user, expenses, investments, savings, budget } = userContext;
    
    return `You are FinFluence AI, a friendly and knowledgeable financial assistant. You help users with:
- Expense tracking and analysis
- Investment advice and portfolio management  
- Savings goals and budgeting
- Financial planning and insights

PERSONALITY:
- Be conversational, warm, and encouraging
- Use emojis sparingly but effectively
- Give practical, actionable advice
- Be supportive about financial struggles
- Celebrate financial wins and progress

USER CONTEXT:
${user ? `- User: ${user.firstName} ${user.lastName || ''}` : '- User: Anonymous'}
${user?.profile?.occupation ? `- Occupation: ${user.profile.occupation}` : ''}
${expenses ? `- Recent expenses: ${this.summarizeExpenses(expenses)}` : ''}
${investments ? `- Investments: ${this.summarizeInvestments(investments)}` : ''}
${savings ? `- Savings: ${this.summarizeSavings(savings)}` : ''}
${budget ? `- Budget: ${this.summarizeBudget(budget)}` : ''}

GUIDELINES:
- Always provide specific, actionable advice
- Reference user's actual data when available
- Suggest follow-up questions or actions
- Keep responses under 300 words
- Use Indian Rupees (₹) for currency
- Focus on practical financial advice for Indian context

Remember: You're here to help users make better financial decisions!`;
  }

  /**
   * Build conversation messages array
   */
  buildMessages(systemPrompt, currentQuery, conversationHistory) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add current user query
    messages.push({ role: 'user', content: currentQuery });

    return messages;
  }

  /**
   * Summarize expenses for context
   */
  summarizeExpenses(expenses) {
    if (!expenses || expenses.length === 0) return 'No recent expenses';
    
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categories = [...new Set(expenses.map(exp => exp.category))];
    
    return `Total: ₹${total.toLocaleString()}, Categories: ${categories.slice(0, 3).join(', ')}`;
  }

  /**
   * Summarize investments for context
   */
  summarizeInvestments(investments) {
    if (!investments || investments.length === 0) return 'No investments recorded';
    
    const total = investments.reduce((sum, inv) => sum + inv.amount, 0);
    return `Portfolio value: ₹${total.toLocaleString()}`;
  }

  /**
   * Summarize savings for context
   */
  summarizeSavings(savings) {
    if (!savings) return 'No savings data';
    return `Total savings: ₹${savings.total?.toLocaleString() || 0}`;
  }

  /**
   * Summarize budget for context
   */
  summarizeBudget(budget) {
    if (!budget) return 'No budget set';
    return `Monthly budget: ₹${budget.total?.toLocaleString() || 0}, Used: ${budget.used || 0}%`;
  }

  /**
   * Generate financial insights based on user data
   */
  async generateInsights(userFinancialData) {
    try {
      const prompt = `Analyze this financial data and provide 3 key insights:
      
      ${JSON.stringify(userFinancialData, null, 2)}
      
      Provide insights about:
      1. Spending patterns
      2. Investment opportunities
      3. Savings optimization
      
      Keep each insight under 50 words and actionable.`;

      const response = await this.groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a financial analyst providing brief, actionable insights.' },
          { role: 'user', content: prompt }
        ],
        model: this.model,
        temperature: 0.5,
        max_tokens: 300
      });

      return response.choices[0]?.message?.content || "Unable to generate insights at this time.";

    } catch (error) {
      console.error('GROQ Insights Error:', error);
      throw new Error('Failed to generate insights');
    }
  }

  /**
   * Test connection on initialization
   */
  async testConnection() {
    try {
      console.log('🔍 Testing GROQ API connection...');
      const response = await this.groq.chat.completions.create({
        messages: [
          { role: 'user', content: 'Hello' }
        ],
        model: this.model,
        max_tokens: 10
      });
      
      if (response.choices[0]?.message?.content) {
        console.log('✅ GROQ API connection test successful');
      }
    } catch (error) {
      console.error('❌ GROQ API connection test failed:', error.message);
      
      // Try alternative model
      if (error.message?.includes('model')) {
        console.log('🔄 Trying alternative model...');
        this.model = 'mixtral-8x7b-32768';
      }
    }
  }

  /**
   * Check if GROQ service is available
   */
  async healthCheck() {
    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          { role: 'user', content: 'Hello, are you working?' }
        ],
        model: this.model,
        max_tokens: 10
      });
      
      return !!response.choices[0]?.message?.content;
    } catch (error) {
      console.error('GROQ Health Check Failed:', error);
      return false;
    }
  }
}

module.exports = new GroqService();