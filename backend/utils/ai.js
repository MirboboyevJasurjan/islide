import { getOpenAIContent } from "./openai.js";
import { getGeminiContent } from "./gemini.js";

export async function getAIContent(topic, slidesCount, language) {
    const provider = process.env.AI_PROVIDER || "openai";

    if (provider === "gemini") {
        console.log("Using Gemini for content generation");
        return await getGeminiContent(topic, slidesCount, language);
    } else {
        console.log("Using OpenAI for content generation");
        return await getOpenAIContent(topic, slidesCount, language);
    }
}