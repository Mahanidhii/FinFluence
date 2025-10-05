import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Award,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Send,
  MessageCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Mock data for charts
  const expenseData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1398 },
    { month: 'Mar', amount: 9800 },
    { month: 'Apr', amount: 3908 },
    { month: 'May', amount: 4800 },
    { month: 'Jun', amount: 3800 },
  ];

  const categoryData = [
    { name: 'Food', value: 35, color: '#0ea5e9' },
    { name: 'Transport', value: 25, color: '#22c55e' },
    { name: 'Entertainment', value: 20, color: '#f59e0b' },
    { name: 'Shopping', value: 15, color: '#ef4444' },
    { name: 'Others', value: 5, color: '#8b5cf6' },
  ];

  // Mock predictions
  const predictions = {
    nextMonth: {
      totalExpense: 4200,
      categories: [
        { name: 'Food', predicted: 1500, warning: true, message: "You'll probably overspend ₹500 on food 🍕" },
        { name: 'Transport', predicted: 800, warning: false },
        { name: 'Entertainment', predicted: 900, warning: true, message: "Movie budget might exceed by ₹200 🎬" },
      ]
    }
  };

  // Chatbot functionality (mock)
  const handleSendQuery = async () => {
    if (!currentQuery.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentQuery,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentQuery('');
    setIsTyping(true);
    
    // Get AI response
    try {
      const response = await generateAIResponse(currentQuery);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm having trouble right now, but I'm still here to help! Try asking about your expenses, investments, or savings.",
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const generateAIResponse = async (query) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          query,
          conversationHistory: chatMessages.slice(-10)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.response.content;
      } else {
        return "I'm having trouble processing your request right now. Please try again later.";
      }
    } catch (error) {
      console.error('Dashboard chatbot error:', error);
      return getDashboardFallbackResponse(query);
    }
  };

  const getDashboardFallbackResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return "Hi there! 👋 I'm your AI financial assistant. I can analyze your spending, investments, and help you make better financial decisions. What would you like to know?";
    }
    
    if (lowerQuery.includes('spend') || lowerQuery.includes('expense')) {
      return "Based on your recent activity, you've been spending quite actively! I can help you analyze your spending patterns, identify areas to save, and track your budget. What specific expenses would you like me to look at?";
    }
    
    if (lowerQuery.includes('invest') || lowerQuery.includes('portfolio')) {
      return "Your investment journey is important! 📈 I can help you analyze your portfolio performance, suggest diversification strategies, and provide investment insights. What aspect of investing interests you most?";
    }
    
    if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
      return "Savings are the foundation of financial security! 💰 I can help you optimize your savings strategy, set realistic goals, and track your progress. What are your savings priorities?";
    }
    
    return "I'm here to help with all your financial questions! Ask me about your expenses, investments, savings, budgets, or any financial planning topics. I analyze your actual data to give personalized advice! 🤖✨";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Finance
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName}! Here's your complete financial overview
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">₹1,24,500</p>
              <p className="text-sm text-success-600 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">This Month Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹18,420</p>
              <p className="text-sm text-danger-600 flex items-center mt-1">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                +8% from budget
              </p>
            </div>
            <div className="p-3 bg-danger-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-danger-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Investment Value</p>
              <p className="text-2xl font-bold text-gray-900">₹85,600</p>
              <p className="text-sm text-success-600 flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +5.2% this week
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <PieChart className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Savings Streak</p>
              <p className="text-2xl font-bold text-gray-900">15 days</p>
              <p className="text-sm text-warning-600 flex items-center mt-1">
                <Award className="h-4 w-4 mr-1" />
                Keep it up!
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <Target className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Expense Predictor */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                AI Expense Predictor
              </h2>
              <button className="btn-secondary text-sm">
                Share Prediction
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Next Month Prediction: ₹{predictions.nextMonth.totalExpense.toLocaleString()}
              </h3>
              <div className="space-y-2">
                {predictions.nextMonth.categories.map((category, index) => (
                  <div key={index} className={`p-3 rounded-lg ${category.warning ? 'bg-red-100 border border-red-200' : 'bg-green-100 border border-green-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-600">₹{category.predicted}</span>
                    </div>
                    {category.message && (
                      <p className="text-sm text-red-600 mt-1">{category.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Finance Buddy Tip:</strong> Your food expenses tend to spike on weekends. 
                Consider meal prepping to save ₹800 this month!
              </p>
            </div>
          </div>

          {/* Expense Trends */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Expense Trends
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Financial Chatbot */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                💬 Financial Assistant Chat
              </h2>
              <MessageCircle className="h-6 w-6 text-primary-500" />
            </div>
            
            {/* Chat Messages */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-16">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">Start a conversation with your financial assistant!</p>
                  <div className="mt-4 space-y-1 text-xs text-gray-400">
                    <p>Try: "Analyze my spending patterns this month"</p>
                    <p>Try: "Give me personalized investment advice"</p>
                    <p>Try: "How can I improve my financial health?"</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-primary-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your finances..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSendQuery}
                disabled={!currentQuery.trim() || isTyping}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Spending by Category */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Spending by Category
            </h2>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <defs>
                    {categoryData.map((entry, index) => (
                      <pattern key={index} id={`pattern-${index}`} patternUnits="userSpaceOnUse" width="4" height="4">
                        <rect width="4" height="4" fill={entry.color} />
                      </pattern>
                    ))}
                  </defs>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Round-up Savings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Round-up Savings
            </h2>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">₹847</p>
              <p className="text-sm text-gray-600 mt-1">Saved this month</p>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Coffee - ₹95</span>
                <span className="text-primary-600">+₹5</span>
              </div>
              <div className="flex justify-between">
                <span>Groceries - ₹1,247</span>
                <span className="text-primary-600">+₹53</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel - ₹899</span>
                <span className="text-primary-600">+₹1</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full btn-primary text-left flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Expense
              </button>
              <button className="w-full btn-secondary text-left flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Set Savings Goal
              </button>
              <button className="w-full btn-secondary text-left flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Track Investment
              </button>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Achievements 🏆
            </h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-success-50 rounded-lg">
                <Award className="h-5 w-5 text-success-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-success-800">Smart Saver</p>
                  <p className="text-xs text-success-600">Saved for 15 days straight</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-primary-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-primary-800">Investment Rookie</p>
                  <p className="text-xs text-primary-600">Made your first investment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;