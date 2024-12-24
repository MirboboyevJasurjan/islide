import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client with your API key
const genAI = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY, // API key from .env file
});

export async function getGeminiContent(topic, slidesCount, language) {
    const prompt = `Generate a ${slidesCount}-slide presentation in ${language} on the topic "${topic}". Each slide should include:
    1. A header
    2. A title
    3. A short paragraph.`;

    try {
        // Specify the model and send the request
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Choose the appropriate Gemini model
        const result = await model.generateContent(prompt);

        console.log("Gemini Response:", result.response.text());
        return result.response.text(); // Return the generated content
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
}
