const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        if (data.models) {
            console.log("--- WORKABLE MODELS ---");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(m.name.replace('models/', ''));
                }
            });
            console.log("-----------------------");
        } else {
            console.log("No models found. Check API Key.", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
