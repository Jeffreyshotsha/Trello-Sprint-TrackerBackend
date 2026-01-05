// app.js
import express from "express";
import cors from "cors";  // ← Add this import
import reportRoutes from "./routes/report.routes.js";

const app = express();

const cors = require('cors');

// Allow your deployed frontend (and localhost for dev)
app.use(cors({
  origin: [
    'https://sprint-trackerfrontend.vercel.app',  // ← your Vercel URL
    'http://localhost:5173'                       // keep for local dev
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => res.json({ status: "API is running" }));

// ✅ Connect the report route
app.use("/api/report", reportRoutes);

export default app;