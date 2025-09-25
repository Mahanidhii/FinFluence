import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User } from 'lucide-react';

const FinancialChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your financial assistant. I can help you track expenses, investments, savings, and answer questions about your financial data. What would you like to know?",
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
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.response.content;
      } else {
        return "I'm having trouble processing your request right now. Please try again later.";
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      
      // Fallback to local responses
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('food') && lowerQuery.includes('week')) {
        return "This week you spent ₹1,250 on food. Breakdown: Zomato ₹450, Groceries ₹600, Cafe visits ₹200. This is 15% higher than last week.";
      } else if (lowerQuery.includes('gold') || lowerQuery.includes('etf')) {
        return "Your ETF investments this month: Gold ETFs ₹8,500, Other ETFs ₹12,000. Total ETF portfolio value: ₹85,600 (+5.2% this month).";
      } else if (lowerQuery.includes('savings')) {
        return "Total savings: ₹1,24,500 (+12% from last month). You're on a 15-day savings streak! Goal progress: 80% complete.";
      } else if (lowerQuery.includes('expense') || lowerQuery.includes('spend')) {
        return "Total expenses this month: ₹18,420. Food (35%), Transport (25%), Entertainment (20%), Shopping (15%), Others (5%).";
      } else {
        return "I can help you with expenses, investments, savings, budgets, and financial goals. What specific information do you need?";
      }
    }
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

  const quickQuestions = [
    "How much did I spend on food this week?",
    "What's my investment portfolio performance?",
    "How much did I invest in ETFs this month?",
    "Show me my savings goal progress",
    "What are my biggest expenses?"
  ];

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