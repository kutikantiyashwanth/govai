const { OpenAI } = require("openai");
const fs = require('fs');
const path = require('path');

// Load .env.local manually to ensure we test with the exact same key as the app
const envPath = path.resolve(__dirname, '.env.local');
let apiKey = process.env.OPENAI_API_KEY;

if (fs.existsSync(envPath)) {
    console.log("Found .env.local");
    const envConfig = fs.readFileSync(envPath, 'utf8');
    const match = envConfig.match(/OPENAI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
        console.log("Loaded API Key from .env.local:", apiKey.substring(0, 8) + "...");
    }
}

if (!apiKey) {
    console.error("ERROR: No OPENAI_API_KEY found.");
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

async function testLive() {
    console.log("Attempting to connect to OpenAI...");
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Are you working?" }],
            max_tokens: 10
        });
        console.log("SUCCESS! API is working.");
        console.log("Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("CONNECTION FAILED.");
        console.error("Error Code:", error.code);
        console.error("Error Type:", error.type);
        console.error("Message:", error.message);

        if (error.code === 'insufficient_quota') {
            console.log("\nDIAGNOSIS: You have run out of credits.");
            console.log("ACTION: Go to https://platform.openai.com/account/billing and add $5.");
        } else if (error.code === 'invalid_api_key') {
            console.log("\nDIAGNOSIS: The API Key is incorrect.");
            console.log("ACTION: Check your key in .env.local");
        }
    }
}

testLive();
