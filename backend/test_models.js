const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // For 'listModels', we might need to use the model manager if exposed, 
    // but standard SDK usage often is just trying a known model.
    // Actually, the SDK doesn't expose listModels directly on the main class in all versions easily.
    // Let's try to just hit the API with a simple script or try a very standard model 'gemini-1.0-pro'.

    // Let's try 'gemini-1.0-pro' directly in the main app first as it is very likely to exist.
    // If not, I'll print them.

    // Actually, let's keep this script simple to just try a generation with a safe model.

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.0-pro worked:", result.response.text());
    } catch (e) {
        console.error("gemini-1.0-pro failed:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash-latest worked:", result.response.text());
    } catch (e) {
        console.error("gemini-1.5-flash-latest failed:", e.message);
    }
}

listModels();
