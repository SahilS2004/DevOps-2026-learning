const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Book Routes
app.use('/api/books', require('./routes/bookRoutes'));

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

const path = require('path');
const distPath = path.join(__dirname, '../../client/dist');
app.use(express.static(distPath));

// Root Route (optional, just to show something)
app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

module.exports = app;
