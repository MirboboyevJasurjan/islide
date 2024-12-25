import express from "express";
import { exec } from "child_process";
import path from "path";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { topic, slidesCount, template, language } = req.body;

    // Validate input
    if (!topic || !slidesCount || !template || !language) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Mock data for slides (comment this block when using OpenAI)
    const slidesResponse = {
      slides: [
        {
          header: "Slide 1",
          title: "What is AI?",
          paragraph: "AI refers to...",
        },
        {
          header: "Slide 2",
          title: "Applications",
          paragraph: "AI is used in...",
        },
        {
          header: "Slide 3",
          title: "Challenges",
          paragraph: "Some challenges include...",
        },
      ],
    };
    const slidesJson = JSON.stringify(slidesResponse.slides);

    // File paths
    const __dirname = path.resolve(); // Fix for __dirname
    const templatePath = path.join(__dirname, `../templates/${template}.pptx`);
    const outputPath = path.join(
      __dirname,
      `../generated/${template}_${Date.now()}.pptx`
    );

    // Python command to run the script
    const pythonCommand = `python ${path.join(
      __dirname,
      "./update_pptx.py"
    )} "${templatePath}" '${slidesJson}' "${outputPath}"`;

    console.log(
      "Python script path:",
      path.join(__dirname, "./update_pptx.py")
    );
    console.log("Running Python command:", pythonCommand);

    // Execute the Python script
    exec(pythonCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("Error running Python script:", error.message);
        console.error("Python stderr:", stderr);
        return res
          .status(500)
          .json({ error: "Failed to update PowerPoint template." });
      }

      console.log("Python stdout:", stdout);
      res
        .status(200)
        .json({
          message: "Presentation generated successfully!",
          path: outputPath,
        });
    });
  } catch (err) {
    console.error("Error generating presentation:", err);
    res.status(500).json({ error: "Failed to generate presentation." });
  }
});

export default router;
