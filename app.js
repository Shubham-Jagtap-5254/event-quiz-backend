require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Initialize App
const app = express();

// Connect Database with retries (no crash)
connectDB().catch(() => {
  console.log('Initial DB connect failed - server continues (retries ongoing)');
});

// Debugging Middleware: Log every request and its Origin
app.use((req, res, next) => {
  const origin = req.headers.origin || "No Origin Header";
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${origin}`);
  next();
});

// Middleware
const corsOptions = {
  origin: true, // Dynamically allow the origin of the request (useful for matching subdomains/Firebase URLs)
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/leads-legacy', require('./routes/authRoutes')); // Keep existing email OTP if needed

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;