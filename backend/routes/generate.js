import express from "express";
import { getGeminiContent } from "../utils/gemini.js";
import { generatePPTX } from "../utils/pptx.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { topic, slidesCount, template, language } = req.body;

    if (!topic || !slidesCount || !template || !language) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Fetch AI-generated content from Gemini
        const aiContent = await getGeminiContent(topic, slidesCount, language);

        // Generate the presentation
        const templatePath = `./templates/${template}.pptx`;
        const generatedFilePath = await generatePPTX(templatePath, aiContent);

        res.json({
            success: true,
            file: generatedFilePath,
        });
    } catch (error) {
        console.error("Error generating presentation:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
