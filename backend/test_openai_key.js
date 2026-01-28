const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testKey() {
    console.log("Testing OpenAI Key...");
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Say hello" }],
        });
        console.log("✅ Success! Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("❌ Failed:", error.message);
        if (error.code === 'insufficient_quota') {
            console.log("Reason: You have run out of free credits (Quota Exceeded).");
        }
    }
}

testKey();
