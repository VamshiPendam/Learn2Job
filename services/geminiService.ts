import { GoogleGenerativeAI, SchemaType, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface RoadmapPhase {
  title: string;
  timeline: string;
  focus: string[];
  details: string;
}

export interface ProductStrategy {
  productName: string;
  currentState: {
    analysis: string;
    strengths: string[];
    weaknesses: string[];
  };
  marketAnalysis: {
    competitors: string[];
    trends: string[];
    differentiation: string;
  };
  roadmap: {
    shortTerm: RoadmapPhase;
    midTerm: RoadmapPhase;
    longTerm: RoadmapPhase;
  };
  technicalUpgrades: string[];
  uxStrategy: string;
  monetization: string;
  risks: {
    risk: string;
    mitigation: string;
  }[];
  kpis: {
    metric: string;
    target: string;
  }[];
}

export interface LearningStep {
  title: string;
  description: string;
  keyTopics: string[];
  estimatedTime: string;
}

export interface LearningRoadmap {
  techName: string;
  objective: string;
  phases: {
    foundations: LearningStep;
    intermediate: LearningStep;
    advanced: LearningStep;
  };
  projects: {
    title: string;
    description: string;
    difficulty: string;
  }[];
  careerPaths: {
    role: string;
    salaryRange: string;
    requiredSkills: string[];
  }[];
  resources: {
    name: string;
    type: string;
    url: string;
  }[];
}

/**
 * Helper to clean and parse JSON from AI response
 */
function safeParseJSON(text: string) {
  try {
    // 1. Remove markdown code blocks if present
    let cleanText = text.replace(/```json\n?|```/g, "").trim();

    // 2. Try direct parse
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      // 3. Try to extract JSON between first { and last }
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        cleanText = cleanText.substring(start, end + 1);
        return JSON.parse(cleanText);
      }
      throw e;
    }
  } catch (e) {
    console.error("JSON Parse Error:", e, "Raw text:", text);
    throw new Error("Failed to parse AI response. Please try again with a different prompt.");
  }
}

/**
 * Generic helper to call Gemini
 */
async function callGemini(prompt: string, schema?: any) {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing!");
    throw new Error("Gemini API key is missing. Please check your .env file.");
  }

  const modelName = "gemini-1.5-flash";

  try {
    const config: any = {
      responseMimeType: "application/json",
    };
    if (schema) config.responseSchema = schema;

    console.log(`Calling Gemini with model: ${modelName} (version: v1)`);

    // Attempt version v1 first
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: config,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ]
    }, { apiVersion: "v1" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from AI.");

    // Explicitly check for error patterns in the text that SDK might not catch as exceptions
    if (text.includes("PERMISSION_DENIED") || text.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API key or permission denied.");
    }

    return safeParseJSON(text);

  } catch (error: any) {
    console.warn("Gemini v1 call failed, attempting v1beta fallback...", error.message);

    try {
      // Fallback to v1beta if v1 fails (common in some regions/keys)
      const betaModel = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          // Schema might not be supported in some v1beta configurations, so we'll try without if it fails
          responseSchema: schema
        },
      }, { apiVersion: "v1beta" });

      const result = await betaModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error("Empty response from AI (v1beta).");
      return safeParseJSON(text);

    } catch (innerError: any) {
      console.error("Gemini v1beta fallback also failed:", innerError.message);

      // Final attempt: try gemini-pro if flash is totally absent
      if (innerError.message.includes("404") || innerError.message.includes("not found")) {
        console.log("Model not found. Final attempt with 'gemini-1.5-pro'...");
        try {
          const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
          const result = await proModel.generateContent(prompt + "\n\nIMPORTANT: Respond with VALID JSON matching this schema: " + JSON.stringify(schema));
          const text = (await result.response).text();
          return safeParseJSON(text);
        } catch (finalError) {
          console.error("All models failed.");
          throw innerError;
        }
      }
      throw innerError;
    }
  }
}

