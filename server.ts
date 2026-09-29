import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// =====================================================
// PRAVAH DATA
// =====================================================

import { DAMS_DATA } from "./src/data/damData";
import { MOCK_ALERTS } from "./src/data/mockAlerts";
import {
  MOCK_SIMULATION_DATA,
  MOCK_SHELTERS,
  MOCK_RESCUE_TEAMS,
} from "./src/data/mockSimulationData";

// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const app = express();

const PORT = Number(process.env.PORT) || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// =====================================================
// AI MODELS
// =====================================================

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const OPENAI_MODEL =
  process.env.OPENAI_MODEL || "gpt-4o-mini";

app.use(
  express.json({
    limit: "4mb",
  }),
);

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
// PRAVAH AI DATA
// =====================================================

function getPRAVAHData() {
  return {
    dams: DAMS_DATA,

    alerts: MOCK_ALERTS,

    floodPrediction: MOCK_SIMULATION_DATA,

    shelters: MOCK_SHELTERS,

    rescueTeams: MOCK_RESCUE_TEAMS,
  };
}

// =====================================================
// PRAVAH SYSTEM INSTRUCTION
// =====================================================

function getSystemInstruction(context: any = {}) {
  const pravahData = getPRAVAHData();

  return `
You are PRAVAH AI, the intelligent assistant inside the
PRAVAH Dam Break Flood Prediction & Disaster Management System.

PRAVAH means:

Predictive Risk Assessment & Vigilance for Aquatic Hazards.

==================================================
YOUR ROLE
==================================================

You are the AI assistant for the PRAVAH application.

You can answer questions about the actual information
available inside this PRAVAH application.

You can explain:

• Dams
• Reservoir levels
• Storage percentage
• Warning levels
• Danger levels
• Inflow
• Outflow
• Gates
• Structural health
• Risk level
• River
• State
• District
• Downstream population
• Dam location
• Emergency contacts
• Flood prediction
• Flood arrival times
• Simulated flood depth
• Simulated affected population
• Active alerts
• Shelters
• Shelter occupancy
• Shelter capacity
• Shelter facilities
• Rescue teams
• Emergency response
• Safe routes
• General flood safety
• PRAVAH features

==================================================
VERY IMPORTANT
==================================================

The PRAVAH DATA section contains the application's
available data.

USE THIS DATA when answering PRAVAH-related questions.

Do NOT invent values.

Do NOT make up dam measurements.

Do NOT make up shelter locations.

Do NOT make up alerts.

Do NOT make up rescue teams.

Do NOT make up flood prediction values.

If the requested information is not available,
say:

"That information is not currently available in PRAVAH."

==================================================
DAM QUESTIONS
==================================================

If the user asks:

"Tell me about Hirakud"

or

"Tell me everything about Hirakud Dam"

find Hirakud Dam in the DAMS DATA.

Give a useful structured answer.

Include, when available:

1. Dam name
2. River
3. State
4. District
5. Current water level
6. Full reservoir level
7. Warning level
8. Danger level
9. Storage percentage
10. Inflow
11. Outflow
12. Gates open / total gates
13. Structural health
14. Risk level
15. Downstream population
16. Nearest town
17. Emergency contact
18. Construction year
19. Dam type
20. Height

Do the same for:

Tehri Dam
Hirakud Dam
Sardar Sarovar Dam
Bhakra Dam
Rihand Dam
Idukki Dam
Nagarjuna Sagar Dam
Koyna Dam

==================================================
DAM COMPARISON
==================================================

If the user asks:

"Which dams are critical?"

show the dams whose PRAVAH riskLevel is CRITICAL.

If the user asks:

"Show high risk dams"

show dams with HIGH riskLevel.

If the user asks:

"Compare Hirakud and Tehri"

compare their actual available values.

Do not invent missing values.

==================================================
ALERTS
==================================================

If the user asks:

"What alerts are active?"

use the actual MOCK_ALERTS data.

Summarize active alerts.

Include:

• Severity
• Title
• Location
• Dam
• Description
• Recommended action
• Status

Do not create additional alerts.

==================================================
SHELTERS
==================================================

If the user asks:

"Find shelters"

or

"Tell me about shelters"

use MOCK_SHELTERS.

Give:

• Shelter name
• Location
• Capacity
• Current occupancy
• Available capacity
• Status
• Facilities
• Contact
• Elevation
• Safe-from-breach status

Do not invent shelters.

==================================================
FLOOD PREDICTION
==================================================

MOCK_SIMULATION_DATA contains simulation information.

IMPORTANT:

This is SIMULATION DATA.

Never describe simulation results as confirmed live
measurements.

Use terms such as:

"simulation"
"predicted"
"modelled"
"scenario"

when appropriate.

==================================================
SAFETY
==================================================

For emergency questions:

• Give concise safety guidance.
• Encourage following official emergency instructions.
• Do not invent official evacuation orders.
• Do not claim that a person is in immediate danger
  unless supported by the supplied PRAVAH alert/context.
• For immediate emergencies, recommend contacting
  appropriate local emergency services.

==================================================
CURRENT USER CONTEXT
==================================================

${JSON.stringify(context, null, 2)}

==================================================
ACTUAL PRAVAH APPLICATION DATA
==================================================

${JSON.stringify(pravahData, null, 2)}

==================================================
ANSWER STYLE
==================================================

Be:

• Accurate
• Professional
• Helpful
• Concise
• Easy to understand

If the user asks "everything", provide a structured,
detailed answer.

Do not respond with only:

"I can help with dams."

Actually answer the question using the supplied data.

For numerical information preserve the application's units.

Example:

Water Level: 191.15 m
Storage: 94.6%
Inflow: 4,200 cumecs
Outflow: 4,600 cumecs
Gates: 24 / 64 open

IMPORTANT:

The supplied PRAVAH data represents application data.
Do not claim that it is independently verified live
government data unless explicitly stated.

==================================================
CONTEXT AWARENESS
==================================================

Use the user's current context when relevant.

If the user asks:

"What is the nearest shelter?"

use the nearest shelter information in context
and the shelter dataset.

If the user asks:

"What dam is near me?"

use the available location context.

If the user asks:

"Will this dam affect downstream areas?"

use the dam's downstream population and available
flood simulation information where relevant.

==================================================
LANGUAGE
==================================================

Respond in the language requested by the user.

If the user is using Hindi, respond in Hindi.

If the user is using English, respond in English.

If another supported Indian language is requested,
respond in that language when possible.

==================================================
FINAL RULE
==================================================

You are not an offline chatbot.

You are connected to the Gemini API.

Use Gemini reasoning together with the supplied
PRAVAH application data to answer the user's question.
`;
}

