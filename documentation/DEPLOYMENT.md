# FinFluence Deployment Guide

This guide covers how to properly deploy the FinFluence application while keeping sensitive information secure.

## 🚫 Files That Should NEVER Be Committed

### Environment Files
- `backend/.env`
- `frontend/.env`
- `ml-service/.env`
- `.env` (root level)

### Dependencies
- `node_modules/` (all directories)
- `__pycache__/` (Python cache)
- `venv/` or `env/` (Python virtual environments)

### Build Artifacts
- `frontend/build/`
- `backend/dist/`
- `*.log` files

### User Data
- `backend/uploads/` (user uploaded files)
- `ml-service/models/*.pkl` (trained models)
- Database dumps or backups

### Security
- API keys, JWT secrets, database URLs
- SSL certificates and private keys
- Any file containing passwords or tokens

## ✅ Files That SHOULD Be Committed

### Configuration Templates
- `.env.example` files
- `config.template.js`
- Documentation files

### Source Code
- All `.js`, `.jsx`, `.py` files
- Component files, route handlers
- Database models and schemas

### Project Configuration
- `package.json` and `package-lock.json`
- `requirements.txt`
- Docker files
- CI/CD configuration

### Documentation
- `README.md`
- All files in `docs/`
- API documentation

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables Setup
```bash
# Ensure all services have proper .env files
backend/.env          # Database URLs, JWT secrets, API keys
frontend/.env         # API endpoints, feature flags
ml-service/.env       # ML service configuration
```

### 2. Security Review
- [ ] No hardcoded secrets in source code
- [ ] All sensitive data in environment variables
- [ ] JWT secrets are cryptographically secure
- [ ] Database connections use authentication
- [ ] CORS settings are configured for production

### 3. Build Optimization
```bash
# Frontend production build
cd frontend
npm run build

# Backend dependencies for production
cd backend
npm ci --only=production
```

### 4. Database Setup
```bash
# Run migrations if any
cd database
npm run migrate

# Seed with production data (not test data)
npm run seed:production
```

## 🌐 Deployment Environments

### Development
- Use local MongoDB instance
- Debug logging enabled
- CORS allows localhost origins
- Hot reloading enabled

### Staging
- Use staging database
- Limited logging
- CORS allows staging domains
- Environment mirrors production

### Production
- Use production database with backups
- Error logging only
- CORS restricted to production domains
- SSL/TLS enabled
- Rate limiting enabled

## 📝 Environment Variables Template

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finfluence
JWT_SECRET=your-cryptographically-secure-secret-here
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ML_SERVICE_URL=https://ml.yourdomain.com
REACT_APP_SOCKET_URL=https://api.yourdomain.com
REACT_APP_APP_NAME=FinFluence
```

### ML Service (.env)
```env
FLASK_ENV=production
ML_SERVICE_PORT=5001
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/finfluence_ml
LOG_LEVEL=ERROR
```

## 🐳 Docker Deployment

### Create Dockerfile for each service:

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

**ML Service Dockerfile:**
```dockerfile
FROM python:3.9-alpine
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "app.py"]
```

## 🔐 Security Best Practices

### 1. Secrets Management
- Use environment variables for all secrets
- Consider using secret management services (AWS Secrets Manager, Azure Key Vault)
- Rotate secrets regularly

### 2. Database Security
- Use connection strings with authentication
- Enable SSL/TLS for database connections
- Regular backups with encryption

### 3. API Security
- Implement rate limiting
- Use HTTPS in production
- Validate all inputs
- Implement proper error handling (don't expose internal details)

### 4. Frontend Security
- Build minification and obfuscation
- Content Security Policy headers
- Secure cookie settings

## 📊 Monitoring and Logging

### What to Log
- Authentication attempts
- API errors and exceptions
- Performance metrics
- Security events

### What NOT to Log
- Passwords or tokens
- Personal financial data
- Internal system details in error messages

## 🚀 Deployment Commands

### Using npm scripts:
```bash
# Install all dependencies
npm run install:all

# Build for production
npm run build

# Start production servers
npm run start:prod
```

### Using Docker Compose:
```bash
# Build all services
docker-compose build

# Start in production mode
docker-compose up -d
```

## 📋 Post-Deployment Verification

### Health Checks
- [ ] All services respond to health endpoints
- [ ] Database connections are working
- [ ] Authentication flow works
- [ ] API endpoints return expected responses
- [ ] Frontend loads and functions properly

### Performance Checks
- [ ] Response times are acceptable
- [ ] Memory usage is within limits
- [ ] Database queries are optimized

### Security Checks
- [ ] No sensitive information in logs
- [ ] HTTPS is working properly
- [ ] Rate limiting is active
- [ ] CORS settings are correct

## 🆘 Troubleshooting

### Common Issues
1. **Environment variables not loading**: Check file names and locations
2. **CORS errors**: Verify frontend/backend URL configuration
3. **Database connection fails**: Check connection string and network access
4. **Build failures**: Ensure all dependencies are installed

### Debug Commands
```bash
# Check environment variables
printenv | grep REACT_APP

# Test API connectivity
curl -X GET https://api.yourdomain.com/api/health

# Check service logs
docker logs container_name
```

## 📞 Support

For deployment issues:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure all services can communicate
4. Review the security settings

Remember: **Never commit sensitive information to version control!**