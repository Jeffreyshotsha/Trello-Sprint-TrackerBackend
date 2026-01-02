// app.js
import express from "express";
import cors from "cors";  // ← Add this import
import reportRoutes from "./routes/report.routes.js";

const app = express();

// ✅ Enable CORS for your frontend (localhost:5173)
app.use(cors({
  origin: "http://localhost:5173",  // Allow only your Vite frontend
  credentials: true
}));

// Or simpler (allows all origins during development):
// app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.json({ status: "API is running" }));

// ✅ Connect the report route
app.use("/api/report", reportRoutes);

export default app;