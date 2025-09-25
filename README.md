# FinFluence - Social Finance Platform

A comprehensive social finance platform that combines the engaging features of social media with powerful financial tools, built with React, Node.js, MongoDB, and Python ML services.

## Quick Start

```bash
# Install all dependencies
npm run install:all

# Start all services
npm run dev

# Seed database with sample data
npm run seed
```

**Access the platform**: http://localhost:3000

## Features

### Financial Tools
- **Financial Assistant Chatbot** - Text-based AI for instant financial queries
- **AI Expense Prediction** - Machine learning powered spending forecasts and Query Retrieval 
- **Portfolio Tracking** - Real-time investment monitoring  
- **Budget Management** - Category-wise expense tracking
- **Savings Goals** - Automated goal tracking and achievements

### Social Features  
- **Social Feed** - Share financial wins, tips, and insights
- **Investment Clubs** - Join communities of like-minded investors
- **Group Challenges** - Gamified savings and investment challenges
- **Financial Reels** - Short-form educational content
- **Achievement System** - Badges and rewards for financial milestones

### AI-Powered Insights
- **Financial Chatbot** - Text-based assistant for instant query responses
- Personalized spending recommendations
- Category-wise expense predictions  
- Investment opportunity analysis
- Natural language financial data retrieval

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Socket.io
- **Backend**: Node.js, Express, MongoDB, JWT Auth
- **ML Service**: Python, Flask, Scikit-learn
- **Real-time**: Socket.io for notifications
- **Database**: MongoDB with comprehensive schemas

## Screenshots

*Dashboard with AI predictions and portfolio overview*
*Social feed with financial posts and community engagement*
*Group challenges with leaderboards and progress tracking*

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   React     │    │   Node.js   │    │   Python    │
│  Frontend   │◄──►│   Backend   │◄──►│ ML Service  │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                   ┌─────────────┐
                   │  MongoDB    │
                   │  Database   │
                   └─────────────┘
```

## Documentation

- **[Development Guide](docs/DEVELOPMENT.md)** - Complete setup and development workflow
- **[API Documentation](docs/API.md)** - Backend API endpoints and usage
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## Demo Flow

1. **Register/Login** - Create account or login with test credentials
2. **Dashboard** - View AI predictions, portfolio, and savings goals
3. **Social Feed** - Share financial posts and engage with community  
4. **Join Groups** - Connect with investment clubs and communities
5. **Take Challenges** - Participate in savings and investment challenges
6. **Track Progress** - Monitor achievements and financial growth

## Test Credentials

```
rahul@example.com / password123 (Investor profile)
priya@example.com / password123 (Saver profile)  
arjun@example.com / password123 (Trader profile)
```

## Deployment

### Local Development
```bash
npm run dev  # Starts all services
```

### Production
```bash
npm run build        # Build frontend
npm run docker:up    # Deploy with Docker
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React community for excellent documentation
- MongoDB for flexible data modeling
- Scikit-learn for ML capabilities
- Socket.io for real-time features

---

**Built for the finance community**

## Core Features

### 1. Social Feed (Instagram + LinkedIn style)
- Users can post finance milestones ("Saved my first ₹100,000 this month 🎉")
- Friends can like, comment, share tips
- Verified finance experts can post educational content

### 2. AI-Powered Expense Predictor
- App predicts next month's budget with personalized insights
- Share predictions on feed for community tips
- Finance accountability buddy system

### 3. Group Challenges + Investment Clubs
- Create/join finance challenges ("Save ₹20000 this month")
- Leaderboards and gamification
- Investment groups and stock lending simulation

### 4. Financial Reels & Quick Learning
- Short "Reels for Finance" in the feed
- 30-sec clips explaining financial concepts
- Quiz system with badges

### 5. Query Retrieval Assistant
- Voice/text queries: "How much did I spend on food this week?"
- In-chat responses with shareable results

## Social Layer Features
- **Profiles**: Show savings streaks, badges, milestones
- **Feed**: Milestones, challenges, reels, expert advice
- **Follow/Connect**: Friends, finance mentors, clubs
- **Groups**: Investment communities, expense management groups
- **Gamification**: Badges for achievements

## Tech Stack
- **Frontend**: React with modern UI components
- **Backend**: Node.js + Express.js
- **Database**: MongoDB for social + transaction data
- **AI/ML**: Python ML model for expense prediction
- **Voice Assistant**: Google Speech-to-Text API
- **Authentication**: JWT tokens
- **Real-time**: Socket.io for live features

## Project Structure
```
├── frontend/          # React frontend application
├── backend/           # Node.js Express API server
├── ml-service/        # Python ML service for predictions
├── database/          # Database schemas and migrations
└── docs/             # Documentation and API specs
```

## Quick Start

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- Git

### Installation
1. Clone the repository
```bash
git clone https://github.com/Mahanidhii/CRCE-Finance.git
cd CRCE-Finance
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Set up ML service
```bash
cd ../ml-service
pip install -r requirements.txt
```

5. Start all services
```bash
# Terminal 1: Frontend
cd frontend && npm start

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: ML Service
cd ml-service && python app.py
```

## Demo Flow
1. **Login & Profile Setup**
2. **Dashboard**: Expense prediction + round-up savings
3. **Feed**: Posts, milestones, and reels
4. **Groups**: Investment communities and discussion forums
5. **Challenges**: Join savings and investment challenges

## Screenshots
(Screenshots will be added as development progresses)

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by the social aspects of Instagram and LinkedIn
- Built for the financial empowerment of young adults
- Special thanks to CRCE for project support