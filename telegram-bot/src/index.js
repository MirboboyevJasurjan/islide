import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";
import generateRoutes from "./routes/generate.js";
import templatesRoutes from "./routes/templates.js";

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("🔴 MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Middleware
app.use(cors());  // Allow external requests (Fix CORS issue)
app.use(express.json());  // Fix body parsing issue
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use("/user", userRoutes);
app.use("/generate-pptx", generateRoutes);  // ✅ Ensure it's `/generate-pptx`
app.use("/templates", templatesRoutes);

// ✅ Test Root Route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
