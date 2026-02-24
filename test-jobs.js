
import { GoogleGenAI, Type } from "@google/genai";
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
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

const ai = new GoogleGenAI({ apiKey });

async function callAI(model, params, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await ai.models.generateContent({ model, ...params });
        } catch (error) {
            if (error.status === 429 && i < retries - 1) {
                console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
                continue;
            }
            throw error;
        }
    }
}

async function testFetchJobs() {
    try {
        console.log("Fetching jobs...");
        const prompt = `Generate 5 trending tech job listings for ${new Date().getFullYear()}.`;

        const response = await callAI("gemini-2.0-flash", {
            contents: `${prompt}
      For each job, provide a realistic company name, title, location, salary, stack, and a 'postedAt' date.
      Also provide a valid-looking 'applyUrl'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        jobs: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    company: { type: Type.STRING },
                                    location: { type: Type.STRING },
                                    salary: { type: Type.STRING },
                                    type: { type: Type.STRING, enum: ['Full-time', 'Internship', 'Contract'] },
                                    description: { type: Type.STRING },
                                    stack: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    postedAt: { type: Type.STRING },
                                    logo: { type: Type.STRING },
                                    applyUrl: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            },
        });

        // Check response.text property 
        const text = response.text;
        console.log("Raw Text Response:", text ? (text.length > 100 ? text.substring(0, 100) + "..." : text) : "EMPTY");

        if (text) {
            const parsed = JSON.parse(text);
            console.log("Parsed Jobs Count:", parsed.jobs ? parsed.jobs.length : 0);
            if (parsed.jobs && parsed.jobs.length > 0) {
                console.log("First Job:", parsed.jobs[0].title);
            }
        }

    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}

testFetchJobs();
