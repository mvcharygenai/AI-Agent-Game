import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// Real Gemini-powered Agent Step API (Optional live mode in the Sandbox)
app.post("/api/agent/gemini-step", async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured. The game operates in offline simulated mode.",
      });
    }

    const { goal, history, availableTools, currentObservation } = req.body;

    const toolDeclarations = (availableTools || []).map((t: any) => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters || {
        type: "OBJECT",
        properties: {
          query: { type: "STRING", description: "Parameter for action" },
        },
      },
    }));

    const systemInstruction = `You are an AI Agent participating in the AI Agent Game.
Your ultimate goal is: "${goal}".
You reason using the ReAct loop:
1. Provide your internal THOUGHT (reasoning why you are taking the next step).
2. Choose an appropriate TOOL from your available tools to call with precise arguments, or conclude if the goal is completed.
Be concise, strategic, and self-reflective.`;

    const prompt = `Current Observation from environment:
${currentObservation || "No new observation. Mission start."}

History so far:
${JSON.stringify(history || [], null, 2)}

What is your next Thought and Action?`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        tools: toolDeclarations.length > 0 ? [{ functionDeclarations: toolDeclarations }] : undefined,
      },
    });

    const candidate = response.candidates?.[0];
    const functionCalls = response.functionCalls;
    const textOutput = response.text || "";

    res.json({
      thought: textOutput,
      functionCalls: functionCalls || [],
      raw: candidate,
    });
  } catch (error: any) {
    console.error("Gemini Agent step error:", error);
    res.status(500).json({ error: error.message || "Failed to process agent step" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Agent Game server running on port ${PORT}`);
  });
}

startServer();
