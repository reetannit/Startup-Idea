require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5001;

// Detect demo mode
const isMongoConfigured = process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>');
const isAIConfigured = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-openai');
const DEMO_MODE = !isMongoConfigured;

if (DEMO_MODE) {
  console.log('⚡ Running in DEMO MODE (in-memory storage, mock AI)');
  console.log('   To use real DB + AI, update MONGODB_URI and OPENAI_API_KEY in .env');
} else {
  // Connect to MongoDB only when configured
  const connectDB = require('./config/db');
  connectDB();
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use('/api/', limiter);

// Routes — choose based on mode
if (DEMO_MODE) {
  app.use('/api/ideas', require('./routes/ideasDemo'));
} else {
  app.use('/api/ideas', require('./routes/ideas'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: DEMO_MODE ? 'demo' : 'production',
    ai: isAIConfigured ? 'openai' : 'mock',
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  if (DEMO_MODE) {
    console.log(`🎭 Demo mode — no external dependencies needed`);
  }
});
