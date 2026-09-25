
import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// =====================================================
// ENVIRONMENT CONFIGURATION
// =====================================================

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const app = express();

const PORT = Number(process.env.PORT) || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const GEMINI_MODEL = "gemini-2.5-flash";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

app.use(express.json({ limit: "2mb" }));

// =====================================================
// AI CLIENTS
// =====================================================

const geminiClient = GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    })
  : null;

const openaiClient = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
  : null;

// =====================================================
// PRAVAH SYSTEM INSTRUCTION
// =====================================================

function getSystemInstruction(context: unknown = {}) {
  return `
You are PRAVAH AI, an intelligent Dam Safety, Flood Prediction,
and Disaster Management Assistant for India.

PRAVAH means:
Predictive Risk Assessment & Vigilance for Aquatic Hazards.

Your responsibilities:

1. Explain dam water levels and reservoir conditions.
2. Explain rainfall, inflow, outflow, and river conditions.
3. Explain flood risk and dam-break preparedness.
4. Provide general evacuation and emergency safety guidance.
5. Help users understand shelters and safe routes.
6. Support disaster management officials and citizens.
7. Support English and Indian languages.
8. Keep responses clear, professional, and easy to understand.
9. Prioritize human safety during emergencies.
10. Never invent real-time emergency information.
11. Clearly state when live information is unavailable.
12. Do not claim that simulated data is real data.
13. Do not provide unsupported exact water levels, alerts, or evacuation locations.

Current system context:
${JSON.stringify(context, null, 2)}

Give a helpful response to the user's question.
For immediate danger, advise the user to follow official emergency
instructions and contact local emergency services.
`;
}

// =====================================================
// HISTORY FORMATTER
// =====================================================

function formatOpenAIHistory(history: unknown[]): ChatCompletionMessageParam[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item: any) => item && typeof item === "object")
    .map((item: any): ChatCompletionMessageParam => {
      const content = String(item.content || item.text || "");

      if (
        item.role === "assistant" ||
        item.role === "model"
      ) {
        return {
          role: "assistant",
          content,
        };
      }

      return {
        role: "user",
        content,
      };
    })
    .filter((item) => {
      return typeof item.content === "string" && item.content.trim().length > 0;
    });
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    system:
      "PRAVAH - AI Dam Break Flood Prediction & Disaster Management System",
    port: PORT,
    openaiConfigured: Boolean(OPENAI_API_KEY),
    openaiModel: OPENAI_MODEL,
    geminiConfigured: Boolean(GEMINI_API_KEY),
    geminiModel: GEMINI_MODEL,
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// OPENAI CHAT
// =====================================================

app.post("/api/openai/chat", async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      context = {},
    } = req.body ?? {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    if (!openaiClient) {
      return res.status(503).json({
        reply:
          "PRAVAH OpenAI service is not configured. Please check the server environment.",
        mode: "offline",
      });
    }

    const formattedHistory = formatOpenAIHistory(history);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: getSystemInstruction(context),
      },
      ...formattedHistory,
      {
        role: "user",
        content: message.trim(),
      },
    ];

    const completion = await openaiClient.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 1000,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "I could not generate a response.";

    console.log("PRAVAH OpenAI response generated.");

    return res.json({
      reply,
      mode: "live",
      provider: "openai",
      model: OPENAI_MODEL,
    });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    return res.status(500).json({
      error: error?.message || "OpenAI request failed.",
      reply:
        "PRAVAH AI is temporarily unavailable. Please try again shortly.",
      mode: "error",
    });
  }
});

// =====================================================
// GEMINI CHAT
// =====================================================

app.post("/api/gemini/chat", async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      context = {},
    } = req.body ?? {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    if (!geminiClient) {
      return res.status(503).json({
        reply:
          "PRAVAH Gemini service is not configured. Please check the server environment.",
        mode: "offline",
      });
    }

    const contents = [
      ...(Array.isArray(history)
        ? history
            .filter((item: any) => item && typeof item === "object")
            .map((item: any) => ({
              role:
                item.role === "assistant" || item.role === "model"
                  ? "model"
                  : "user",
              parts: [
                {
                  text: String(item.content || item.text || ""),
                },
              ],
            }))
        : []),
      {
        role: "user",
        parts: [
          {
            text: message.trim(),
          },
        ],
      },
    ];

    const response = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: getSystemInstruction(context),
        temperature: 0.4,
        maxOutputTokens: 1000,
      },
    });

    const reply = response.text || "No response generated.";

    console.log("PRAVAH Gemini response generated.");

    return res.json({
      reply,
      mode: "live",
      provider: "gemini",
      model: GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      error: error?.message || "Gemini request failed.",
      reply:
        "PRAVAH AI is temporarily unavailable. Please try again shortly.",
      mode: "error",
    });
  }
});

