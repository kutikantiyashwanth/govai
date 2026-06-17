const fs = require('fs');
const path = require('path');
const { OpenAI } = require("openai");

// Load .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const apiKey = process.env.XAI_API_KEY;

if (!apiKey) {
    console.log("XAI_API_KEY is not set.");
    process.exit(0);
}

const xai = new OpenAI({
    apiKey,
    baseURL: "https://api.x.ai/v1"
});

async function testConnection() {
    console.log("Testing Grok (xAI) Connection...");
    try {
        const completion = await xai.chat.completions.create({
            model: "grok-2-latest",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 5
        });
        console.log("Success! Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Connection Failed:", error.message);
        if (error.code) console.error("Code:", error.code);
    }
}

testConnection();
