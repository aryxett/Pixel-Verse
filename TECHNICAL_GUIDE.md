# 🔧 PixelVerse - Technical Implementation Guide

## Deep Dive into Architecture & Implementation

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Flow](#data-flow)
3. [AI System Design](#ai-system-design)
4. [Decision Engine Algorithm](#decision-engine-algorithm)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [API Design Patterns](#api-design-patterns)
8. [Performance Optimization](#performance-optimization)
9. [Security Considerations](#security-considerations)
10. [Advanced Features](#advanced-features)

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Framer      │  │  Tailwind    │      │
│  │  Components  │  │  Motion      │  │  CSS         │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server (Node.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  App Router  │  │  API Routes  │  │  Middleware  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  AI Engine   │  │  Data Layer  │  │  Cache       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ API Calls
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  OpenAI/     │  │  RAWG.io     │  │  Steam API   │      │
│  │  GitHub      │  │  API         │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                           │
│  │  MongoDB     │                                           │
│  │  (Optional)  │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. AI Recommendation Flow

```
User Input (Chat)
    ↓
AIChat Component
    ↓
POST /api/ai/recommend
    ↓
lib/ai.ts → generateAIResponse()
    ↓
OpenAI/GitHub Models API
    ↓
AI Response Processing
    ↓
Return to Client
    ↓
Display in Chat UI
```

### 2. Decision Engine Flow

```
User Selects (Time, Mood, Device)
    ↓
DecisionEngine Component
    ↓
POST /api/decision
    ↓
Fetch RAWG Games (with filters)
    ↓
Build AI Prompt with Game List
    ↓
AI Analysis & Ranking
    ↓
Parse JSON Response
    ↓
Enrich with RAWG Data
    ↓
Return Top 5 Matches
    ↓
3D Card Carousel Display
```

### 3. Game Discovery Flow

```
User Browses/Searches
    ↓
ExploreClient Component
    ↓
GET /api/rawg/explore?filters
    ↓
RAWG.io API Call
    ↓
Cache Response (1 hour)
    ↓
Transform Data
    ↓
Return to Client
    ↓
Render Game Grid
```

---

## 🤖 AI System Design

### AI Engine Architecture (`lib/ai.ts`)

#### 1. **Dual Backend Support**

```typescript
const ENDPOINT = OPENAI_KEY ? OPENAI_ENDPOINT : GITHUB_ENDPOINT;
const API_KEY = OPENAI_KEY || GITHUB_TOKEN;
```

**Why?**
- **Flexibility**: Users can choose based on budget/preference
- **Fallback**: If one service is down, use the other
- **Cost**: GitHub Models is free for developers

#### 2. **System Prompt Engineering**

```typescript
const GAMING_SYSTEM_PROMPT = `You are PixelVerse AI — a world-class gaming expert assistant.

Your expertise:
- Deep knowledge of video games across all genres, platforms, and eras
- Understanding of game mechanics, narrative design, and player psychology
- Awareness of current gaming trends, metacritic scores, and community sentiment

Rules you MUST follow:
- Be concise and direct — no filler phrases
- Be accurate — only recommend games that actually exist
- Avoid generic answers — give specific, practical recommendations
- Do NOT hallucinate unknown games, developers, or scores
- Use gaming terminology naturally
- When recommending games, mention WHY they match the user's request
- Keep responses under 200 words unless asked for more detail`;
```

**Key Principles:**
- **Domain Expertise**: Establishes AI as gaming expert
- **Behavioral Rules**: Prevents generic/hallucinated responses
- **Conciseness**: Keeps responses focused
- **Context Awareness**: Uses gaming terminology

#### 3. **Error Handling & Timeouts**

```typescript
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), timeoutMs);

try {
  const response = await fetch(ENDPOINT, {
    signal: controller.signal,
    // ...
  });
} catch (err) {
  if (err.name === "AbortError") {
    throw new Error(`AI request timed out after ${timeoutMs / 1000}s`);
  }
  throw err;
} finally {
  clearTimeout(timer);
}
```

**Benefits:**
- Prevents hanging requests
- User-friendly error messages
- Resource cleanup

#### 4. **Response Parsing**

```typescript
// Extract JSON from markdown code blocks
const jsonMatch = raw.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error("Invalid profile response format");
return JSON.parse(jsonMatch[0]);
```

**Why?**
- AI sometimes wraps JSON in markdown
- Robust parsing handles various formats
- Validation before returning to client

---

## ⚙️ Decision Engine Algorithm

### Algorithm Overview

The Decision Engine uses a **multi-stage filtering + AI ranking** approach:

```
Stage 1: RAWG API Filtering (Server-side)
    ↓
Stage 2: Client-side Playtime Filter
    ↓
Stage 3: Platform Validation
    ↓
Stage 4: AI Analysis & Ranking
    ↓
Stage 5: Data Enrichment
    ↓
Stage 6: Match Score Calculation
```

### Stage 1: RAWG API Filtering

```typescript
const cfg = MOOD_CONFIG[input.mood];
const platforms = DEVICE_PLATFORM_IDS[input.device];
const metacritic = DEVICE_MIN_METACRITIC[input.device];
const yearRange = DEVICE_YEAR_RANGE[input.device];

const url = new URL(`${RAWG_BASE}/games`);
url.searchParams.set("genres", cfg.genres);
url.searchParams.set("tags", cfg.tags);
url.searchParams.set("platforms", platforms);
url.searchParams.set("metacritic", metacritic);
url.searchParams.set("dates", `${yearRange.from},${yearRange.to}`);
```

**Filters Applied:**
- **Genre**: Based on mood (e.g., "action" → "action,shooter")
- **Tags**: Specific gameplay tags (e.g., "fast-paced,combat")
- **Platform**: Device-specific platform IDs
- **Metacritic**: Quality threshold (60-100 for low-end, 80-100 for high-end)
- **Release Date**: Year range based on device capability

### Stage 2: Playtime Filter

```typescript
function getPlaytimeFilter(hours: number): { min: number; max: number } {
  if (hours <= 0.5) return { min: 0, max: 2 };
  if (hours <= 1)   return { min: 0, max: 5 };
  if (hours <= 2)   return { min: 1, max: 10 };
  if (hours <= 3)   return { min: 2, max: 20 };
  return              { min: 5, max: 999 };
}

games = games.filter((g) => {
  if (!g.playtime || g.playtime === 0) return true;
  return g.playtime >= ptFilter.min && g.playtime <= ptFilter.max;
});
```

**Logic:**
- Short sessions (30min) → Quick games (0-2h avg)
- Long sessions (5h+) → Deep games (5h+ avg)
- Unknown playtime → Include (let AI decide)

### Stage 3: Platform Validation

```typescript
const validPlatformNames = DEVICE_PLATFORM_NAMES[input.device];
games = games.filter((g) => {
  if (!g.platforms || g.platforms.length === 0) return false;
  return g.platforms.some((p) =>
    validPlatformNames.some((vp) =>
      p.platform.name.toLowerCase().includes(vp.toLowerCase())
    )
  );
});
```

**Strict Validation:**
- Low-end: PC (low spec), Switch, Mobile
- Mid-range: PC, PS4, Xbox One
- High-end: PC (high spec), PS5, Xbox Series X

### Stage 4: AI Prompt Construction

```typescript
const prompt = `STRICT RULES — you MUST follow these:
1. Only recommend games released after ${yearRange.from.slice(0, 4)}
2. Only recommend games that run on: ${platformNames}
3. Only recommend games with session length ${ptFilter.min}-${ptFilter.max}h
4. Mood must be: ${input.mood}

User: ${input.timeAvailable}h available, ${input.mood} mood, ${input.device} device

Games (already filtered — pick from these only):
${gameList}

Pick TOP 5. Return ONLY valid JSON array:
[
  {
    "game": "exact name from list",
    "slug": "exact slug from list",
    "reason": "1 sentence why it fits",
    "playtime": "~${input.timeAvailable}h session",
    "matchScore": 0-100
  }
]`;
```

**Prompt Engineering:**
- **Strict Rules**: Prevents AI from recommending invalid games
- **Context**: Provides user constraints
- **Game List**: Pre-filtered games (top 25)
- **Output Format**: JSON schema for parsing

### Stage 5: Response Parsing & Enrichment

```typescript
function parseAIResponse(raw: string, rawgGames: RAWGGame[]): DecisionOutput[] | null {
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) return null;

  const parsed = JSON.parse(match[0]);
  
  return parsed.map((item) => {
    const rawg = rawgGames.find(
      (g) => g.slug === item.slug || g.name.toLowerCase() === item.game.toLowerCase()
    );
    
    return {
      game: item.game,
      slug: item.slug || rawg?.slug,
      reason: item.reason,
      playtime: item.playtime,
      genre: rawg?.genres.map((g) => g.name) || [],
      matchScore: Math.min(100, Math.max(0, item.matchScore)),
      image: rawg?.background_image || "",
      rating: rawg ? Math.round(rawg.rating * 2 * 10) / 10 : 0,
      metacritic: rawg?.metacritic || null,
      releaseYear: rawg?.released ? new Date(rawg.released).getFullYear() : 0,
      developer: rawg?.developers?.[0]?.name || "Unknown",
      multiplayer: rawg?.tags?.some((t) => 
        ["multiplayer", "co-op"].includes(t.slug)
      ) || false,
    };
  });
}
```

**Enrichment Process:**
1. Parse AI JSON response
2. Match with RAWG game data
3. Add images, ratings, metadata
4. Calculate derived fields (multiplayer, etc.)
5. Validate match scores (0-100 range)

### Stage 6: Fallback Mechanism

```typescript
if (rawgGames.length === 0) {
  return NextResponse.json({ results: FALLBACK, fallback: true });
}

try {
  aiRaw = await generateAIResponse(buildPrompt(input, rawgGames));
} catch (err) {
  return NextResponse.json({ results: FALLBACK, fallback: true, error: msg });
}

const results = parseAIResponse(aiRaw, rawgGames);
if (!results || results.length === 0) {
  return NextResponse.json({ results: FALLBACK, fallback: true });
}
```

**Fallback Strategy:**
- No RAWG games → Use curated fallback list
- AI error → Use fallback
- Invalid AI response → Use fallback
- Always return something (never fail completely)

---

## 🎨 Component Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   └── Footer
├── HomePage
│   ├── HeroSection
│   ├── TrendingSection
│   │   └── GameCard[]
│   ├── AIChat
│   │   ├── Message[]
│   │   └── InputArea
│   └── DecisionEngine
│       ├── FilterControls
│       └── GameSlide (3D Card)
├── ExplorePage
│   ├── SearchBar
│   ├── FilterPanel
│   └── GameGrid
│       └── GameCard[]
└── GameDetailPage
    ├── GameHeader
    ├── Screenshots
    ├── PriceComparison
    └── RelatedGames
```

### Component Design Patterns

#### 1. **Client-Only Wrapper**

```typescript
// components/ClientOnly.tsx
"use client";

import { useEffect, useState } from "react";

export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
```

**Purpose:**
- Prevents hydration errors
- Handles browser-only code
- Provides loading fallback

**Usage:**
```tsx
<ClientOnly fallback={<Skeleton />}>
  <BrowserOnlyComponent />
</ClientOnly>
```

#### 2. **Compound Component Pattern**

```typescript
// GameCard with variants
export default function GameCard({ variant = "default" }) {
  if (variant === "compact") return <CompactCard />;
  if (variant === "featured") return <FeaturedCard />;
  return <DefaultCard />;
}
```

**Benefits:**
- Single import
- Flexible rendering
- Consistent API

#### 3. **Controlled vs Uncontrolled**

```typescript
// Controlled (DecisionEngine)
const [mood, setMood] = useState<string>("");

<button onClick={() => setMood("action")}>
  Action
</button>

// Uncontrolled (AIChat)
const inputRef = useRef<HTMLTextAreaElement>(null);

<textarea ref={inputRef} />
```

**When to use:**
- **Controlled**: Complex state, validation, derived values
- **Uncontrolled**: Simple forms, performance-critical

---

## 📊 State Management

### Local State (useState)

```typescript
// Simple component state
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Game[]>([]);
```

**Use for:**
- Component-specific state
- UI state (loading, errors)
- Form inputs

### Refs (useRef)

```typescript
// DOM references
const inputRef = useRef<HTMLInputElement>(null);
const bottomRef = useRef<HTMLDivElement>(null);

// Mutable values (no re-render)
const timerRef = useRef<NodeJS.Timeout>();
```

**Use for:**
- DOM manipulation
- Timers, intervals
- Previous values
- Animation frames

### Motion Values (Framer Motion)

```typescript
// Smooth animations
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);
const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
```

**Use for:**
- 3D transforms
- Mouse tracking
- Smooth interpolation
- Performance-critical animations

---

## 🔌 API Design Patterns

### 1. **Error Handling Pattern**

```typescript
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateInput(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const result = await processRequest(validation.data);
    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

**Layers:**
1. JSON parsing errors → 400
2. Validation errors → 400
3. Processing errors → 500
4. Always return JSON

### 2. **Caching Strategy**

```typescript
// Static data (1 hour cache)
const res = await fetch(url, {
  next: { revalidate: 3600 }
});

// Dynamic data (no cache)
const res = await fetch(url, {
  cache: 'no-store'
});

// On-demand revalidation
revalidatePath('/games');
revalidateTag('game-list');
```

**Cache Durations:**
- Game details: 1 hour (3600s)
- Trending games: 30 min (1800s)
- Search results: 5 min (300s)
- User data: No cache

### 3. **Type Safety**

```typescript
// Input validation
function validateInput(body: unknown): 
  { valid: true; data: DecisionInput } | 
  { valid: false; error: string } {
  
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid body" };
  }
  
  const b = body as Record<string, unknown>;
  
  if (typeof b.mood !== "string") {
    return { valid: false, error: "mood must be string" };
  }
  
  return { valid: true, data: b as DecisionInput };
}
```

**Benefits:**
- Runtime type checking
- Clear error messages
- Type narrowing

---

## ⚡ Performance Optimization

### 1. **Image Optimization**

```typescript
// Use Next.js Image component
import Image from "next/image";

<Image
  src={game.image}
  alt={game.title}
  width={400}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

**Optimizations:**
- Automatic WebP conversion
- Responsive images
- Lazy loading
- Blur placeholder

### 2. **Code Splitting**

```typescript
// Dynamic imports
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false
});
```

**Benefits:**
- Smaller initial bundle
- Faster page load
- On-demand loading

### 3. **Memoization**

```typescript
import { useMemo, useCallback } from "react";

// Expensive calculations
const filteredGames = useMemo(() => {
  return games.filter(g => g.mood.includes(selectedMood));
}, [games, selectedMood]);

// Callback functions
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);
```

**Use when:**
- Expensive computations
- Preventing re-renders
- Stable references

### 4. **Debouncing**

```typescript
// Search input debouncing
const [query, setQuery] = useState("");
const [debouncedQuery, setDebouncedQuery] = useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 300);
  
  return () => clearTimeout(timer);
}, [query]);

// Use debouncedQuery for API calls
useEffect(() => {
  if (debouncedQuery) {
    searchGames(debouncedQuery);
  }
}, [debouncedQuery]);
```

**Benefits:**
- Reduces API calls
- Better UX
- Lower costs

---

## 🔒 Security Considerations

### 1. **API Key Protection**

```typescript
// ❌ NEVER expose in client
const API_KEY = process.env.RAWG_API_KEY;

// ✅ Use server-side API routes
// app/api/rawg/search/route.ts
export async function GET(req: NextRequest) {
  const url = `${RAWG_BASE}/games?key=${RAWG_KEY}`;
  const res = await fetch(url);
  return NextResponse.json(await res.json());
}
```

### 2. **Input Validation**

```typescript
// Validate all user inputs
function validateInput(body: unknown) {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid input");
  }
  
  const { query } = body as { query?: unknown };
  
  if (typeof query !== "string" || query.length > 500) {
    throw new Error("Invalid query");
  }
  
  return { query };
}
```

### 3. **Rate Limiting**

```typescript
// Simple in-memory rate limiter
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(ip: string, limit = 10, window = 60000) {
  const now = Date.now();
  const requests = rateLimiter.get(ip) || [];
  
  // Remove old requests
  const recent = requests.filter(time => now - time < window);
  
  if (recent.length >= limit) {
    throw new Error("Rate limit exceeded");
  }
  
  recent.push(now);
  rateLimiter.set(ip, recent);
}
```

### 4. **CORS Configuration**

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST" },
        ],
      },
    ];
  },
};
```

