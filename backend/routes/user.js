import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

// Foydalanuvchini qo‘shish yoki yangilash
router.post("/", async (req, res) => {
    const { telegram_id, name, language } = req.body;

    try {
        let user = await User.findOne({ telegram_id });
        if (!user) {
            user = new User({ telegram_id, name, language });
        } else {
            user.name = name || user.name;
            user.language = language || user.language;
        }
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Foydalanuvchi ma'lumotlarini olish
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ telegram_id: req.params.id });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