// =====================================================
// HISTORY FORMATTER
// =====================================================

function formatOpenAIHistory(
  history: unknown[],
): ChatCompletionMessageParam[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item: any) =>
        item &&
        typeof item === "object",
    )
    .map(
      (item: any): ChatCompletionMessageParam => {
        const content = String(
          item.content ||
            item.text ||
            "",
        );

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
      },
    )
    .filter(
      (item) =>
        typeof item.content === "string" &&
        item.content.trim().length > 0,
    );
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  (_req: Request, res: Response) => {
    res.json({
      status: "ok",

      system:
        "PRAVAH - AI Dam Break Flood Prediction & Disaster Management System",

      port: PORT,

      openaiConfigured:
        Boolean(OPENAI_API_KEY),

      openaiModel:
        OPENAI_MODEL,

      geminiConfigured:
        Boolean(GEMINI_API_KEY),

      geminiModel:
        GEMINI_MODEL,

      pravahDataLoaded: true,

      damCount:
        DAMS_DATA.length,

      alertCount:
        MOCK_ALERTS.length,

      shelterCount:
        MOCK_SHELTERS.length,

      timestamp:
        new Date().toISOString(),
    });
  },
);

// =====================================================
// OPENAI CHAT
// =====================================================

app.post(
  "/api/openai/chat",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        message,
        history = [],
        context = {},
      } = req.body ?? {};

      if (
        !message ||
        typeof message !== "string"
      ) {
        return res.status(400).json({
          error:
            "Message is required.",
        });
      }

      if (!openaiClient) {
        return res.status(503).json({
          reply:
            "PRAVAH OpenAI service is not configured. Please check the server environment.",

          mode: "offline",
        });
      }

      const recentHistory =
        Array.isArray(history)
          ? history.slice(-4)
          : [];

      const formattedHistory =
        formatOpenAIHistory(
          recentHistory,
        );

      const messages: ChatCompletionMessageParam[] =
        [
          {
            role: "system",
            content:
              getSystemInstruction(
                context,
              ),
          },

          ...formattedHistory,

          {
            role: "user",
            content: message.trim(),
          },
        ];

      const completion =
        await openaiClient.chat.completions.create(
          {
            model:
              OPENAI_MODEL,

            messages,

            temperature: 0.3,

            max_tokens: 800,
          },
        );

      const reply =
        completion
          .choices[0]
          ?.message
          ?.content ||
        "I could not generate a response.";

      return res.json({
        reply,

        mode: "live",

        provider: "openai",

        model:
          OPENAI_MODEL,
      });
    } catch (error: any) {
      console.error(
        "OpenAI API Error:",
        error,
      );

      return res.status(500).json({
        error:
          error?.message ||
          "OpenAI request failed.",

        reply:
          "PRAVAH AI is temporarily unavailable. Please try again shortly.",

        mode: "error",
      });
    }
  },
);

// =====================================================
// GEMINI CHAT
// =====================================================