export async function generateLearningRoadmap(techName: string, goal: string): Promise<LearningRoadmap> {
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      techName: { type: SchemaType.STRING },
      objective: { type: SchemaType.STRING },
      phases: {
        type: SchemaType.OBJECT,
        properties: {
          foundations: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              keyTopics: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              estimatedTime: { type: SchemaType.STRING },
            },
            required: ["title", "description", "keyTopics", "estimatedTime"]
          },
          intermediate: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              keyTopics: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              estimatedTime: { type: SchemaType.STRING },
            },
            required: ["title", "description", "keyTopics", "estimatedTime"]
          },
          advanced: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              keyTopics: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              estimatedTime: { type: SchemaType.STRING },
            },
            required: ["title", "description", "keyTopics", "estimatedTime"]
          },
        },
        required: ["foundations", "intermediate", "advanced"]
      },
      projects: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            difficulty: { type: SchemaType.STRING },
          },
          required: ["title", "description", "difficulty"]
        }
      },
      careerPaths: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            role: { type: SchemaType.STRING },
            salaryRange: { type: SchemaType.STRING },
            requiredSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          },
          required: ["role", "salaryRange", "requiredSkills"]
        }
      },
      resources: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            type: { type: SchemaType.STRING },
            url: { type: SchemaType.STRING },
          },
          required: ["name", "type", "url"]
        }
      },
    },
    required: ["techName", "objective", "phases", "projects", "careerPaths", "resources"]
  };

  const prompt = `Act as a senior technology mentor and career expert. Create a hyper-specific, deep-dive learning roadmap for mastering "${techName}".
    Goal: ${goal}
    
    IMPORTANT REQUIREMENTS:
    1. Respond ONLY with a VALID JSON object matching the provided schema.
    2. BE SPECIFIC: Instead of generic topics like "Fundamentals", mention actual libraries, frameworks, syntax (e.g., "React Hooks & Context API", "Rust Ownership & Borrowing").
    3. PHASES: Include specialized deep-dives. Phase 3 should focus on high-scale architecture, performance optimization, and industry-standard security patterns.
    4. PROJECTS: Suggest specific, non-trivial projects (e.g., "Build a distributed key-value store" instead of "Build a web app").
    5. CAREER: Provide realistic salary ranges based on current high-tier global tech markets (SF/London/Remote).`;

  try {
    return await callGemini(prompt, schema);
  } catch (error) {
    console.error("Error generating learning roadmap:", error);
    return generateFallbackLearningRoadmap(techName);
  }
}

function generateFallbackLearningRoadmap(techName: string) {
  const t = techName.toLowerCase();

  // Dynamic keyword mapping for better fallbacks
  const techMap: Record<string, { topics: string[], projects: string[] }> = {
    'react': {
      topics: ['Hooks & Context API', 'Performance Profiling with DevTools', 'Next.js 14 Server Components'],
      projects: ['Personalized E-commerce Dashboard', 'Real-time Analytics Component Library']
    },
    'python': {
      topics: ['AsyncIO & Concurrency', 'Data Science Pipelines (Pandas/NumPy)', 'FastAPI Microservices'],
      projects: ['AI-Driven Sentiment Engine', 'Automated Distributed Task Queue']
    },
    'rust': {
      topics: ['Memory Safety & Borrow Checker', 'WASM Integration', 'Systems Level Optimization'],
      projects: ['Custom Network Protocol Parser', 'High-Performance Search Engine Core']
    },
    'java': {
      topics: ['JVM Internals & GC Tuning', 'Spring Boot Microservices', 'Reactive Programming'],
      projects: ['Cloud-Native Banking API', 'Distributed Cache Implementation']
    },
    'javascript': {
      topics: ['Modern ESNext & TypeScript', 'Node.js Event Loop Mastery', 'Complex State Machines'],
      projects: ['Fullstack real-time collaboration app', 'Custom Framework Middleware']
    }
  };

  const match = Object.keys(techMap).find(k => t.includes(k));
  const specificTopics = match ? techMap[match].topics : [`${techName} Core Architecture`, "Performance Tuning", "Security Best Practices"];
  const specificProjects = match ? techMap[match].projects : [`Enterprise ${techName} Management Solution`, `${techName} Performance Diagnostic Tool`];

  return {
    techName: techName,
    objective: `Master ${techName} to reach expert-level proficiency and architectural mastery.`,
    phases: {
      foundations: {
        title: `${techName} Architecture Foundations`,
        description: `Establish a rock-solid understanding of ${techName} core mechanics and environment setup.`,
        keyTopics: [specificTopics[0], `${techName} Ecosystem Overview`, "Syntax Best Practices"],
        estimatedTime: "2-4 Weeks"
      },
      intermediate: {
        title: `${techName} Systems Engineering`,
        description: `Move from basic syntax to building robust real-world systems with ${techName}.`,
        keyTopics: [specificTopics[1], "Advanced Design Patterns", "Automated Testing"],
        estimatedTime: "4-8 Weeks"
      },
      advanced: {
        title: `${techName} Expert Mastery`,
        description: `Specialized knowledge in high-scale performance, security, and distribution.`,
        keyTopics: [specificTopics[2], "Distributed Systems Scaling", "Security Hardening"],
        estimatedTime: "8-12 Weeks"
      }
    },
    projects: [
      { title: specificProjects[0], description: "A comprehensive project covering core engineering principles.", difficulty: "Intermediate" },
      { title: specificProjects[1], description: "High-level implementation challenging expert architectural skills.", difficulty: "Advanced" }
    ],
    careerPaths: [
      { role: `Senior ${techName} Engineer`, salaryRange: "$140k - $210k", requiredSkills: [techName, "System Design", "Mentoring"] },
      { role: "Technical Architect", salaryRange: "$180k - $250k", requiredSkills: [techName, "Cloud Infrastructure", "Strategic Planning"] }
    ],
    resources: [
      { name: `Official ${techName} Documentation`, type: "Docs", url: "#" },
      { name: `Mastering ${techName} Advanced Patterns`, type: "Course", url: "#" }
    ]
  };
}

