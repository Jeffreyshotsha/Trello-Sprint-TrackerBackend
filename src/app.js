// app.js
import express from "express";
import cors from "cors";  // ← Keep this (modern import)
import reportRoutes from "./routes/report.routes.js";

const app = express();

// Use CORS middleware - configure once here
app.use(cors({
  origin: [
    'https://sprint-trackerfrontend.vercel.app',  // Your Vercel frontend
    'http://localhost:5173'                       // Local dev
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => res.json({ status: "API is running" }));

// Connect the report route
app.use("/api/report", reportRoutes);

export default app;