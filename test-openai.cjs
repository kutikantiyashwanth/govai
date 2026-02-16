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

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

async function testConnection() {
    console.log("Testing OpenAI Connection...");
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 5
        });
        console.log("Success! Response:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Connection Failed:", error.message);
        console.error("Code:", error.code);
        console.error("Type:", error.type);
    }
}

testConnection();
