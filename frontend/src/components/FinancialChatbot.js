import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User } from 'lucide-react';

const FinancialChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! 👋 I'm FinFluence AI, your intelligent financial assistant powered by advanced AI. I analyze your actual financial data to provide personalized insights, budgeting advice, investment recommendations, and spending analysis. Ask me anything about your finances - I'm here to help you make smarter money decisions!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load personalized suggestions on component mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/chatbot/suggestions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.suggestions) {
            setQuickQuestions(data.suggestions.slice(0, 6));
          }
        }
      } catch (error) {
        console.log('Could not load personalized suggestions:', error);
        // Keep default suggestions
      }
    };

    loadSuggestions();
  }, []);

  const generateResponse = async (query) => {
    try {
      // Get auth token
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          query,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update quick questions with contextual suggestions
        if (data.response.suggestions && data.response.suggestions.length > 0) {
          setQuickQuestions(data.response.suggestions);
        }
        
        return data.response.content;
      } else {
        return "I'm having trouble processing your request right now. Please try again later.";
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      
      // Enhanced fallback responses
      return getEnhancedFallbackResponse(query);
    }
  };

  const getEnhancedFallbackResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
      return "Hello! 👋 I'm your AI financial assistant. I can help you track expenses, analyze investments, plan budgets, and give personalized financial advice. What would you like to know about your finances?";
    }
    
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
      return "I can help you with:\n\n💰 **Expense Analysis** - Track and categorize your spending\n📈 **Investment Insights** - Portfolio performance and recommendations\n🎯 **Budget Planning** - Monitor your monthly budget and goals\n💡 **Financial Tips** - Personalized advice for better money management\n\nJust ask me anything about your finances!";
    }
    
    if (lowerQuery.includes('spend') || lowerQuery.includes('expense')) {
      return "I'd love to analyze your spending patterns! Based on typical user data, I can help you:\n\n• Identify your top expense categories\n• Compare monthly spending trends\n• Find opportunities to save money\n• Set realistic budget limits\n\nWhat specific expenses would you like me to look at?";
    }
    
    if (lowerQuery.includes('invest') || lowerQuery.includes('portfolio') || lowerQuery.includes('stock')) {
      return "Investment analysis is one of my specialties! 📊 I can help you:\n\n• Review your portfolio performance\n• Suggest investment diversification\n• Analyze risk vs returns\n• Recommend investment strategies\n\nWould you like me to look at your current investments or help you start investing?";
    }
    
    if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
      return "Savings planning is crucial for financial health! 🏦 I can assist with:\n\n• Setting realistic savings goals\n• Automating your savings strategy\n• Optimizing your savings rate\n• Tracking progress toward goals\n\nWhat's your current savings goal or what would you like to save for?";
    }
    
    if (lowerQuery.includes('budget')) {
      return "Budget management made easy! 📋 I can help you:\n\n• Create a personalized budget\n• Track spending vs budget limits\n• Adjust categories based on habits\n• Get alerts when approaching limits\n\nWould you like me to review your current budget or help create a new one?";
    }
    
    return "I'm your intelligent financial assistant powered by AI! 🤖 I analyze your actual financial data to provide personalized insights and advice. Ask me about your expenses, investments, savings, budgets, or any financial planning questions. What would you like to explore first?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Make API call
    generateResponse(inputMessage).then(response => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const [quickQuestions, setQuickQuestions] = useState([
    "Analyze my spending patterns this month",
    "How is my investment portfolio performing?",
    "Give me personalized savings advice",
    "What should I focus on financially?",
    "Help me optimize my budget",
    "Show me my financial health overview"
  ]);

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-full">
            <MessageCircle className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Financial Assistant</h2>
            <p className="text-sm text-gray-500">Ask me anything about your finances</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-xs bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-600 px-3 py-2 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-96 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'bot' && (
                <div className="p-2 bg-primary-500 rounded-full">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {message.type === 'user' && (
                <div className="p-2 bg-gray-500 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary-500 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your financial question here..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>Send</span>
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        Financial data is based on your transaction history and may take time to update.
      </p>
    </div>
  );
};

export default FinancialChatbot;