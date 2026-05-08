/**
 * lib/ai.ts — Reusable AI Engine Module
 *
 * Supports two backends (auto-detected from env):
 *   1. OpenAI API          → OPENAI_API_KEY
 *   2. GitHub Models API   → GITHUB_TOKEN  (fallback)
 *
 * Model: gpt-4o-mini
 */

/* ─────────────────────────────────────────
   Config
───────────────────────────────────────── */
const OPENAI_KEY   = process.env.OPENAI_API_KEY  || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN    || "";
const AI_MODEL     = process.env.AI_MODEL        || "gpt-4o-mini";
const TIMEOUT_MS   = 30_000;

// Endpoint selection
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const GITHUB_ENDPOINT = "https://models.inference.ai.azure.com/chat/completions";

const ENDPOINT = OPENAI_KEY  ? OPENAI_ENDPOINT : GITHUB_ENDPOINT;
const API_KEY  = OPENAI_KEY  || GITHUB_TOKEN;

/* ─────────────────────────────────────────
   System prompt — Gaming Expert AI
───────────────────────────────────────── */
const GAMING_SYSTEM_PROMPT = `You are PixelVerse AI — a world-class gaming expert assistant.

Your expertise:
- Deep knowledge of video games across all genres, platforms, and eras
- Understanding of game mechanics, narrative design, and player psychology
- Awareness of current gaming trends, metacritic scores, and community sentiment

Rules you MUST follow:
- Be concise and direct — no filler phrases like "Great question!" or "Certainly!"
- Be accurate — only recommend games that actually exist
- Avoid generic answers — give specific, practical recommendations
- Do NOT hallucinate unknown games, developers, or scores
- Use gaming terminology naturally (e.g., "souls-like", "roguelite", "metroidvania")
- When recommending games, mention WHY they match the user's request
- Keep responses under 200 words unless asked for more detail`;

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;   // override default gaming system prompt
  timeoutMs?: number;
}

export interface AIResponse {
  text: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/* ─────────────────────────────────────────
   Core function: generateAIResponse
───────────────────────────────────────── */
export async function generateAIResponse(
  prompt: string,
  options: AIOptions = {}
): Promise<string> {
  const {
    model       = AI_MODEL,
    temperature = 0.7,
    maxTokens   = 512,
    systemPrompt = GAMING_SYSTEM_PROMPT,
    timeoutMs   = TIMEOUT_MS,
  } = options;

  if (!API_KEY) {
    throw new Error(
      "No AI API key configured. Set OPENAI_API_KEY or GITHUB_TOKEN in .env.local"
    );
  }

  const messages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user",   content: prompt },
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`AI API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();

    // Parse response — OpenAI and GitHub Models share the same schema
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from AI API");

    return text.trim();
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error(`AI request timed out after ${timeoutMs / 1000}s`);
      }
      throw err;
    }
    throw new Error("Unknown AI error");
  } finally {
    clearTimeout(timer);
  }
}

/* ─────────────────────────────────────────
   Multi-turn chat
───────────────────────────────────────── */
export async function generateAIChat(
  messages: AIMessage[],
  options: AIOptions = {}
): Promise<string> {
  const {
    model       = AI_MODEL,
    temperature = 0.7,
    maxTokens   = 512,
    systemPrompt = GAMING_SYSTEM_PROMPT,
    timeoutMs   = TIMEOUT_MS,
  } = options;

  if (!API_KEY) {
    throw new Error("No AI API key configured.");
  }

  const fullMessages: AIMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`AI API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from AI API");
    return text.trim();
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "AbortError") throw new Error(`AI request timed out after ${timeoutMs / 1000}s`);
      throw err;
    }
    throw new Error("Unknown AI error");
  } finally {
    clearTimeout(timer);
  }
}

/* ─────────────────────────────────────────
   Specialized gaming functions
   (use generateAIResponse internally)
───────────────────────────────────────── */

/**
 * Get a game recommendation based on user query
 */
export async function getGameRecommendation(
  query: string,
  availableGames?: string[]
): Promise<string> {
  const context = availableGames?.length
    ? `\n\nGames available in our database: ${availableGames.join(", ")}.
       Prefer recommending from this list when relevant.`
    : "";

  return generateAIResponse(
    `${query}${context}`,
    { temperature: 0.8, maxTokens: 300 }
  );
}

/**
 * Generate a gamer personality profile
 */
export async function getGamerProfile(
  favoriteGames: string[],
  playStyle: string,
  hoursPerWeek: number
): Promise<{
  archetype: string;
  description: string;
  strengths: string[];
  recommendations: string[];
  playstyleScore: Record<string, number>;
}> {
  const prompt = `Analyze this gamer's profile and return ONLY valid JSON (no markdown):
Favorite games: ${favoriteGames.join(", ")}
Play style: ${playStyle}
Hours per week: ${hoursPerWeek}

Return this exact JSON structure:
{
  "archetype": "The [Name]",
  "description": "2-3 sentences about their gaming personality",
  "strengths": ["strength1", "strength2", "strength3"],
  "recommendations": ["Game 1", "Game 2", "Game 3"],
  "playstyleScore": {
    "strategy": 0-100,
    "action": 0-100,
    "exploration": 0-100,
    "social": 0-100,
    "creativity": 0-100
  }
}`;

  const raw = await generateAIResponse(prompt, {
    temperature: 0.75,
    maxTokens: 600,
    systemPrompt: GAMING_SYSTEM_PROMPT,
  });

  // Extract JSON — handle markdown code blocks
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid profile response format");
  return JSON.parse(jsonMatch[0]);
}

/**
 * Get a mood-based game suggestion
 */
export async function getMoodSuggestion(
  mood: string,
  matchingGames: Array<{ title: string; genre: string[] }>
): Promise<string> {
  const gameList = matchingGames
    .map((g) => `${g.title} (${g.genre.join(", ")})`)
    .join(", ");

  return generateAIResponse(
    `I'm feeling ${mood}. Games that match this mood: ${gameList}. 
     Give me one specific recommendation with a 1-2 sentence reason. Be direct.`,
    { temperature: 0.9, maxTokens: 150 }
  );
}

/**
 * Get an AI review for a specific game
 */
export async function getGameReview(
  gameTitle: string,
  genre: string[],
  metacritic?: number | null
): Promise<string> {
  const metaContext = metacritic ? ` (Metacritic: ${metacritic})` : "";
  return generateAIResponse(
    `Write a concise review of "${gameTitle}"${metaContext} — a ${genre.join("/")} game.
     Cover: who should play it, what makes it unique, and one potential downside.
     Max 3 sentences.`,
    { temperature: 0.7, maxTokens: 200 }
  );
}

/* ─────────────────────────────────────────
   Health check
───────────────────────────────────────── */
export async function checkAIHealth(): Promise<{
  online: boolean;
  backend: "openai" | "github" | "none";
  model: string;
}> {
  if (!API_KEY) return { online: false, backend: "none", model: AI_MODEL };

  try {
    await generateAIResponse("Reply with just: ok", {
      maxTokens: 5,
      timeoutMs: 5000,
    });
    return {
      online: true,
      backend: OPENAI_KEY ? "openai" : "github",
      model: AI_MODEL,
    };
  } catch {
    return { online: false, backend: "none", model: AI_MODEL };
  }
}
