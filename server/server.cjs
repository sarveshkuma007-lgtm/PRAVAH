
require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use(express.json({ limit: "1mb" }));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

// -----------------------------------------
// Health Check
// -----------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PRAVAH AI backend is running",
    providers: {
      openai: Boolean(process.env.OPENAI_API_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
    },
  });
});

// -----------------------------------------
// Validate Messages
// -----------------------------------------

function getMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message &&
        typeof message.content === "string" &&
        ["user", "assistant", "system"].includes(message.role)
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0);
}

// -----------------------------------------
// OpenAI Function
// -----------------------------------------

async function askOpenAI(messages) {
  if (!openai) {
    throw new Error("OpenAI API key is missing.");
  }

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages,
    temperature: 0.3,
  });

  return (
    response.choices?.[0]?.message?.content ||
    "OpenAI returned an empty response."
  );
}

// -----------------------------------------
// Gemini Function
// -----------------------------------------

async function askGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const systemInstruction = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n");

  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: message.content,
        },
      ],
    }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(systemInstruction
          ? {
              systemInstruction: {
                parts: [
                  {
                    text: systemInstruction,
                  },
                ],
              },
            }
          : {}),
        contents,
        generationConfig: {
          temperature: 0.3,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Gemini API request failed."
    );
  }

  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || "Gemini returned an empty response."
  );
}

// -----------------------------------------
// Chat Endpoint
// -----------------------------------------

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, provider = "both" } = req.body;

    const validMessages = getMessages(messages);

    if (validMessages.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one valid message is required.",
      });
    }

    if (!["openai", "gemini", "both"].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: "Provider must be openai, gemini, or both.",
      });
    }

    const results = {};

    if (provider === "openai" || provider === "both") {
      try {
        results.openai = await askOpenAI(validMessages);
      } catch (error) {
        console.error("OpenAI error:", error.message);
        results.openaiError = error.message;
      }
    }

    if (provider === "gemini" || provider === "both") {
      try {
        results.gemini = await askGemini(validMessages);
      } catch (error) {
        console.error("Gemini error:", error.message);
        results.geminiError = error.message;
      }
    }

    const hasResponse = Boolean(results.openai || results.gemini);

    if (!hasResponse) {
      return res.status(502).json({
        success: false,
        error: "Both AI providers failed.",
        details: results,
      });
    }

    return res.json({
      success: true,
      provider,
      responses: results,
    });
  } catch (error) {
    console.error("Chat server error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
});

// -----------------------------------------
// Start Server
// -----------------------------------------

app.listen(PORT, () => {
  console.log(`PRAVAH AI backend running at http://localhost:${PORT}`);
});