// api/index.js - Minimal Vercel serverless test (no crash possible)
module.exports = (req, res) => {
  res.json({ 
    status: 'Backend is alive on Vercel!',
    message: 'This is a test response - real API coming soon'
  });
};
const express = require('express');
const cors = require('cors');
const reportRoutes = require('../routes/report.routes');

const app = express();

app.use(cors({ origin: '*' })); // temporary
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'API is running on Vercel!' }));

app.use('/api/report', reportRoutes);

module.exports = app;