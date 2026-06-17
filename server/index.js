import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import exportRoutes from "./routes/exportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/ai", aiRoutes);
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Resume Builder API running",
  });
});

app.use("/api/export", exportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});