---

## 🚀 Advanced Features

### 1. **3D Card Animation**

```typescript
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const rotateX = useSpring(
  useTransform(mouseY, [-0.5, 0.5], [6, -6]),
  { stiffness: 300, damping: 30 }
);

const rotateY = useSpring(
  useTransform(mouseX, [-0.5, 0.5], [-6, 6]),
  { stiffness: 300, damping: 30 }
);

const handleMouseMove = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
  mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
};

<motion.div
  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
  onMouseMove={handleMouseMove}
  onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
>
  {/* Card content */}
</motion.div>
```

**Features:**
- Smooth spring animations
- Mouse tracking
- 3D perspective
- Reset on mouse leave

### 2. **Carousel Navigation**

```typescript
const [activeIdx, setActiveIdx] = useState(0);
const [direction, setDirection] = useState(1);

const goTo = (idx: number) => {
  setDirection(idx > activeIdx ? 1 : -1);
  setActiveIdx(idx);
};

const variants = {
  enter: (d: number) => ({ 
    x: d > 0 ? 300 : -300, 
    opacity: 0 
  }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ 
    x: d > 0 ? -300 : 300, 
    opacity: 0 
  }),
};

<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={activeIdx}
    custom={direction}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
  >
    {results[activeIdx]}
  </motion.div>
</AnimatePresence>
```

