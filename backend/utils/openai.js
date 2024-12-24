import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function getOpenAIContent(topic, slidesCount, language) {
    const prompt = `Generate a ${slidesCount}-slide presentation in ${language} on the topic "${topic}". Each slide should include:
    1. A header
    2. A title
    3. A short paragraph.`;

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
        });

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error generating OpenAI content:", error.message);
        throw error;
    }
}