export async function generateProductStrategy(productName: string, description: string): Promise<ProductStrategy> {
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      productName: { type: SchemaType.STRING },
      currentState: {
        type: SchemaType.OBJECT,
        properties: {
          analysis: { type: SchemaType.STRING },
          strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          weaknesses: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        },
        required: ["analysis", "strengths", "weaknesses"]
      },
      marketAnalysis: {
        type: SchemaType.OBJECT,
        properties: {
          competitors: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          trends: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          differentiation: { type: SchemaType.STRING },
        },
        required: ["competitors", "trends", "differentiation"]
      },
      roadmap: {
        type: SchemaType.OBJECT,
        properties: {
          shortTerm: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              timeline: { type: SchemaType.STRING },
              focus: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              details: { type: SchemaType.STRING },
            },
            required: ["title", "timeline", "focus", "details"]
          },
          midTerm: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              timeline: { type: SchemaType.STRING },
              focus: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              details: { type: SchemaType.STRING },
            },
            required: ["title", "timeline", "focus", "details"]
          },
          longTerm: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              timeline: { type: SchemaType.STRING },
              focus: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              details: { type: SchemaType.STRING },
            },
            required: ["title", "timeline", "focus", "details"]
          },
        },
        required: ["shortTerm", "midTerm", "longTerm"]
      },
      technicalUpgrades: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      uxStrategy: { type: SchemaType.STRING },
      monetization: { type: SchemaType.STRING },
      risks: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            risk: { type: SchemaType.STRING },
            mitigation: { type: SchemaType.STRING },
          },
          required: ["risk", "mitigation"]
        }
      },
      kpis: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            metric: { type: SchemaType.STRING },
            target: { type: SchemaType.STRING },
          },
          required: ["metric", "target"]
        }
      },
    },
    required: ["productName", "currentState", "marketAnalysis", "roadmap", "technicalUpgrades", "uxStrategy", "monetization", "risks", "kpis"]
  };

  const prompt = `Act as a world-class Product Architect and Market Strategist. Create a hyper-specific, forward-looking technical roadmap for the product: "${productName}".
    Description: ${description}
    
    CRITICAL REQUIREMENTS:
    1. Respond ONLY with a VALID JSON object matching the provided schema.
    2. TECHNICAL HURDLES: Instead of generic speed/scaling, identify actual technical constraints for THIS product (e.g., "WebGPU acceleration", "Vector database indexing for LLMs").
    3. COMPETITIVE EDGE: Provide a unique differentiation strategy based on current market gaps.
    4. KPIS: Use realistic, data-driven targets (e.g., "Reduction in inference latency by 40%" or "Retaining 35% of power users").
    5. USER EXPERIENCE: Suggest specific interface transitions or interaction patterns (e.g., "Command-K palette implementation").`;

  try {
    return await callGemini(prompt, schema);
  } catch (error) {
    console.error("Error generating product strategy:", error);
    return generateFallbackProductStrategy(productName);
  }
}

