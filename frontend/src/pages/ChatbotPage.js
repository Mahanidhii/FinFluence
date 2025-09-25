import React from 'react';
import FinancialChatbot from '../components/FinancialChatbot';

const ChatbotPage = () => {
  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Assistant 🤖
          </h1>
          <p className="text-gray-600">
            Get instant answers about your expenses, investments, savings, and financial goals.
            Just type your question below!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chatbot - Main Content */}
          <div className="lg:col-span-3">
            <FinancialChatbot />
          </div>

          {/* Sidebar - Help & Tips */}
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What I Can Help With
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Expense Tracking</p>
                    <p className="text-xs text-gray-500">View spending by category, week, or month</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Investment Analysis</p>
                    <p className="text-xs text-gray-500">Portfolio performance and recommendations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Savings Goals</p>
                    <p className="text-xs text-gray-500">Track progress and get insights</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Budget Planning</p>
                    <p className="text-xs text-gray-500">Monitor budgets and spending limits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Queries */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Example Questions
              </h3>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-800">"How much did I spend on food this week?"</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-800">"What's my portfolio performance this month?"</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-800">"How much did I invest in Gold ETFs?"</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-800">"Show me my biggest expenses"</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-800">"How much money is in my round-up savings?"</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Tips for Better Results
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Be specific with time periods (this week, last month, etc.)</p>
                <p>• Ask about specific categories (food, transport, entertainment)</p>
                <p>• Use natural language - no need for exact commands</p>
                <p>• Ask follow-up questions for more details</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month Expenses</span>
                  <span className="text-sm font-medium text-gray-900">₹18,420</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Savings</span>
                  <span className="text-sm font-medium text-gray-900">₹1,24,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Investment Value</span>
                  <span className="text-sm font-medium text-gray-900">₹85,600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Savings Streak</span>
                  <span className="text-sm font-medium text-gray-900">15 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;