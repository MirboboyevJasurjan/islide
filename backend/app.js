import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import generateRoutes from "./routes/generate.js";
import templatesRoutes from "./routes/templates.js";
import mongoose from "mongoose";

dotenv.config(); // .env faylni o'qish

const app = express();

mongoose
    .connect(process.env.MONGODB_URI) 
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// JSON ma'lumotlarni o'qish uchun middleware
app.use(bodyParser.json());

// API yo‘llarini ulash
app.use("/user", userRoutes);
app.use("/generate", generateRoutes);
app.use("/templates", templatesRoutes);

// Portni sozlash va serverni boshlash
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
