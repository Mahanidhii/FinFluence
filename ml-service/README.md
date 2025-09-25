# ML Service for FinFluence

This service provides AI-powered expense prediction and financial analysis using machine learning.

## Features

- **Expense Prediction**: Predict next month's expenses based on historical data
- **Category Analysis**: Break down spending by categories with trends
- **Spending Insights**: Generate personalized recommendations
- **Pattern Recognition**: Identify spending patterns and anomalies

## API Endpoints

### Health Check
- **GET** `/health` - Service health status

### Expense Prediction
- **POST** `/predict` - Predict future expenses
```json
{
  "expense_history": [
    {
      "date": "2024-01-15",
      "amount": 1200,
      "category": "Food",
      "description": "Groceries"
    }
  ],
  "user_profile": {
    "age": 25,
    "income": 50000,
    "location": "Mumbai"
  },
  "type": "monthly" // monthly, weekly, daily
}
```

### Spending Analysis
- **POST** `/analyze` - Analyze spending patterns
```json
{
  "expense_history": [
    // Same format as above
  ]
}
```

## Setup

1. **Install Dependencies**
```bash
pip install -r requirements.txt
```

2. **Run the Service**
```bash
python app.py
```

The service will be available at `http://localhost:5001`

## Machine Learning Model

The service uses a **Random Forest Regressor** with the following features:
- Temporal features (month, day, weekday)
- Amount patterns
- Category encoding
- Seasonal adjustments
- Weekend/weekday patterns

### Fallback Strategy
When insufficient data is available for ML training (< 10 records), the service uses rule-based predictions:
- Historical averages
- Trend analysis
- Seasonal multipliers
- Category-specific patterns

## Integration with Backend

The Node.js backend can call this service:
```javascript
const prediction = await axios.post('http://localhost:5001/predict', {
  expense_history: userExpenses,
  user_profile: userProfile,
  type: 'monthly'
});
```

## Environment Variables

- `FLASK_ENV`: Set to 'development' or 'production'
- `PORT`: Service port (default: 5001)
- `MODEL_PATH`: Path to save/load trained models (optional)

## Future Enhancements

- [ ] Support for multiple prediction models
- [ ] Real-time model updates
- [ ] A/B testing for different algorithms
- [ ] Integration with external data sources
- [ ] Advanced anomaly detection
- [ ] Investment recommendation engine