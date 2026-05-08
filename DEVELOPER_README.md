# 👨‍💻 PixelVerse - Developer Documentation

Complete guide for developers working on PixelVerse.

---

## 📋 Table of Contents

1. [Development Setup](#development-setup)
2. [Project Architecture](#project-architecture)
3. [Code Structure](#code-structure)
4. [Development Workflow](#development-workflow)
5. [API Development](#api-development)
6. [Component Development](#component-development)
7. [State Management](#state-management)
8. [Testing](#testing)
9. [Debugging](#debugging)
10. [Performance](#performance)
11. [Best Practices](#best-practices)
12. [Common Tasks](#common-tasks)

---

## 🚀 Development Setup

### Prerequisites

```bash
# Required
Node.js >= 20.0.0
npm >= 10.0.0
Git >= 2.40.0

# Recommended
VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
```

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd gaming-assistant

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.local.example .env.local

# 4. Add API keys to .env.local
# OPENAI_API_KEY=sk-...
# RAWG_API_KEY=...

# 5. Start development server
npm run dev

# 6. Open browser
# http://localhost:3000
```

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Environment Variables

```env
# AI Provider (choose one)
OPENAI_API_KEY=sk-proj-...              # OpenAI API key
# OR
GITHUB_TOKEN=ghp_...                    # GitHub Models (free)

# Game Database (required)
RAWG_API_KEY=...                        # Get from https://rawg.io/apidocs

# AI Configuration (optional)
AI_MODEL=gpt-4o-mini                    # Default model
OLLAMA_BASE_URL=http://localhost:11434  # If using Ollama

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/pixelverse
# OR
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pixelverse
```

---

## 🏗️ Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           Client (Browser)              │
│  React 19 + Next.js 16 + TypeScript     │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Next.js Server (Node.js)        │
│  ┌─────────────┐  ┌─────────────┐      │
│  │ App Router  │  │ API Routes  │      │
│  └─────────────┘  └─────────────┘      │
│  ┌─────────────┐  ┌─────────────┐      │
│  │  AI Engine  │  │ Data Layer  │      │
│  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         External Services               │
│  OpenAI | RAWG.io | Steam | MongoDB    │
└─────────────────────────────────────────┘
```

### Directory Structure

```
gaming-assistant/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes (Backend)
│   │   ├── ai/              # AI endpoints
│   │   ├── decision/        # Decision engine
│   │   ├── games/           # Game data
│   │   ├── rawg/            # RAWG proxy
│   │   └── steam/           # Steam proxy
│   ├── explore/             # Explore page
│   ├── game/                # Game details
│   ├── profile/             # User profile
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
│
├── components/              # React Components
│   ├── ui/                  # Reusable UI components
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── AIChat.tsx           # AI chat interface
│   ├── DecisionEngine.tsx   # Decision engine
│   ├── GameCard.tsx         # Game card
│   └── ...
│
├── lib/                     # Utility Libraries
│   ├── ai.ts               # AI engine
│   ├── games.ts            # Game data layer
│   ├── rawg.ts             # RAWG API client
│   ├── steam.ts            # Steam API client
│   ├── db.ts               # MongoDB connection
│   └── models/             # Database models
│
├── data/                    # Static Data
│   ├── games.json          # Local games
│   └── moods.json          # Mood definitions
│
├── public/                  # Static Assets
│   └── *.svg
│
├── .env.local              # Environment variables (gitignored)
├── .env.local.example      # Environment template
├── next.config.ts          # Next.js config
├── tailwind.config.ts      # Tailwind config
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

---

## 💻 Code Structure

### Component Structure

```typescript
// components/GameCard.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Game } from "@/lib/games";

interface GameCardProps {
  game: Game;
  index?: number;
  variant?: "default" | "compact" | "featured";
}

export default function GameCard({ 
  game, 
  index = 0, 
  variant = "default" 
}: GameCardProps) {
  // Component logic
  return (
    <motion.div>
      {/* JSX */}
    </motion.div>
  );
}
```

### API Route Structure

```typescript
// app/api/games/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllGames } from "@/lib/games";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mood = searchParams.get("mood");
    
    // Logic
    const games = getAllGames();
    
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Utility Function Structure

```typescript
// lib/games.ts
import gamesData from "@/data/games.json";

export interface Game {
  id: string;
  title: string;
  // ... other fields
}

export function getAllGames(): Game[] {
  return gamesData as Game[];
}

export function getGameById(id: string): Game | undefined {
  return (gamesData as Game[]).find((g) => g.id === id);
}
```

---

## 🔄 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Development Cycle

```bash
# Start dev server
npm run dev

# Make changes
# Edit files in app/, components/, lib/

# Check for errors
npm run lint
npx tsc --noEmit

# Test in browser
# http://localhost:3000
```

### 3. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 4. Push & Create PR

```bash
git push origin feature/your-feature-name
# Create PR on GitHub
```

---

## 📡 API Development

### Creating a New API Endpoint

#### Step 1: Create Route File

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Your logic here
    const data = { message: "Hello" };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    if (!body.field) {
      return NextResponse.json(
        { error: "field is required" },
        { status: 400 }
      );
    }
    
    // Process request
    const result = await processData(body);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

#### Step 2: Add Type Definitions

```typescript
// lib/types.ts
export interface MyEndpointRequest {
  field: string;
  optional?: number;
}

export interface MyEndpointResponse {
  result: string;
  data: any[];
}
```

#### Step 3: Test Endpoint

```bash
# GET request
curl http://localhost:3000/api/my-endpoint

# POST request
curl -X POST http://localhost:3000/api/my-endpoint \
  -H "Content-Type: application/json" \
  -d '{"field":"value"}'
```

### API Best Practices

```typescript
// ✅ Good: Proper error handling
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate
    if (!body.query) {
      return NextResponse.json(
        { error: "query is required" },
        { status: 400 }
      );
    }
    
    // Process
    const result = await processQuery(body.query);
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ❌ Bad: No error handling
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await processQuery(body.query);
  return NextResponse.json({ result });
}
```

---

## 🎨 Component Development

### Creating a New Component

#### Step 1: Create Component File

```typescript
// components/MyComponent.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ 
  title, 
  onAction 
}: MyComponentProps) {
  const [state, setState] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-white/[0.07] p-4"
    >
      <h2 className="text-xl font-bold text-slate-100">
        {title}
      </h2>
      <button
        onClick={onAction}
        className="mt-4 px-4 py-2 rounded-lg bg-violet-600 text-white"
      >
        Action
      </button>
    </motion.div>
  );
}
```

#### Step 2: Use Component

```typescript
// app/page.tsx
import MyComponent from "@/components/MyComponent";

export default function Page() {
  return (
    <MyComponent 
      title="Hello" 
      onAction={() => console.log("Clicked")}
    />
  );
}
```

### Component Patterns

#### 1. Client Component with State

```typescript
"use client";

import { useState, useEffect } from "react";

export default function ClientComponent() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{/* Render data */}</div>;
}
```

#### 2. Server Component with Data Fetching

```typescript
// app/page.tsx (Server Component)
async function getData() {
  const res = await fetch("https://api.example.com/data", {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  
  return <div>{/* Render data */}</div>;
}
```

#### 3. Compound Component

```typescript
// components/Card.tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.07] p-4">
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

---

## 📊 State Management

### Local State (useState)

```typescript
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
```

### Refs (useRef)

```typescript
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);

// Mutable value (no re-render)
const timerRef = useRef<NodeJS.Timeout>();

// Usage
inputRef.current?.focus();
timerRef.current = setTimeout(() => {}, 1000);
```

### Context (useContext)

```typescript
// contexts/ThemeContext.tsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark");
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

// Usage
const { theme, setTheme } = useTheme();
```

### Custom Hooks

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  if (debouncedQuery) {
    searchGames(debouncedQuery);
  }
}, [debouncedQuery]);
```

---

## 🧪 Testing

### Manual Testing

```bash
# 1. Start dev server
npm run dev

# 2. Test in browser
# - Check UI rendering
# - Test user interactions
# - Verify API calls
# - Check error states
# - Test different screen sizes

# 3. Check console for errors
# Open DevTools → Console
```

### API Testing with cURL

```bash
# Test AI recommendation
curl -X POST http://localhost:3000/api/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{"query":"relaxing game"}'

# Test decision engine
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"timeAvailable":2,"mood":"action","device":"high"}'

# Test game search
curl "http://localhost:3000/api/games?search=elden"
```

### Unit Testing (Future)

```typescript
// __tests__/lib/games.test.ts
import { getAllGames, getGameById } from "@/lib/games";

describe("Game Functions", () => {
  test("getAllGames returns array", () => {
    const games = getAllGames();
    expect(Array.isArray(games)).toBe(true);
    expect(games.length).toBeGreaterThan(0);
  });
  
  test("getGameById returns correct game", () => {
    const game = getGameById("elden-ring");
    expect(game).toBeDefined();
    expect(game?.title).toBe("Elden Ring");
  });
});
```

---

## 🐛 Debugging

### Console Logging

```typescript
// Basic logging
console.log("Value:", value);
console.error("Error:", error);
console.warn("Warning:", warning);

// Structured logging
console.log({
  component: "GameCard",
  action: "click",
  gameId: game.id
});

// Performance logging
console.time("fetchGames");
await fetchGames();
console.timeEnd("fetchGames");
```

### React DevTools

```bash
# Install React DevTools extension
# Chrome: https://chrome.google.com/webstore
# Firefox: https://addons.mozilla.org/firefox

# Usage:
# 1. Open DevTools
# 2. Go to "Components" tab
# 3. Inspect component tree
# 4. View props and state
```

### Network Debugging

```bash
# Open DevTools → Network tab
# Filter by:
# - XHR (API calls)
# - JS (JavaScript files)
# - Img (Images)

# Check:
# - Request headers
# - Response data
# - Status codes
# - Timing
```

### Common Issues

#### Issue: Hydration Error

```typescript
// ❌ Problem: Using browser-only APIs in server component
export default function Component() {
  const width = window.innerWidth; // Error!
  return <div>{width}</div>;
}

// ✅ Solution: Use ClientOnly wrapper
"use client";

import { useState, useEffect } from "react";

export default function Component() {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  
  return <div>{width}</div>;
}
```

#### Issue: API Not Working

```typescript
// Check .env.local
console.log("API Key:", process.env.OPENAI_API_KEY ? "Set" : "Missing");

// Test endpoint
const res = await fetch("/api/ai/health");
console.log("Health:", await res.json());
```

---

## ⚡ Performance

### Image Optimization

```typescript
import Image from "next/image";

// ✅ Good: Use Next.js Image
<Image
  src={game.image}
  alt={game.title}
  width={400}
  height={600}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/..."
/>

// ❌ Bad: Regular img tag
<img src={game.image} alt={game.title} />
```

### Code Splitting

```typescript
import dynamic from "next/dynamic";

// ✅ Good: Dynamic import for heavy components
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false
});

// ❌ Bad: Import everything upfront
import HeavyComponent from "./HeavyComponent";
```

### Memoization

```typescript
import { useMemo, useCallback } from "react";

// Expensive calculation
const filteredGames = useMemo(() => {
  return games.filter(g => g.mood.includes(selectedMood));
}, [games, selectedMood]);

// Callback function
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);
```

### API Caching

```typescript
// Server-side caching
const res = await fetch(url, {
  next: { revalidate: 3600 } // Cache for 1 hour
});

// Client-side caching
const [cache, setCache] = useState<Map<string, any>>(new Map());

async function fetchWithCache(key: string) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetch(key).then(r => r.json());
  setCache(new Map(cache.set(key, data)));
  return data;
}
```

---

## 📝 Best Practices

### TypeScript

```typescript
// ✅ Good: Define interfaces
interface Game {
  id: string;
  title: string;
  rating: number;
}

function getGame(id: string): Game | null {
  // ...
}

// ❌ Bad: Use any
function getGame(id: any): any {
  // ...
}
```

### React

```typescript
// ✅ Good: Functional component with hooks
export default function GameCard({ game }: { game: Game }) {
  const [loading, setLoading] = useState(false);
  
  return <div>{game.title}</div>;
}

// ❌ Bad: Class component
export default class GameCard extends React.Component {
  // ...
}
```

### Styling

```typescript
// ✅ Good: Tailwind utility classes
<div className="rounded-xl border border-white/[0.07] bg-slate-900 p-4">
  Content
</div>

// ❌ Bad: Inline styles
<div style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
  Content
</div>
```

### Error Handling

```typescript
// ✅ Good: Try-catch with user-friendly messages
try {
  const result = await fetchData();
  return result;
} catch (error) {
  console.error("Fetch error:", error);
  throw new Error("Failed to load data. Please try again.");
}

// ❌ Bad: No error handling
const result = await fetchData();
return result;
```

---

## 🔧 Common Tasks

### Add a New Page

```bash
# 1. Create page file
mkdir -p app/my-page
touch app/my-page/page.tsx

# 2. Add content
# app/my-page/page.tsx
export default function MyPage() {
  return <div>My Page</div>;
}

# 3. Access at http://localhost:3000/my-page
```

### Add a New API Endpoint

```bash
# 1. Create route file
mkdir -p app/api/my-endpoint
touch app/api/my-endpoint/route.ts

# 2. Add handler
# app/api/my-endpoint/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}

# 3. Test at http://localhost:3000/api/my-endpoint
```

### Add a New Component

```bash
# 1. Create component file
touch components/MyComponent.tsx

# 2. Add component code
# components/MyComponent.tsx
export default function MyComponent() {
  return <div>My Component</div>;
}

# 3. Import and use
# import MyComponent from "@/components/MyComponent";
```

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Install new package
npm install package-name
```

### Clear Cache

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
```

---

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Postman](https://www.postman.com/) - API testing
- [Vercel](https://vercel.com/) - Deployment

---

## 🤝 Getting Help

- 📖 Read [DOCUMENTATION.md](./DOCUMENTATION.md)
- 🔧 Check [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md)
- 📡 Review [API_REFERENCE.md](./API_REFERENCE.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Ask Questions](https://github.com/your-repo/discussions)

---

**Developer README v1.0.0**

**Last Updated**: April 2026

**Happy Coding! 💻**
