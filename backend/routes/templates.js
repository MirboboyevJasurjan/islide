import express from "express";
import { Template } from "../models/Template.js";

const router = express.Router();

// Barcha templatelarni qaytarish
router.get("/", async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;