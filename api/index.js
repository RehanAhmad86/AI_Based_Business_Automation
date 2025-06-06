import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";
import salesRoutes from "./routes/salesRoute.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
const aiRouter = express.Router();
aiRouter.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', salesRoutes);
app.use('/api', productRoutes);

// DB connect
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log("MongoDB error ❌", err));
