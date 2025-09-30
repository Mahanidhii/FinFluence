/**
 * FinFluence Backend Server
 * A social finance platform API built with Express.js and MongoDB
 */

// Core Dependencies
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Security & Performance Middleware
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Route Handlers
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const postRoutes = require('./src/routes/posts');
const groupRoutes = require('./src/routes/groups');
const challengeRoutes = require('./src/routes/challenges');
const expenseRoutes = require('./src/routes/expenses');
const financeRoutes = require('./src/routes/finance');
const chatbotRoutes = require('./src/routes/chatbot');

// Custom Middleware
const errorHandler = require('./src/middleware/errorHandler');

// Initialize Express Application
const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// MIDDLEWARE SETUP
// ====================

// Trust proxy for accurate client IP (required for rate limiting)
app.set('trust proxy', 1);

// Rate Limiting Configuration
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes default
  max: process.env.RATE_LIMIT_MAX || 100, // Max requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Security Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Response compression
app.use(morgan('combined')); // HTTP request logging
app.use(limiter); // Apply rate limiting

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] // Replace with actual production domain
    : ['http://localhost:3000'], // Development frontend URL
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' })); // JSON body parser with size limit
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser

// Static files (for uploaded images)
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finfluence', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 FinFluence API Server',
    version: '1.0.0',
    documentation: '/api/docs',
    status: 'Running'
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Socket.io setup for real-time features
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] 
      : ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle real-time notifications
  socket.on('notification', (data) => {
    socket.to(data.userId).emit('notification', data);
  });

  // Handle challenge updates
  socket.on('challenge_update', (data) => {
    socket.broadcast.emit('challenge_update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

module.exports = app;