// =====================================================
// OPENAI RISK ANALYSIS
// =====================================================

app.post("/api/openai/risk-analysis", async (req: Request, res: Response) => {
  try {
    const {
      damData = {},
      weatherData = {},
      terrainData = {},
    } = req.body ?? {};

    if (!openaiClient) {
      return res.status(503).json({
        error: "OpenAI API is not configured.",
        mode: "offline",
      });
    }

    const prompt = `
Analyze the following dam and environmental data.

Dam Data:
${JSON.stringify(damData, null, 2)}

Weather Data:
${JSON.stringify(weatherData, null, 2)}

Terrain Data:
${JSON.stringify(terrainData, null, 2)}

Provide a structured educational flood-risk assessment containing:

1. Executive summary
2. Possible risk indicators
3. Important hydrological factors
4. Data limitations
5. General safety recommendations

Do not invent live measurements.
Clearly distinguish simulated data from verified observations.
Do not issue unsupported official warnings or evacuation orders.
`;

    const completion = await openaiClient.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: getSystemInstruction({}),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const analysis =
      completion.choices[0]?.message?.content ||
      "No risk analysis was generated.";

    return res.json({
      analysis,
      mode: "live",
      provider: "openai",
      model: OPENAI_MODEL,
    });
  } catch (error: any) {
    console.error("OpenAI Risk Analysis Error:", error);

    return res.status(500).json({
      error: error?.message || "Risk analysis failed.",
    });
  }
});

// =====================================================
// GEMINI RISK ANALYSIS
// =====================================================

app.post("/api/gemini/risk-analysis", async (req: Request, res: Response) => {
  try {
    const {
      damData = {},
      weatherData = {},
      terrainData = {},
    } = req.body ?? {};

    if (!geminiClient) {
      return res.status(503).json({
        error: "Gemini API is not configured.",
        mode: "offline",
      });
    }

    const prompt = `
Analyze the following dam and environmental data.

Dam Data:
${JSON.stringify(damData, null, 2)}

Weather Data:
${JSON.stringify(weatherData, null, 2)}

Terrain Data:
${JSON.stringify(terrainData, null, 2)}

Provide a structured educational flood-risk assessment containing:

1. Executive summary
2. Possible risk indicators
3. Important hydrological factors
4. Data limitations
5. General safety recommendations

Do not invent live measurements.
Clearly distinguish simulated data from verified observations.
Do not issue unsupported official warnings or evacuation orders.
`;

    const response = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction({}),
        temperature: 0.3,
        maxOutputTokens: 1500,
      },
    });

    return res.json({
      analysis: response.text || "No risk analysis was generated.",
      mode: "live",
      provider: "gemini",
      model: GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error("Gemini Risk Analysis Error:", error);

    return res.status(500).json({
      error: error?.message || "Risk analysis failed.",
    });
  }
});

// =====================================================
// VITE DEVELOPMENT / PRODUCTION SERVER
// =====================================================

async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
        },
        appType: "spa",
      });

      app.use(vite.middlewares);

      console.log("Vite development server enabled.");
    } else {
      const distPath = path.join(process.cwd(), "dist");

      app.use(express.static(distPath));

      app.use((req: Request, res: Response, next) => {
        if (req.path.startsWith("/api")) {
          return next();
        }

        return res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log("==========================================");
      console.log("PRAVAH COMMAND SERVER");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(
        `OpenAI: ${OPENAI_API_KEY ? "CONFIGURED" : "NOT CONFIGURED"}`
      );
      console.log(
        `Gemini: ${GEMINI_API_KEY ? "CONFIGURED" : "NOT CONFIGURED"}`
      );
      console.log(`OpenAI Model: ${OPENAI_MODEL}`);
      console.log(`Gemini Model: ${GEMINI_MODEL}`);
      console.log("==========================================");
    });
  } catch (error) {
    console.error("Server Startup Error:", error);
    process.exit(1);
  }
}

startServer();