### 3. **Infinite Scroll**

```typescript
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const observerRef = useRef<IntersectionObserver>();
const lastElementRef = useCallback((node: HTMLDivElement) => {
  if (loading) return;
  if (observerRef.current) observerRef.current.disconnect();
  
  observerRef.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setPage(prev => prev + 1);
    }
  });
  
  if (node) observerRef.current.observe(node);
}, [loading]);

// Last element
<div ref={lastElementRef} />
```

---

## 📈 Monitoring & Analytics

### Error Tracking

```typescript
// Global error boundary
export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service
    console.error("Global error:", error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Performance Monitoring

```typescript
// Measure component render time
useEffect(() => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    console.log(`Render time: ${end - start}ms`);
  };
}, []);
```

---

## 🧪 Testing Strategies

### Unit Testing

```typescript
// lib/ai.test.ts
import { generateAIResponse } from "./ai";

describe("AI Engine", () => {
  it("should generate response", async () => {
    const response = await generateAIResponse("Test prompt");
    expect(response).toBeDefined();
    expect(typeof response).toBe("string");
  });
});
```

### Integration Testing

```typescript
// app/api/decision/route.test.ts
import { POST } from "./route";

describe("Decision API", () => {
  it("should return game recommendations", async () => {
    const req = new Request("http://localhost/api/decision", {
      method: "POST",
      body: JSON.stringify({
        timeAvailable: 2,
        mood: "action",
        device: "high"
      })
    });
    
    const res = await POST(req);
    const data = await res.json();
    
    expect(data.results).toBeDefined();
    expect(data.results.length).toBeGreaterThan(0);
  });
});
```

---

## 🎓 Best Practices Summary

### Code Organization
- ✅ Group related files together
- ✅ Use barrel exports (index.ts)
- ✅ Separate concerns (UI, logic, data)
- ✅ Keep components small (<300 lines)

### TypeScript
- ✅ Use strict mode
- ✅ Define interfaces for all data
- ✅ Avoid `any` type
- ✅ Use type guards

### React
- ✅ Use functional components
- ✅ Prefer hooks over classes
- ✅ Memoize expensive operations
- ✅ Handle loading/error states

### Performance
- ✅ Lazy load heavy components
- ✅ Optimize images
- ✅ Cache API responses
- ✅ Debounce user inputs

### Security
- ✅ Never expose API keys
- ✅ Validate all inputs
- ✅ Sanitize user data
- ✅ Use HTTPS

---

**End of Technical Guide**

For more information, see [DOCUMENTATION.md](./DOCUMENTATION.md)
