# 📁 Project Structure

```
FinFluence/
├── 📁 backend/                    # Node.js/Express API Server
│   ├── 📁 src/
│   │   ├── 📁 controllers/        # Route controllers
│   │   ├── 📁 middleware/         # Custom middleware
│   │   ├── 📁 models/            # MongoDB schemas
│   │   └── 📁 routes/            # API routes
│   ├── 📄 server.js              # Main server file
│   ├── 📄 package.json           # Dependencies & scripts
│   ├── 📄 .env.example           # Environment template
│   └── 📄 .env                   # Environment variables (gitignored)
│
├── 📁 frontend/                   # React.js Frontend
│   ├── 📁 public/                # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable React components
│   │   ├── 📁 context/           # React Context providers
│   │   ├── 📁 pages/             # Page components
│   │   ├── 📁 services/          # API service functions (OPTIONAL, NOT INCLUDED IN THIS PROJECT)
│   │   ├── 📁 utils/             # Utility functions
│   │   ├── 📄 App.js             # Main App component
│   │   ├── 📄 index.js           # React DOM entry point
│   │   └── 📄 index.css          # Global styles (Tailwind)
│   ├── 📄 package.json           # Dependencies & scripts
│   ├── 📄 .env.example           # Environment template
│   └── 📄 .env                   # Environment variables (gitignored)
│
├── 📁 ml-service/                 # Python/Flask ML Service
│   ├── 📁 .venv/                 # Python virtual environment (gitignored)
│   ├── 📄 app.py                 # Main Flask application
│   ├── 📄 requirements.txt       # Python dependencies
│   ├── 📄 .env.example           # Environment template
│   └── 📄 .env                   # Environment variables (gitignored)
│
├── 📁 database/                   # Database utilities
│   ├── 📄 seed.js                # Database seeding script
│   └── 📄 init-db.js             # Database initialization
│
├── 📁 documentation/              # Project documentation
│   ├── 📄 API.md                 # API documentation
│   ├── 📄 DEPLOYMENT.md          # Deployment guide
│   └── 📄 DEVELOPMENT.md         # Development setup
│
├── 📄 README.md                   # Project overview & setup
├── 📄 CONTRIBUTING.md             # Contribution guidelines
├── 📄 LICENSE                     # MIT License
├── 📄 .gitignore                 # Git ignore rules
├── 📄 .gitattributes             # Git attributes
├── 📄 setup.bat                  # Windows setup script
└── 📄 setup.sh                   # Unix setup script
```

## 🔍 Key Directories Explained

### `/backend/src/`
- **`controllers/`** - Business logic handlers for API routes
- **`middleware/`** - Authentication, validation, error handling
- **`models/`** - MongoDB schema definitions (User, Post, Challenge)
- **`routes/`** - Express route definitions organized by feature

### `/frontend/src/`
- **`components/`** - Reusable UI components (Sidebar, Navbar, etc.)
- **`context/`** - React Context for global state (Auth, Theme)
- **`pages/`** - Full page components (Dashboard, Login, etc.)
- **`services/`** - API integration functions
- **`utils/`** - Helper functions and configurations

### `/ml-service/`
- **`app.py`** - Flask server with ML models and chatbot
- **`requirements.txt`** - Python dependencies (scikit-learn, Flask, etc.)
- **`.venv/`** - Isolated Python environment

## 🚀 Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   ML Service    │
│   (React)       │    │   (Express)     │    │   (Flask)       │
│   Port: 3000    │◄──►│   Port: 5000    │◄──►│   Port: 5001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   MongoDB       │    │   ML Models     │
│   (User)        │    │   (Database)    │    │   (Predictions) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Environment Files

Each service has its own environment configuration:

- **`backend/.env`** - Database URI, JWT secrets, API keys
- **`frontend/.env`** - API endpoints, feature flags
- **`ml-service/.env`** - Model configurations, external APIs

## 🔐 Security Notes

- All `.env` files are gitignored
- Use `.env.example` files as templates
- Never commit sensitive credentials
- Environment variables are loaded at startup

## 🛠️ Development Workflow

1. **Setup**: Run setup scripts (`setup.bat` or `setup.sh`)
2. **Development**: Start all three services simultaneously
3. **Testing**: Each service can be tested independently
4. **Deployment**: Services can be deployed separately or together

This structure promotes:
- ✅ **Separation of concerns**
- ✅ **Scalable architecture**
- ✅ **Independent development**
- ✅ **Easy maintenance**
- ✅ **Clear organization**