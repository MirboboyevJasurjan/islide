import express from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getOpenAIContent } from "../utils/openai.js"; // Import getOpenAIContent function

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log("🟢 API Request Received:", req.body);
        // Extract input data
        const { topic, slidesCount, template, language } = req.body;
        // Validate input
        if (!topic || !slidesCount || !template || !language) {
            console.log("🔴 Missing required fields!");
            return res.status(400).json({ error: "All fields are required." });
        }

        // Compute __dirname correctly for ES modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename); // e.g. D:\Projects\ai_bot\backend\routes

        // If 'templates' is actually in 'backend/templates', go up one folder
        const templatePath = path.resolve(
            __dirname,
            "../templates",
            `${template}.pptx`
        );

        // If 'generated' is actually in 'backend/generated', go up one folder
        const outputPath = path.resolve(
            __dirname,
            "../generated",
            `${template}_${Date.now()}.pptx`
        );

        // Ensure the "generated" folder exists in 'backend/generated'
        const outputFolder = path.resolve(__dirname, "../generated");
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }

        // Generate slide data using OpenAI
        const slidesData = await getOpenAIContent(topic, slidesCount, language);

        const slidesJson = JSON.stringify(slidesData);
        console.log(" GENERATED SLIDES DATA:", slidesData);
        console.log("🟢 Template Path:", templatePath);
        console.log("🟢 Output Path:", outputPath);

        // If your Python script is in 'backend/utils', go up one folder to get out of 'routes'
        const pythonScriptPath = path.resolve(__dirname, "../utils/update_pptx.py");
        console.log("🟢 Running Python script at:", pythonScriptPath);

        // Virtual Environment Python executable path in 'backend/venv/Scripts/python.exe'
        const venvPythonPath = path.resolve(
            __dirname,
            "../venv",
            "Scripts",
            "python.exe"
        );
        console.log("🟢 Using Python executable at:", venvPythonPath);

        // Spawn the Python process
        const pythonProcess = spawn(venvPythonPath, [
            pythonScriptPath,
            templatePath,
            slidesJson,
            outputPath,
        ]);

        let pythonOutput = "";
        let pythonError = "";

        pythonProcess.stdout.on("data", (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            pythonError += data.toString();
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                console.log("✅ Python script completed successfully!");
                console.log("🟢 Python Output:", pythonOutput);
                res.json({
                    message: "Presentation generated successfully!",
                    path: outputPath,
                });
            } else {
                console.error("🔴 Python script failed!");
                console.error("🔴 Python Error:", pythonError);
                res.status(500).json({
                    error: "Failed to generate PowerPoint presentation.",
                });
            }
        });
    } catch (err) {
        console.error("🔴 API Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;