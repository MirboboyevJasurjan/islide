import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    preview: { type: String, required: true }, // Preview rasmi
    file_path: { type: String, required: true }, // PPTX fayl yo'li
});

export const Template = mongoose.model("Template", templateSchema);