app.post(
  "/api/gemini/chat",
  async (
    req: Request,
    res: Response,
  ) => {
    const requestStartedAt =
      Date.now();

    try {
      const {
        message,
        history = [],
        context = {},
      } = req.body ?? {};

      if (
        !message ||
        typeof message !== "string"
      ) {
        return res.status(400).json({
          error:
            "Message is required.",
        });
      }

      if (!geminiClient) {
        return res.status(503).json({
          reply:
            "PRAVAH AI is not configured. Please check GEMINI_API_KEY in the server environment.",

          mode: "error",
        });
      }

      // -----------------------------------------------
      // RECENT HISTORY
      // -----------------------------------------------

      const recentHistory =
        Array.isArray(history)
          ? history.slice(-6)
          : [];

      const contents = [
        ...recentHistory
          .filter(
            (item: any) =>
              item &&
              typeof item ===
                "object",
          )
          .map(
            (item: any) => ({
              role:
                item.role ===
                  "assistant" ||
                item.role ===
                  "model"
                  ? "model"
                  : "user",

              parts: [
                {
                  text: String(
                    item.content ||
                      item.text ||
                      "",
                  ),
                },
              ],
            }),
          ),

        {
          role: "user",

          parts: [
            {
              text:
                message.trim(),
            },
          ],
        },
      ];

      // -----------------------------------------------
      // BUILD REAL PRAVAH CONTEXT
      // -----------------------------------------------

      const aiContext = {
        userContext:
          context,

        application:
          "PRAVAH",

        dataAvailable: {
          dams:
            DAMS_DATA.length,

          alerts:
            MOCK_ALERTS.length,

          shelters:
            MOCK_SHELTERS.length,

          rescueTeams:
            MOCK_RESCUE_TEAMS.length,

          floodSimulation:
            true,
        },
      };

      console.log(
        "==========================================",
      );

      console.log(
        "PRAVAH GEMINI REQUEST",
      );

      console.log(
        "Question:",
        message.trim(),
      );

      console.log(
        "Dam data:",
        DAMS_DATA.length,
      );

      console.log(
        "Alert data:",
        MOCK_ALERTS.length,
      );

      console.log(
        "Shelter data:",
        MOCK_SHELTERS.length,
      );

      console.log(
        "==========================================",
      );

      // -----------------------------------------------
      // GEMINI
      // -----------------------------------------------

      const response =
        await geminiClient.models.generateContent(
          {
            model:
              GEMINI_MODEL,

            contents,

            config: {
              systemInstruction:
                getSystemInstruction(
                  aiContext,
                ),

              maxOutputTokens: 800,

              temperature: 0.2,
            },
          },
        );

      const reply =
        response.text ||
        "No response generated.";

      const elapsed =
        Date.now() -
        requestStartedAt;

      console.log(
        `PRAVAH Gemini response generated using ${GEMINI_MODEL}.`,
      );

      console.log(
        `PRAVAH Gemini response time: ${elapsed}ms`,
      );

      return res.json({
        reply,

        mode: "live",

        provider:
          "Gemini",

        model:
          GEMINI_MODEL,

        responseTimeMs:
          elapsed,
      });
    } catch (error: any) {
      const elapsed =
        Date.now() -
        requestStartedAt;

      console.error(
        "==========================================",
      );

      console.error(
        "PRAVAH GEMINI ERROR",
      );

      console.error(
        error,
      );

      console.error(
        `Failed after ${elapsed}ms`,
      );

      console.error(
        "==========================================",
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Gemini request failed.",

        reply:
          "PRAVAH AI is temporarily unavailable. Please try again shortly.",

        mode: "error",

        responseTimeMs:
          elapsed,
      });
    }
  },
);

// =====================================================
// OPENAI RISK ANALYSIS
// =====================================================

app.post(
  "/api/openai/risk-analysis",
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const {
        damData = {},
        weatherData = {},
        terrainData = {},
      } = req.body ?? {};

      if (!openaiClient) {
        return res.status(503).json({
          error:
            "OpenAI API is not configured.",
        });
      }

      const prompt = `
Analyze the following dam and environmental data.

Dam Data:
${JSON.stringify(
  damData,
  null,
  2,
)}

Weather Data:
${JSON.stringify(
  weatherData,
  null,
  2,
)}

Terrain Data:
${JSON.stringify(
  terrainData,
  null,
  2,
)}

Provide:

1. Executive summary
2. Risk indicators
3. Hydrological factors
4. Data limitations
5. General safety recommendations

Do not invent live measurements.
Clearly distinguish simulation from verified observations.
`;

      const completion =
        await openaiClient.chat.completions.create(
          {
            model:
              OPENAI_MODEL,

            messages: [
              {
                role: "system",
                content:
                  getSystemInstruction(
                    {},
                  ),
              },

              {
                role: "user",
                content:
                  prompt,
              },
            ],

            temperature: 0.3,

            max_tokens: 1000,
          },
        );

      const analysis =
        completion
          .choices[0]
          ?.message
          ?.content ||
        "No risk analysis was generated.";

      return res.json({
        analysis,

        mode: "live",

        provider:
          "openai",

        model:
          OPENAI_MODEL,
      });
    } catch (error: any) {
      console.error(
        "OpenAI Risk Analysis Error:",
        error,
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Risk analysis failed.",
      });
    }
  },
);

