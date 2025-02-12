// app.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import generateRoutes from "./routes/generate.js";
import templatesRoutes from "./routes/templates.js";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/user", userRoutes);
app.use("/generate-pptx", generateRoutes);
app.use("/templates", templatesRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
