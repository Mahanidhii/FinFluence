# 💰 FinFluence - Social Finance Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://www.python.org/)

*A comprehensive social finance platform that combines engaging social media features with powerful financial tools*

</div>

## 📋 Overview

FinFluence is a modern social finance platform inspired by the community aspects of Reddit, the professional networking of LinkedIn, and the engaging interface of Instagram. It empowers users to manage their finances while connecting with a supportive community of like-minded individuals.

**🎯 Mission**: Make financial literacy accessible, engaging, and social while promoting healthy financial habits without harmful competition.

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
- **Stock & Crypto News** - Up-to-date news regarding cryptocurrency and NSE(National Stock Exhange)

### AI-Powered Insights
- **Financial Chatbot** - Text-based assistant for instant query responses
- Personalized spending recommendations
- Category-wise expense predictions  
- Investment opportunity analysis
- Natural language financial data retrieval

## Tech Stack
- **MERN STACK** - MongoDB, Express, React, NodeJS
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


## Demo Flow
1. **Register/Login** - Create account or login with test credentials
2. **Dashboard** - View AI predictions, portfolio, and savings goals
3. **Social Feed** - Share financial posts and engage with community  
4. **Join Groups** - Connect with investment clubs and communities
5. **Take Challenges** - Participate in savings and investment challenges
6. **Track Progress** - Monitor achievements and financial growth


**Built for the blooming finance community**

## Core Features

### 1. Social Feed (Reddit + Instagram + LinkedIn style)
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

### 5. Latest updates for crypto and stockss
- Up-to-date news for cryptocurrency 
- Daily news from the NSE (National Stock Exchange)

## Social Layer Features
- **Profiles**: Show savings streaks, badges, milestones
- **Feed**: Milestones, challenges, reels, expert advice
- **Follow/Connect**: Friends, finance mentors, clubs, groups/communities (like reddit)
- **Groups**: Investment communities, expense management groups
- **Gamification**: Badges for achievements


## Project Structure
```
Project FinFluence
├── frontend/               # React frontend application
├── backend/                # Node.js Express API server
├── ml-service/             # Python ML service for predictions
├── database/               # Database schemas and migrations
└── docs/                   # Documentation and API specs
```

### Prerequisites
- MERN Stack : MongoDB, Express, React, NodeJS
- Python (v3.8+)
- Git


### Installation & Quick Start
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
# Terminal 1: Backend
cd frontend && npm start

# Terminal 2: ML Service
cd backend && python app.py

# Terminal 3: ML Service
cd ml-service && npm run dev

```
_Access the platform from_: http://localhost:3000


## Screenshots
_Will be uploaded once developmental phase is over_


## Tech Stack
- **Frontend**: React with modern UI components
- **Backend**: Node.js + Express.js
- **Database**: MongoDB for social + transaction data
- **AI/ML**: Python ML model for expense prediction
- **Voice Assistant**: Google Speech-to-Text API
- **Authentication**: JWT tokens
- **Real-time**: Socket.io for live features


## Contribution
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add some NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request


## Acknowledgments
- Inspired by the social aspects of financial subreddits in Reddit, Instagram and LinkedIn
- React community for excellent documentation
- MongoDB for flexible data modeling
- Scikit-learn for ML capabilities
- Socket.io for real-time features
- Built for the financial empowerment of the youth