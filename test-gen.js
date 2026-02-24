
import OpenAI from "openai";
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_OPENAI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local", e);
}

if (!apiKey) {
    console.error("API Key not found!");
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

async function testGen() {
    try {
        console.log("Testing generation with gpt-4o-mini...");
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Say hello" }],
        });

        console.log("Response:", response.choices[0].message.content);
        console.log("Full response structure:", JSON.stringify(response, null, 2));

    } catch (error) {
        console.error("Error generating content:", error);
    }
}

testGen();
