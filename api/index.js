// api/index.js - Working Vercel serverless Express
const express = require('express');
const cors = require('cors');

// Your report routes (adjust path if needed)
const reportRoutes = require('../routes/report.routes.js');

const app = express();

// CORS: Allow everything for now (tighten later)
app.use(cors({ origin: '*' }));

app.use(express.json());

// Root test
app.get('/', (req, res) => res.json({ status: 'API is running on Vercel!' }));

// Your main API
app.use('/api/report', reportRoutes);

// Export for Vercel
module.exports = app;