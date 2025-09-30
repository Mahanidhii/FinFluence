"""
FinFluence ML Service
A Flask-based machine learning service for financial predictions and chatbot functionality.

Features:
- Expense prediction using Random Forest
- Financial chatbot with NLP
- Investment insights generation
"""

# Flask and API Dependencies
from flask import Flask, request, jsonify
from flask_cors import CORS

# Data Processing Libraries
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import joblib
import os
import re

# Machine Learning Libraries
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

# Suppress sklearn warnings for cleaner output
import warnings
warnings.filterwarnings('ignore')

# Initialize Flask Application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

class ExpensePredictionModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def create_features(self, data):
        """Create features from expense data"""
        features = []
        
        for record in data:
            # Extract temporal features
            date = datetime.strptime(record['date'], '%Y-%m-%d')
            day_of_week = date.weekday()
            day_of_month = date.day
            month = date.month
            
            # Category encoding (simple hash for demo)
            category_hash = hash(record['category']) % 10
            
            # Amount-based features
            amount = float(record['amount'])
            
            features.append([
                day_of_week, day_of_month, month, 
                category_hash, amount
            ])
        
        return np.array(features)
    
    def train(self, expense_data):
        """Train the model with expense data"""
        if len(expense_data) < 5:
            return False
        
        try:
            X = self.create_features(expense_data)
            y = [float(record['amount']) for record in expense_data]
            
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            self.is_trained = True
            return True
        except Exception as e:
            print(f"Training error: {e}")
            return False
    
    def predict(self, future_dates, categories):
        """Predict future expenses"""
        if not self.is_trained:
            return []
        
        predictions = []
        for date_str, category in zip(future_dates, categories):
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d')
                features = [[
                    date.weekday(),
                    date.day,
                    date.month,
                    hash(category) % 10,
                    0  # placeholder for amount
                ]]
                
                X_scaled = self.scaler.transform(features)
                pred = self.model.predict(X_scaled)[0]
                predictions.append(max(0, pred))  # Ensure non-negative
            except Exception as e:
                print(f"Prediction error: {e}")
                predictions.append(0)
        
        return predictions

# Initialize the model
expense_model = ExpensePredictionModel()

