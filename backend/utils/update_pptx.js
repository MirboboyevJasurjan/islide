// backend/utils/updatePptx.js
import { spawn } from "child_process";
import path from "path";

/**
 * Spawns the Python script to update the PPTX file.
 *
 * @param {Object} replacements - Object with placeholder keys and replacement values.
 * @returns {Promise<string>} - Resolves with the success message or throws an error.
 */
export function updatePptx(replacements) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve("update_pptx.py"); // Python script location
    const replacementsJSON = JSON.stringify(replacements); // Convert data to JSON

    const pythonProcess = spawn("python3", [scriptPath, replacementsJSON]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Python process output:", output);
        resolve(output);
      } else {
        console.error("Python process error output:", errorOutput);
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
}
