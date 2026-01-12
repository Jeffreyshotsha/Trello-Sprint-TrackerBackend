// api/index.js - Crash-proof Vercel serverless test
const express = require('express');
const cors = require('cors');

const app = express();

// CORS - Allow everything for testing (tighten later)
app.use(cors({ origin: '*' }));

app.use(express.json());

// Simple root test
app.get('/', (req, res) => res.json({ status: 'Backend is alive on Vercel!' }));

// Temporary placeholder route (replace with your real report logic later)
app.get('/api/report/:boardId', (req, res) => {
  res.json({
    success: true,
    message: 'Test API response - replace with real Trello logic',
    boardId: req.params.boardId,
    totals: { "TO DO": 0, "DOING": 0, "DONE": 0, "NOT DONE": 0 },
    members: [],
    burndown: []
  });
});

// Export for Vercel serverless
module.exports = app;