import { Configuration, OpenAIApi } from "openai";

// Initialize OpenAI configuration
console.log("Using OpenAI API Key:", process.env.OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to generate content using OpenAI
export async function getOpenAIContent(topic, slidesCount, language) {
  const prompt = `
Generate a ${slidesCount}-slide presentation in ${language} on the topic "${topic}". Each slide should include:
1. A header
2. A title
3. A short paragraph.

Respond in JSON format like this:
{
  "slides": [
    { "header": "Header Text", "title": "Title Text", "paragraph": "Paragraph Text" },
    ...
  ]
}
`;

  try {
    // Send request to OpenAI API
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    // Log raw response for debugging
    const rawResponse = response.data.choices[0].message.content;
    console.log("Raw OpenAI Response:", rawResponse);

    // Parse the JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error(
        "Failed to parse OpenAI response as JSON:",
        parseError.message
      );
      console.error("Original Response:", rawResponse);
      throw new Error(
        "OpenAI returned invalid JSON. Please refine the prompt."
      );
    }

    // Return the parsed slides array
    return jsonResponse.slides;
  } catch (error) {
    // Log OpenAI API errors
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch content from OpenAI.");
  }
}