function generateFallbackProductStrategy(productName: string) {
  const p = productName.toLowerCase();

  // Tech-aware fallback details
  const isAI = p.includes('ai') || p.includes('gpt') || p.includes('llm');
  const techHurdles = isAI ? ["LLM Interference Latency", "Vector DB Optimization", "Context Window Management"] : ["Auto-scaling Cloud Architectures", "High-Throughput API Gateways", "Distributed Database Consistency"];

  return {
    productName: productName,
    currentState: {
      analysis: `Market analysis reveals that ${productName} is entering a high-growth segment with significant demand for ${isAI ? 'intelligent automation' : 'innovative infrastructure'}.`,
      strengths: [`Novel ${isAI ? 'AI' : 'System'} Logic`, "Clear Competitive Niche", "Strong Technical Vision"],
      weaknesses: ["Global Market Awareness", "Infrastructure Elasticity", "Onboarding Conversion"]
    },
    marketAnalysis: {
      competitors: ["Current Market Incumbents", "Segment-Specific Challengers"],
      trends: [isAI ? "Small Language Model (SLM) Efficiency" : "Serverless Edge Computing", "Proactive User Support"],
      differentiation: `Pivoting to ${isAI ? 'deterministic AI outputs' : 'zero-latency operations'} to outperform established market leaders.`
    },
    roadmap: {
      shortTerm: { title: "Strategic MVP Core", timeline: "0-4 Months", focus: ["Core Logic Engine", "Target Segment Validation"], details: `Deploy the foundational version of ${productName} to high-value early adopters.` },
      midTerm: { title: "Ecosystem Expansion", timeline: "4-9 Months", focus: ["High-Impact Integrations", "Security Hardening"], details: `Scale ${productName} by integrating with major enterprise workflows and platforms.` },
      longTerm: { title: "Vertical Domain Authority", timeline: "12+ Months", focus: ["Internal Marketplace", "Global Distribution"], details: `Establish ${productName} as the primary platform for its domain.` }
    },
    technicalUpgrades: [techHurdles[0], techHurdles[1], techHurdles[2]],
    uxStrategy: `Implement ${isAI ? 'proactive AI suggestions' : 'hyper-responsive interactions'} and a minimalist command-palette interface.`,
    monetization: "Hybrid usage-based model with an emphasis on high-throughput enterprise tiers.",
    risks: [{ risk: "Rapid Technological Shift", mitigation: "Modular architecture for fast updates" }],
    kpis: [{ metric: "User Retention Rate", target: "Above 45% (MoM)" }]
  };
}

/**
 * Generates a fallback market pulse when AI quota is exceeded or an error occurs.
 */
function generateFallbackMarketPulse(query: any = '', timeRange: string = '6M') {
  const safeQuery = String(query || '').toLowerCase();
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const currentMonthIdx = new Date().getMonth();

  // Determine number of points based on timeRange
  const points = timeRange === '3M' ? 3 : timeRange === '1Y' ? 12 : 6;

  const chartData = Array.from({ length: points }, (_, i) => {
    const monthIdx = (currentMonthIdx - (points - 1 - i) + 12) % 12;
    const baseGrowth = 30 + Math.random() * 40;
    return {
      month: months[monthIdx],
      growth: Math.round(baseGrowth + i * 5),
      label: `+${Math.round(5 + Math.random() * 15)}%`,
      demandTrend: Math.random() > 0.3 ? "increasing" : "stable",
      timeRate: 4.0 + (i * 0.1)
    };
  });

  let toolSpotlight: any = null;

  // High-quality fallbacks for popular searches
  if (safeQuery.includes('chatgpt')) {
    toolSpotlight = {
      name: "ChatGPT",
      category: "LLM & Conversational AI",
      rating: "5",
      description: "The industry-leading conversational AI by OpenAI.",
      pros: ["Exceptional reasoning", "Massive ecosystem"],
      cons: ["Subscription required", "Hallucinations"],
      industryNeed: "Critical for automation.",
      competitors: ["Claude", "Gemini"],
      useCase: "Coding, content",
      pricing: "Free / $20/mo",
      website: "https://chatgpt.com"
    };
  }

  return {
    timestamp: new Date().toISOString(),
    stats: {
      marketCap: "$1.82T",
      marketCapGrowth: "12.4%",
      activeTools: "14,290",
      weeklyNewTools: "430",
      avgFunding: "$24.5M",
      fundingLabel: "Avg. Series A Funding"
    },
    chartData,
    insights: [
      {
        tag: "Efficiency",
        time: "2h ago",
        title: "LLM inference costs dropping",
        content: "New techniques are lowering barriers."
      }
    ],
    categories: [
      { name: "Language Models", growth: "+82%", percentage: 40 }
    ],
    growingTools: [
      { name: "Sora", growth: "+120%", reason: "Text-to-video breakthrough" },
      { name: "Claude 3.5 Sonnet", growth: "+85%", reason: "Top-tier coding performance" },
      { name: "Perplexity", growth: "+65%", reason: "AI search adoption" },
      { name: "Midjourney v6", growth: "+45%", reason: "Photorealistic generations" }
    ],
    toolSpotlight,
    bestOverallTool: "ChatGPT",
    cagr: "38% CAGR"
  };
}