class FinancialChatbot:
    def __init__(self):
        self.responses = {
            'greeting': [
                "Hello! I'm your financial assistant. How can I help you manage your finances today?",
                "Hi there! Ready to talk about your financial goals?",
                "Welcome! I'm here to help with your financial questions."
            ],
            'budgeting': [
                "Budgeting is key to financial success! Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
                "Track your expenses for a month to understand your spending patterns, then create realistic budget categories.",
                "Consider using envelope budgeting - allocate specific amounts to different spending categories."
            ],
            'saving': [
                "Start with an emergency fund covering 3-6 months of expenses. Even $25/week adds up!",
                "Automate your savings! Set up automatic transfers to make saving effortless.",
                "Try the 52-week challenge: save $1 week 1, $2 week 2, and so on. You'll have $1,378 by year-end!"
            ],
            'investing': [
                "Start investing early to benefit from compound interest. Consider low-cost index funds.",
                "Diversification is crucial - don't put all your eggs in one basket.",
                "Dollar-cost averaging can help reduce investment risk by spreading purchases over time."
            ],
            'debt': [
                "Consider the debt avalanche method: pay minimums on all debts, then focus extra payments on highest interest debt.",
                "The debt snowball method can be motivating: pay minimums on all debts, then focus on the smallest balance first.",
                "Try to avoid taking on new debt while paying off existing debt."
            ],
            'default': [
                "I'm here to help with financial questions! Ask me about budgeting, saving, investing, or debt management.",
                "Let's talk finances! I can help with budgeting tips, investment advice, or debt strategies.",
                "Financial planning can be overwhelming, but I'm here to help break it down for you!"
            ]
        }
    
    def get_intent(self, message):
        """Simple intent classification based on keywords"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
            return 'greeting'
        elif any(word in message_lower for word in ['budget', 'budgeting', 'spend', 'expenses']):
            return 'budgeting'
        elif any(word in message_lower for word in ['save', 'saving', 'savings', 'emergency fund']):
            return 'saving'
        elif any(word in message_lower for word in ['invest', 'investment', 'stocks', 'portfolio']):
            return 'investing'
        elif any(word in message_lower for word in ['debt', 'loan', 'credit', 'mortgage']):
            return 'debt'
        else:
            return 'default'
    
    def get_response(self, message):
        """Get chatbot response"""
        intent = self.get_intent(message)
        responses = self.responses.get(intent, self.responses['default'])
        
        # Simple response selection (can be made more sophisticated)
        response = np.random.choice(responses)
        
        return {
            'response': response,
            'intent': intent,
            'confidence': 0.8  # Mock confidence score
        }

# Initialize chatbot
chatbot = FinancialChatbot()

# Routes
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Financial ML Service',
        'version': '1.0.0'
    })

@app.route('/query', methods=['POST'])
def handle_query():
    """Handle chatbot queries"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({
                'error': 'Message is required'
            }), 400
        
        response = chatbot.get_response(message)
        
        return jsonify({
            'success': True,
            'response': response['response'],
            'intent': response['intent'],
            'confidence': response['confidence']
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/predict-expenses', methods=['POST'])
def predict_expenses():
    """Predict future expenses"""
    try:
        data = request.get_json()
        historical_data = data.get('historical_data', [])
        future_dates = data.get('future_dates', [])
        categories = data.get('categories', [])
        
        if not historical_data:
            return jsonify({
                'error': 'Historical data is required'
            }), 400
        
        # Train model with historical data
        if expense_model.train(historical_data):
            predictions = expense_model.predict(future_dates, categories)
            
            return jsonify({
                'success': True,
                'predictions': predictions,
                'model_trained': True
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Insufficient data to train model (minimum 5 records required)',
                'model_trained': False
            }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/financial-insights', methods=['POST'])
def get_financial_insights():
    """Generate financial insights from expense data"""
    try:
        data = request.get_json()
        expense_history = data.get('expense_history', [])
        
        if not expense_history:
            return jsonify({
                'error': 'Expense history is required'
            }), 400
        
        insights = generate_insights(expense_history)
        
        return jsonify({
            'success': True,
            'insights': insights
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def generate_insights(expense_history):
    """Generate financial insights from expense data"""
    insights = []
    
    if not expense_history:
        return insights
    
    # Calculate total spending
    total_spending = sum(expense['amount'] for expense in expense_history)
    avg_daily_spending = total_spending / max(len(expense_history), 1)
    
    insights.append(f"Your average daily spending is ${avg_daily_spending:.2f}")
    
    # Monthly trend analysis
    monthly_totals = {}
    for expense in expense_history:
        date = datetime.strptime(expense['date'], '%Y-%m-%d')
        month_key = f"{date.year}-{date.month:02d}"
        monthly_totals[month_key] = monthly_totals.get(month_key, 0) + expense['amount']
    
    if len(monthly_totals) > 1:
        months = sorted(monthly_totals.keys())
        recent_month = monthly_totals[months[-1]]
        previous_month = monthly_totals[months[-2]]
        
        change = ((recent_month - previous_month) / previous_month) * 100
        if change > 10:
            insights.append(f"Your spending increased by {change:.1f}% last month")
        elif change < -10:
            insights.append(f"Great job! Your spending decreased by {abs(change):.1f}% last month")
    
    # Category insights
    category_totals = {}
    for expense in expense_history:
        category = expense.get('category', 'Others')
        category_totals[category] = category_totals.get(category, 0) + expense['amount']
    
    if category_totals:
        top_category = max(category_totals, key=category_totals.get)
        insights.append(f"You spend the most on {top_category} category")
    
    return insights

if __name__ == '__main__':
    print("Starting Financial Assistant ML Service...")
    print("Chatbot API available at: http://localhost:5001")
    print("Expense Prediction available at: http://localhost:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)