// =====================================================
// GEMINI RISK ANALYSIS
// =====================================================

app.post(
  "/api/gemini/risk-analysis",
  async (
    req: Request,
    res: Response,
  ) => {
    const requestStartedAt =
      Date.now();

    try {
      const {
        damData = {},
        weatherData = {},
        terrainData = {},
      } = req.body ?? {};

      if (!geminiClient) {
        return res.status(503).json({
          error:
            "PRAVAH AI is not configured.",
        });
      }

      const prompt = `
Analyze the following dam and environmental data.

Dam Data:
${JSON.stringify(
  damData,
  null,
  2,
)}

Weather Data:
${JSON.stringify(
  weatherData,
  null,
  2,
)}

Terrain Data:
${JSON.stringify(
  terrainData,
  null,
  2,
)}

Provide:

1. Executive summary
2. Possible risk indicators
3. Important hydrological factors
4. Data limitations
5. General safety recommendations

Do not invent live measurements.

Clearly distinguish simulated data from verified observations.

Do not issue unsupported official warnings or
evacuation orders.
`;

      console.log(
        `PRAVAH AI risk analysis using model: ${GEMINI_MODEL}`,
      );

      const response =
        await geminiClient.models.generateContent(
          {
            model:
              GEMINI_MODEL,

            contents:
              prompt,

            config: {
              systemInstruction:
                getSystemInstruction(
                  {},
                ),

              maxOutputTokens:
                1000,

              temperature: 0.2,
            },
          },
        );

      const analysis =
        response.text ||
        "No risk analysis was generated.";

      const elapsed =
        Date.now() -
        requestStartedAt;

      console.log(
        `PRAVAH AI risk analysis generated successfully using ${GEMINI_MODEL}.`,
      );

      console.log(
        `PRAVAH AI risk analysis time: ${elapsed}ms`,
      );

      return res.json({
        analysis,

        mode: "live",

        provider:
          "Gemini",

        model:
          GEMINI_MODEL,

        responseTimeMs:
          elapsed,
      });
    } catch (error: any) {
      const elapsed =
        Date.now() -
        requestStartedAt;

      console.error(
        "Gemini Risk Analysis Error:",
        error,
      );

      return res.status(500).json({
        error:
          error?.message ||
          "Risk analysis failed.",

        responseTimeMs:
          elapsed,
      });
    }
  },
);

// =====================================================
// VITE DEVELOPMENT / PRODUCTION
// =====================================================

async function startServer() {
  try {
    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      const vite =
        await createViteServer({
          server: {
            middlewareMode:
              true,
          },

          appType: "spa",
        });

      app.use(
        vite.middlewares,
      );

      console.log(
        "Vite development server enabled.",
      );
    } else {
      const distPath =
        path.join(
          process.cwd(),
          "dist",
        );

      app.use(
        express.static(
          distPath,
        ),
      );

      app.use(
        (
          req: Request,
          res: Response,
          next,
        ) => {
          if (
            req.path.startsWith(
              "/api",
            )
          ) {
            return next();
          }

          return res.sendFile(
            path.join(
              distPath,
              "index.html",
            ),
          );
        },
      );
    }

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          "==========================================",
        );

        console.log(
          "PRAVAH COMMAND SERVER",
        );

        console.log(
          `Server: http://localhost:${PORT}`,
        );

        console.log(
          `OpenAI: ${
            OPENAI_API_KEY
              ? "CONFIGURED"
              : "NOT CONFIGURED"
          }`,
        );

        console.log(
          `Gemini: ${
            GEMINI_API_KEY
              ? "CONFIGURED"
              : "NOT CONFIGURED"
          }`,
        );

        console.log(
          `Gemini model: ${GEMINI_MODEL}`,
        );

        console.log(
          `Dams loaded: ${DAMS_DATA.length}`,
        );

        console.log(
          `Alerts loaded: ${MOCK_ALERTS.length}`,
        );

        console.log(
          `Shelters loaded: ${MOCK_SHELTERS.length}`,
        );

        console.log(
          "AI service: PRAVAH AI + Gemini",
        );

        console.log(
          "==========================================",
        );
      },
    );
  } catch (error) {
    console.error(
      "Server Startup Error:",
      error,
    );

    process.exit(1);
  }
}

startServer();