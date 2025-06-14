import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";
import salesRoutes from "./routes/salesRoute.js";
import productRoutes from "./routes/productRoutes.js";
import imageRoutes from "./routes/imageProcessing.js"
import emailGeneratorRoutes from "./routes/emailGenerator.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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
app.use('/api/image', imageRoutes);
app.use('/api/email', emailGeneratorRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is working!");
});


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
