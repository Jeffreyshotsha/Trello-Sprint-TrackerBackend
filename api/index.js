// api/index.js - Minimal Express serverless for Vercel
const express = require('express');
const cors = require('cors');

const app = express();

// CORS - allow everything for testing
app.use(cors({ origin: '*' }));

app.use(express.json());

// Simple root test
app.get('/', (req, res) => {
  res.json({ status: 'API is running on Vercel!' });
});

// Your report route (adjust path if needed)
const reportRoutes = require('../routes/report.routes.js');
app.use('/api/report', reportRoutes);

// Export for Vercel
module.exports = app;