/**
 * Generates a complete market pulse including trending tools, job shifts, and demand analytics.
 * Supports search query for targeted insights and timeRange for longitudinal data.
 */
export async function synthesizeMarketPulse(query: string = '', timeRange: string = '6M') {
  try {
    const prompt = query
      ? `Generate a deep-dive AI market report for "${query}" over a ${timeRange} period. 
         - Pivot all growth stats and the main chart data specifically to "${query}" for ${timeRange}.
         - Provide exactly ${timeRange === '3M' ? '3' : timeRange === '1Y' ? '12' : '6'} data points in 'chartData' (one per month).
         - Provide a sharp "Industry Need" analysis explaining WHY "${query}" is critical right now.
         - List top market competitors for "${query}".
         - Include relevant market stats (Market Cap effect, Active Solutions, etc.) within the context of "${query}".`
      : `Generate a comprehensive AI market report for the general tech landscape today over a ${timeRange} period. 
         - Provide exactly ${timeRange === '3M' ? '3' : timeRange === '1Y' ? '12' : '6'} data points in 'chartData'.
         - Identify 4 specific "growingTools" that are trending right now with their names, growth %, and a 1-sentence reason.
         - Include broad metrics, growth trends, and trending industry insights.`;

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        timestamp: { type: SchemaType.STRING },
        stats: {
          type: SchemaType.OBJECT,
          properties: {
            marketCap: { type: SchemaType.STRING },
            marketCapGrowth: { type: SchemaType.STRING },
            activeTools: { type: SchemaType.STRING },
            weeklyNewTools: { type: SchemaType.STRING },
            avgFunding: { type: SchemaType.STRING },
            fundingLabel: { type: SchemaType.STRING }
          }
        },
        chartData: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              month: { type: SchemaType.STRING },
              growth: { type: SchemaType.NUMBER },
              label: { type: SchemaType.STRING },
              demandTrend: { type: SchemaType.STRING },
              timeRate: { type: SchemaType.NUMBER }
            }
          }
        },
        insights: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              tag: { type: SchemaType.STRING },
              time: { type: SchemaType.STRING },
              title: { type: SchemaType.STRING },
              content: { type: SchemaType.STRING }
            }
          }
        },
        bestOverallTool: { type: SchemaType.STRING },
        toolSpotlight: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            category: { type: SchemaType.STRING },
            rating: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            pros: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            cons: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            industryNeed: { type: SchemaType.STRING },
            competitors: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            useCase: { type: SchemaType.STRING },
            pricing: { type: SchemaType.STRING },
            website: { type: SchemaType.STRING }
          }
        },
        categories: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              growth: { type: SchemaType.STRING },
              percentage: { type: SchemaType.NUMBER }
            }
          }
        },
        growingTools: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              growth: { type: SchemaType.STRING },
              reason: { type: SchemaType.STRING }
            },
            required: ["name", "growth", "reason"]
          }
        },
        cagr: { type: SchemaType.STRING }
      },
      required: ["timestamp", "stats", "chartData", "insights", "bestOverallTool", "categories", "growingTools", "cagr"]
    };

    return await callGemini(prompt, schema);
  } catch (error) {
    console.error("Error synthesizing market pulse:", error);
    return generateFallbackMarketPulse(query, timeRange);
  }
}

