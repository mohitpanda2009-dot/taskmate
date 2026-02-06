const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const chatRoutes = require('./routes/chats');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviews');
const walletRoutes = require('./routes/wallet');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security ──
app.use(helmet());

// ── CORS ──
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Request Logging ──
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ── Static Files (uploads) ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health Check ──
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Taskmate API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── API Routes ──
const prefix = process.env.API_PREFIX || '/api';

app.use(`${prefix}/auth`, authRoutes);
app.use(`${prefix}/users`, userRoutes);
app.use(`${prefix}/tasks`, taskRoutes);
app.use(`${prefix}/chats`, chatRoutes);
app.use(`${prefix}/notifications`, notificationRoutes);
app.use(`${prefix}/reviews`, reviewRoutes);
app.use(`${prefix}/wallet`, walletRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Error Handler ──
app.use(errorHandler);

module.exports = app;
