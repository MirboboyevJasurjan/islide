import mongoose from "mongoose";
import { Template } from "./models/Template.js";
import dotenv from "dotenv";

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB");

        await Template.deleteMany(); // Clear the collection

        const templates = [
            {
                title: "Study Design",
                preview: "/backend/templates/previews/mj.png",
                file_path: "/backend/templates/template1.pptx",
            },
        ];

        await Template.insertMany(templates);
        console.log("Templates seeded!");

        mongoose.connection.close();
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
    });
