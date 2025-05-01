const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth.routes');
const snippetRoutes = require('./routes/snippet.routes');

const app = express();

// CORS allowed origins configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://snip-stash.vercel.app',
  'https://snipstash.vercel.app',
  'https://snipstash-client.vercel.app',
  'https://snip-stash-88nc.vercel.app',
  'https://snip-stash-88nc-cwrwfrk3v-ashmita41s-projects.vercel.app',
  'https://snip-stash-ashmita41.vercel.app',
  // Allow all Vercel preview deployments
  /\.vercel\.app$/
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowedOrigins array
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Check if origin matches any regex pattern (for Vercel preview deployments)
    const matched = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return false;
    });
    
    if (matched) {
      return callback(null, true);
    }
    
    // Log the blocked origin for debugging
    console.log(`Blocked origin: ${origin}`);
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));
app.use(express.json());

// MongoDB Connection Options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to MongoDB
console.log('Attempting to connect to MongoDB Atlas...');
console.log('Database URL:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
    
    // Get the default connection
    const db = mongoose.connection;
    
    // Log database events
    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    db.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    db.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Log database information
    console.log('Connected to database:', db.name);
    console.log('Host:', db.host);
    console.log('Port:', db.port);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Test route to check server status
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running!',
    time: new Date().toISOString(),
    cors: 'enabled',
    origin: req.headers.origin || 'unknown'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables loaded:');
  console.log('- PORT:', process.env.PORT);
  console.log('- MONGODB_URI is set:', !!process.env.MONGODB_URI);
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
  console.log('- JWT_EXPIRE:', process.env.JWT_EXPIRE);
}); 