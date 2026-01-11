// api/index.js
const express = require('express');
const cors = require('cors');
const reportRoutes = require('../routes/report.routes'); // adjust path if needed

const app = express();

// Allow all Vercel domains + localhost (safe for now)
app.use(cors({
  origin: '*', // temporary – tighten later to your exact Vercel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Your routes
app.use('/api/report', reportRoutes);

// Simple root check
app.get('/', (req, res) => res.json({ status: 'API is running' }));

// Vercel serverless needs this export
module.exports = app;