/**
 * Generates a basic fallback roadmap when AI quota is exceeded
 */
function generateFallbackRoadmap(skillName: string) {
  return {
    title: `Learning Path for ${skillName}`,
    subtitle: "AI-Generated Roadmap (Fallback)",
    description: `A structured approach to mastering ${skillName}.`,
    keyTopics: ["Fundamentals", "Intermediate", "Advanced", "Specialization", "Real-world", "Optimization", "Mastery"],
    phases: [
      {
        title: "Phase 1: Progress",
        period: "Duration 1",
        description: "Initial steps.",
        skills: [{ name: "Skill 1", icon: "fa-book", details: "Basics.", criticalSteps: ["1. Step 1", "2. Step 2"], masteryContent: ["Mastery 1"] }]
      }
    ]
  };
}

export async function generateSkillRoadmap(skillName: string) {
  try {
    const prompt = `Create a highly personalized learning roadmap for mastering "${skillName}". Respond ONLY with JSON.`;
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        subtitle: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        keyTopics: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        phases: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              period: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              skills: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    name: { type: SchemaType.STRING },
                    icon: { type: SchemaType.STRING },
                    details: { type: SchemaType.STRING },
                    criticalSteps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    masteryContent: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                  },
                  required: ["name", "icon", "details", "criticalSteps", "masteryContent"]
                }
              }
            },
            required: ["title", "period", "description", "skills"]
          }
        }
      },
      required: ["title", "subtitle", "description", "keyTopics", "phases"]
    };

    return await callGemini(prompt, schema);
  } catch (error) {
    console.error("Error generating skill roadmap:", error);
    return generateFallbackRoadmap(skillName);
  }
}

export async function fetchLatestAITools() {
  try {
    const prompt = "Generate a list of 20 trending and newly launched AI tools.";
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        tools: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              name: { type: SchemaType.STRING },
              category: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
              rating: { type: SchemaType.NUMBER },
              pricing: { type: SchemaType.STRING },
              tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              icon: { type: SchemaType.STRING },
              url: { type: SchemaType.STRING }
            },
            required: ["id", "name", "category", "description", "rating", "pricing", "tags", "icon", "url"]
          }
        }
      },
      required: ["tools"]
    };

    const result = await callGemini(prompt, schema);
    return result?.tools || null;
  } catch (error) {
    console.error("Error fetching AI tools:", error);
    return null;
  }
}

/**
 * Generates high-quality fallback job listings when AI is unavailable.
 */
function generateFallbackJobs(query: string = '', count: number = 20) {
  const companies = ["TechNova", "Stellar AI", "Nexus Systems"];
  return Array.from({ length: count }, (_, i) => ({
    id: `fallback-${i}`,
    title: query || "AI Engineer",
    company: companies[i % 3],
    location: "Remote",
    salary: "$120k",
    type: "Full-time",
    tags: ["Hybrid"],
    description: "Join us.",
    stack: ["React"],
    postedAt: "Just now",
    logo: `https://ui-avatars.com/api/?name=${companies[i % 3]}`,
    applyUrl: "#"
  }));
}

export async function fetchRealTimeJobs(query: string = '') {
  try {
    const prompt = `Generate 20 highly realistic, current job listings for "${query}" positions.`;
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        jobs: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              title: { type: SchemaType.STRING },
              company: { type: SchemaType.STRING },
              location: { type: SchemaType.STRING },
              salary: { type: SchemaType.STRING },
              type: { type: SchemaType.STRING },
              tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              description: { type: SchemaType.STRING },
              stack: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              postedAt: { type: SchemaType.STRING },
              logo: { type: SchemaType.STRING },
              applyUrl: { type: SchemaType.STRING }
            },
            required: ["id", "title", "company", "location", "salary", "type", "tags", "description", "stack", "postedAt", "logo", "applyUrl"]
          }
        }
      },
      required: ["jobs"]
    };

    const result = await callGemini(prompt, schema);
    return result?.jobs || generateFallbackJobs(query, 20);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return generateFallbackJobs(query, 20);
  }
}
