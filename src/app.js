// app.js (keep everything else the same)
import express from "express";
import cors from "cors";
import reportRoutes from "./routes/report.routes.js";

const app = express();

// Flexible CORS for Vercel previews, production, and local dev
app.use(cors({
  origin: (origin, callback) => {
    // Allow any Vercel domain (includes git-branch previews)
    if (!origin || origin.endsWith('.vercel.app') || origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200  // For legacy browsers
}));

app.use(express.json());

app.get("/", (req, res) => res.json({ status: "API is running" }));

app.use("/api/report", reportRoutes);

export default app;