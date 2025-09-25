# FinFluence Development Guide

This guide will help you set up and run the complete FinFluence social finance platform locally.

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v6.0 or higher)
- **Git**

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd CRCE-Finance

# Install all dependencies
npm run install:all
```

### 2. Environment Setup

Create `.env` files in both `backend` and `frontend` directories:

**backend/.env:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finfluence
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
ML_SERVICE_URL=http://localhost:5001
```

**frontend/.env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ML_SERVICE_URL=http://localhost:5001
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Database Setup

```bash
# Start MongoDB service (varies by OS)
# Windows: net start MongoDB
# macOS: brew services start mongodb/brew/mongodb-community
# Linux: sudo systemctl start mongod

# Seed the database with sample data
cd database
npm install
npm run seed
```

### 4. Start All Services

**Option A: Start all services at once**
```bash
npm run dev
```

**Option B: Start services individually**

Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm start
```

Terminal 3 - ML Service:
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

### 5. Access the Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:5001
- **API Documentation**: http://localhost:5000/api/health

## Test Credentials

After seeding the database, you can login with:

- **rahul@example.com** / password123 (Investor profile)
- **priya@example.com** / password123 (Saver profile)  
- **arjun@example.com** / password123 (Trader profile)

## Project Structure

```
CRCE-Finance/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   └── uploads/            # File uploads
├── ml-service/             # Python ML service
│   ├── app.py             # Flask application
│   ├── models/            # ML models
│   └── requirements.txt   # Python dependencies
├── database/               # Database utilities
│   ├── seed.js            # Database seeding
│   └── migrations/        # Database migrations
└── docs/                   # Documentation
```

## Features Implemented

### ✅ Core Features
- [x] User authentication (Register/Login/JWT)
- [x] Social feed with posts, likes, comments
- [x] User profiles with badges and achievements
- [x] Financial dashboard with portfolio tracking
- [x] Expense tracking and categorization
- [x] AI expense prediction service
- [x] Financial chatbot for natural language queries
- [x] Group challenges and leaderboards
- [x] Investment clubs and communities
- [x] Real-time notifications (Socket.io setup)

### ✅ Frontend Components
- [x] Responsive dashboard
- [x] Social media feed
- [x] User authentication pages
- [x] Profile management
- [x] Group communities
- [x] Challenge participation
- [x] Settings panel
- [x] Navigation (Navbar + Sidebar)

### ✅ Backend APIs
- [x] Authentication endpoints
- [x] User management
- [x] Post CRUD operations
- [x] Group management
- [x] Challenge system
- [x] Expense tracking
- [x] Financial data endpoints

### ✅ ML Service
- [x] Expense prediction algorithm
- [x] Natural language query processing
- [x] Financial chatbot responses
- [x] Spending pattern analysis
- [x] Category-based predictions
- [x] Personalized recommendations
- [x] Trend analysis

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Posts & Social
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Financial Data
- `GET /api/finance/dashboard` - Get dashboard data
- `GET /api/finance/ai-prediction` - Get AI predictions
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Add new expense

### Chatbot
- `POST /api/chatbot/query` - Process financial query
- `GET /api/chatbot/suggestions` - Get suggested queries

### Groups & Challenges
- `GET /api/groups` - Get investment groups
- `POST /api/groups/:id/join` - Join a group
- `GET /api/challenges` - Get active challenges
- `POST /api/challenges/:id/join` - Join challenge

## Development Workflow

### Making Changes

1. **Frontend Changes**: Edit files in `frontend/src/`, changes auto-reload
2. **Backend Changes**: Edit files in `backend/src/`, server auto-restarts
3. **ML Service Changes**: Edit `ml-service/app.py`, restart Python service

### Adding New Features

1. **New Page**: Create component in `frontend/src/pages/`
2. **New API**: Add route in `backend/src/routes/`
3. **New Model**: Add schema in `backend/src/models/`
4. **New ML Function**: Add to `ml-service/app.py`

### Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests  
cd frontend
npm test

# Test ML service
cd ml-service
python -m pytest tests/
```

## Deployment

### Environment Variables for Production

Update your `.env` files with production values:

- Use strong JWT secrets
- Set production database URLs
- Configure CORS origins
- Set up proper logging

### Docker Deployment (Optional)

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **ML Service Not Working**
   - Install Python dependencies: `pip install -r requirements.txt`
   - Check Python version (3.8+ required)

3. **Frontend Build Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **Port Already in Use**
   - Check if services are already running
   - Kill processes or change ports in `.env`

### Logs

- **Backend logs**: Console output in backend terminal
- **Frontend logs**: Browser developer console
- **ML Service logs**: Python terminal output
- **MongoDB logs**: Check MongoDB log files

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test thoroughly
3. Commit changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/new-feature`
5. Create Pull Request

## Architecture Decisions

### Why This Tech Stack?

- **React**: Modern, component-based UI framework
- **Node.js**: JavaScript across full stack
- **MongoDB**: Flexible document database for social data
- **Python**: Best ecosystem for ML/AI features
- **Socket.io**: Real-time features for social platform

### Security Considerations

- JWT tokens for authentication
- Input validation on all endpoints
- Rate limiting to prevent abuse
- CORS configuration for API access
- Password hashing with bcrypt

## Performance Optimization

- Database indexing for queries
- Image optimization and compression
- API response caching
- Lazy loading for frontend components
- Connection pooling for database

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced ML models
- [ ] Payment gateway integration
- [ ] Video content support
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## Support

For issues or questions:
1. Check this documentation
2. Search existing GitHub issues
3. Create new issue with detailed description
4. Contact the development team

---

**Happy Coding!** 🚀💰