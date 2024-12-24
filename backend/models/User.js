import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    telegram_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    language: { type: String, default: "en" },
    coins: { type: Number, default: 0 },
    referals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    template: { type: String, default: null }, // Tanlangan template ID
    slidesCount: { type: Number, default: 10 }, // Slaydlar soni
});

export const User = mongoose.model("User", userSchema);
