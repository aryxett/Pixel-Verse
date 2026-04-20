/**
 * GitHub Models AI integration
 * Uses GitHub Models API (OpenAI-compatible) with gpt-4o-mini
 * Set GITHUB_TOKEN in .env.local
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_MODELS_URL = "https://models.inference.ai.azure.com";
const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4o-mini";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Keep old name for backward compat
export type OllamaMessage = AIMessage;

/**
 * Send a chat completion request to GitHub Models
 */
export async function ollamaChat(
  messages: AIMessage[],
  model: string = DEFAULT_MODEL,
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  }
): Promise<string> {
  if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN not set in .env.local");
  }

  const response = await fetch(`${GITHUB_MODELS_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      top_p: options?.top_p ?? 0.9,
      max_tokens: options?.max_tokens ?? 512,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub Models API error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}

/**
 * Generate a game recommendation based on user preferences
 */
export async function generateGameRecommendation(
  userQuery: string,
  availableGames: string[],
  model?: string
): Promise<string> {
  const systemPrompt = `You are PixelVerse AI, an expert gaming assistant with deep knowledge of video games across all genres and platforms. 
You help gamers discover their perfect next game based on their mood, preferences, and gaming history.
Be enthusiastic, knowledgeable, and concise. Use gaming terminology naturally.
Available games in our database: ${availableGames.join(", ")}.
Always recommend from the available games list when possible, but you can mention others too.
Format your response in a friendly, engaging way. Keep it under 200 words.`;

  return ollamaChat(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
    model
  );
}

/**
 * Generate a gamer personality profile based on game preferences
 */
export async function generateGamerProfile(
  favoriteGames: string[],
  playStyle: string,
  hoursPerWeek: number,
  model?: string
): Promise<{
  archetype: string;
  description: string;
  strengths: string[];
  recommendations: string[];
  playstyleScore: Record<string, number>;
}> {
  const systemPrompt = `You are PixelVerse AI, a gaming personality analyst. 
Analyze a gamer's preferences and generate a detailed personality profile.
Respond ONLY with valid JSON matching this exact structure:
{
  "archetype": "string (e.g., 'The Strategist', 'The Explorer', 'The Competitor')",
  "description": "string (2-3 sentences about their gaming personality)",
  "strengths": ["array", "of", "3-4", "gaming", "strengths"],
  "recommendations": ["array", "of", "3", "game", "titles"],
  "playstyleScore": {
    "strategy": 0-100,
    "action": 0-100,
    "exploration": 0-100,
    "social": 0-100,
    "creativity": 0-100
  }
}`;

  const userPrompt = `Favorite games: ${favoriteGames.join(", ")}
Play style preference: ${playStyle}
Hours per week: ${hoursPerWeek}
Generate my gamer personality profile.`;

  const raw = await ollamaChat(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model,
    { temperature: 0.8 }
  );

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid AI response format");
  return JSON.parse(jsonMatch[0]);
}

/**
 * Generate a mood-based game suggestion
 */
export async function generateMoodSuggestion(
  mood: string,
  availableGames: Array<{ title: string; genre: string[]; mood: string[] }>,
  model?: string
): Promise<string> {
  const moodGames = availableGames
    .filter((g) => g.mood.includes(mood))
    .map((g) => `${g.title} (${g.genre.join(", ")})`)
    .join(", ");

  const systemPrompt = `You are PixelVerse AI. Suggest games based on the user's current mood. Be brief and enthusiastic. Max 100 words.`;

  return ollamaChat(
    [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `I'm feeling ${mood} right now. Games that match: ${moodGames}. Give me a quick recommendation with a reason.`,
      },
    ],
    model,
    { temperature: 0.9 }
  );
}

/**
 * Check if GitHub Models API is accessible by doing a minimal chat call
 */
export async function checkOllamaHealth(): Promise<{
  online: boolean;
  models: string[];
}> {
  if (!GITHUB_TOKEN) return { online: false, models: [] };

  try {
    const response = await fetch(`${GITHUB_MODELS_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { online: false, models: [] };
    return { online: true, models: [DEFAULT_MODEL] };
  } catch {
    return { online: false, models: [] };
  }
}
