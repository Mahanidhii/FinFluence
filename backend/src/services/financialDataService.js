/**
 * Financial Data Service
 * Aggregates and analyzes user's financial data for AI chatbot context
 */

const User = require('../models/User');

class FinancialDataService {
  /**
   * Get comprehensive financial context for a user
   * @param {string} userId - User's ID
   * @returns {Promise<Object>} User's financial context
   */
  async getUserFinancialContext(userId) {
    try {
      // Get user with all financial data
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Get recent expenses (last 30 days)
      const expenses = await this.getRecentExpenses(userId, 30);
      
      // Get investment data
      const investments = await this.getInvestmentData(userId);
      
      // Get savings information
      const savings = await this.getSavingsData(userId);
      
      // Get budget information
      const budget = await this.getBudgetData(userId);

      return {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          profile: user.profile,
          stats: user.stats
        },
        expenses,
        investments,
        savings,
        budget,
        summary: this.generateSummary(expenses, investments, savings, budget)
      };

    } catch (error) {
      console.error('Error getting financial context:', error);
      return {
        user: null,
        expenses: [],
        investments: [],
        savings: null,
        budget: null,
        summary: 'Limited financial data available'
      };
    }
  }

  /**
   * Get recent expenses for user
   */
  async getRecentExpenses(userId, days = 30) {
    try {
      // Mock expense data - In real app, this would query expense collection
      const mockExpenses = [
        {
          id: 1,
          amount: 450,
          category: 'Food',
          description: 'Zomato order',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          type: 'expense'
        },
        {
          id: 2,
          amount: 1200,
          category: 'Transport',
          description: 'Petrol',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          type: 'expense'
        },
        {
          id: 3,
          amount: 2500,
          category: 'Shopping',
          description: 'Clothes',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          type: 'expense'
        },
        {
          id: 4,
          amount: 800,
          category: 'Entertainment',
          description: 'Movie tickets',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          type: 'expense'
        },
        {
          id: 5,
          amount: 600,
          category: 'Food',
          description: 'Groceries',
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          type: 'expense'
        }
      ];

      return mockExpenses;
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  }

  /**
   * Get investment data for user
   */
  async getInvestmentData(userId) {
    try {
      // Mock investment data
      const mockInvestments = [
        {
          id: 1,
          type: 'Stocks',
          name: 'Reliance Industries',
          amount: 25000,
          currentValue: 26200,
          change: +4.8,
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          type: 'Mutual Fund',
          name: 'HDFC Top 100',
          amount: 15000,
          currentValue: 15600,
          change: +4.0,
          date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          id: 3,
          type: 'ETF',
          name: 'Nifty 50 ETF',
          amount: 10000,
          currentValue: 10350,
          change: +3.5,
          date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        }
      ];

      return mockInvestments;
    } catch (error) {
      console.error('Error getting investments:', error);
      return [];
    }
  }

  /**
   * Get savings data for user
   */
  async getSavingsData(userId) {
    try {
      // Mock savings data
      return {
        total: 125000,
        monthlyGrowth: 8500,
        savingsRate: 20, // percentage
        goals: [
          {
            name: 'Emergency Fund',
            target: 300000,
            current: 125000,
            progress: 41.7
          },
          {
            name: 'Vacation',
            target: 50000,
            current: 25000,
            progress: 50
          }
        ],
        roundUpSavings: 2340
      };
    } catch (error) {
      console.error('Error getting savings:', error);
      return null;
    }
  }

  /**
   * Get budget data for user
   */
  async getBudgetData(userId) {
    try {
      // Mock budget data
      return {
        total: 25000,
        spent: 18420,
        remaining: 6580,
        used: 73.7,
        categories: {
          Food: { budget: 8000, spent: 6500, remaining: 1500 },
          Transport: { budget: 5000, spent: 4600, remaining: 400 },
          Entertainment: { budget: 4000, spent: 3700, remaining: 300 },
          Shopping: { budget: 6000, spent: 2800, remaining: 3200 },
          Others: { budget: 2000, spent: 820, remaining: 1180 }
        }
      };
    } catch (error) {
      console.error('Error getting budget:', error);
      return null;
    }
  }

  /**
   * Generate financial summary
   */
  generateSummary(expenses, investments, savings, budget) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    
    return {
      monthlyExpenses: totalExpenses,
      portfolioValue: totalInvestments,
      savingsTotal: savings?.total || 0,
      budgetUsed: budget?.used || 0,
      topExpenseCategory: this.getTopExpenseCategory(expenses),
      investmentGrowth: this.calculateInvestmentGrowth(investments)
    };
  }

  /**
   * Get top expense category
   */
  getTopExpenseCategory(expenses) {
    const categoryTotals = {};
    
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b, Object.keys(categoryTotals)[0]
    );

    return {
      category: topCategory,
      amount: categoryTotals[topCategory] || 0
    };
  }

  /**
   * Calculate investment growth
   */
  calculateInvestmentGrowth(investments) {
    if (!investments.length) return 0;
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    
    return totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested * 100) : 0;
  }

  /**
   * Get expense trends for analysis
   */
  async getExpenseTrends(userId, months = 6) {
    // Mock trend data
    return {
      monthly: [
        { month: 'Sep', amount: 16500 },
        { month: 'Aug', amount: 19200 },
        { month: 'Jul', amount: 17800 },
        { month: 'Jun', amount: 20100 },
        { month: 'May', amount: 18300 },
        { month: 'Apr', amount: 21000 }
      ],
      categoryTrends: {
        Food: { trend: 'increasing', change: 12 },
        Transport: { trend: 'stable', change: -2 },
        Entertainment: { trend: 'decreasing', change: -15 },
        Shopping: { trend: 'increasing', change: 8 }
      }
    };
  }
}

module.exports = new FinancialDataService();