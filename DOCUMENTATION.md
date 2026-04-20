# 🎮 PixelVerse — AI Gaming Assistant
## Complete Project Documentation

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [API Documentation](#api-documentation)
8. [Components Guide](#components-guide)
9. [Database Schema](#database-schema)
10. [AI Integration](#ai-integration)
11. [External APIs](#external-apis)
12. [Deployment](#deployment)
13. [Development Guide](#development-guide)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**PixelVerse** ek AI-powered gaming assistant hai jo gamers ko personalized game recommendations provide karta hai. Yeh project Next.js 16, React 19, aur GPT-4o-mini AI model ka use karke banaya gaya hai.

### Key Highlights:
- **AI-Powered Recommendations**: GPT-4o-mini se intelligent game suggestions
- **Mood-Based Filtering**: Apne mood ke according games discover karo
- **Decision Engine**: Time, device, aur mood ke basis pe perfect game match
- **Real-time Data**: RAWG.io API se 500,000+ games ka database
- **Price Comparison**: Multiple stores se price comparison
- **Gamer Profile**: Personalized gaming personality analysis

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2.4 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12.38.0
- **Icons**: Lucide React 1.8.0
- **Language**: TypeScript 5

### Backend
- **Runtime**: Node.js
- **API Routes**: Next.js API Routes
- **Database**: MongoDB (Mongoose 9.4.1) - Optional
- **AI**: OpenAI API / GitHub Models API

### External APIs
- **RAWG.io**: Game database (500,000+ games)
- **Steam API**: Game details aur pricing
- **OpenAI/GitHub Models**: AI recommendations

---

## ✨ Features

### 1. **AI Chat Assistant** 🤖
- Natural language mein game recommendations
- Context-aware responses
- Gaming terminology understanding
- Multi-turn conversations

### 2. **Decision Engine** ⚡
- Time-based filtering (30 min to 5+ hours)
- Mood-based recommendations (7 moods)
- Device compatibility (Low-end, Mid-range, High-end)
- Match score calculation (0-100)
- 3D card animations with mouse tracking

### 3. **Game Discovery** 🔍
- Trending games section
- Genre-based filtering
- Search functionality
- Mood filters (Chill, Intense, Adventurous, etc.)

### 4. **Game Details** 📊
- Comprehensive game information
- Screenshots gallery
- Metacritic scores
- Platform availability
- Price comparison across stores
- Related games suggestions

### 5. **Gamer Profile** 👤
- Personality archetype analysis
- Play style scoring
- Gaming strengths identification
- Personalized recommendations

### 6. **Explore Page** 🗺️
- RAWG.io integration
- 500,000+ games database
- Advanced filtering
- Real-time search

---

## 📁 Project Structure

```
gaming-assistant/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── ai/                   # AI-related endpoints
│   │   │   ├── health/          # AI health check
│   │   │   ├── mood/            # Mood-based suggestions
│   │   │   ├── profile/         # Gamer profile generation
│   │   │   └── recommend/       # Game recommendations
│   │   ├── decision/            # Decision Engine API
│   │   ├── games/               # Game data endpoints
│   │   ├── prices/              # Price comparison
│   │   ├── rawg/                # RAWG.io proxy endpoints
│   │   ├── steam/               # Steam API proxy
│   │   └── trailer/             # Game trailers
│   ├── design-system/           # UI component showcase
│   ├── explore/                 # Explore page
│   ├── game/                    # Game detail pages
│   │   ├── [id]/               # Local game details
│   │   └── rawg/[slug]/        # RAWG game details
│   ├── profile/                 # User profile page
│   ├── favicon.ico
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── providers.tsx            # Context providers
│
├── components/                   # React Components
│   ├── ui/                      # Reusable UI components
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Divider.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   └── Tooltip.tsx
│   ├── AIChat.tsx               # AI chat interface
│   ├── ClientOnly.tsx           # Client-side rendering wrapper
│   ├── DecisionEngine.tsx       # Decision engine component
│   ├── DesignSystemClient.tsx   # Design system page
│   ├── ExploreClient.tsx        # Explore page client
│   ├── GameCard.tsx             # Game card component
│   ├── GameCardPro.tsx          # Enhanced game card
│   ├── GameCardWithTrailer.tsx  # Card with video
│   ├── GameFacts.tsx            # Game statistics
│   ├── HeroSection.tsx          # Homepage hero
│   ├── HomePageClient.tsx       # Homepage client
│   ├── Icon.tsx                 # Icon wrapper
│   ├── MetacriticBadge.tsx      # Metacritic score badge
│   ├── MoodFilter.tsx           # Mood filtering UI
│   ├── Navbar.tsx               # Navigation bar
│   ├── PlatformStores.tsx       # Platform/store links
│   ├── PriceComparison.tsx      # Price comparison widget
│   ├── ProfileClient.tsx        # Profile page client
│   ├── RAWGGameDetailClient.tsx # RAWG game details
│   ├── StatsBar.tsx             # Statistics bar
│   └── TrendingSection.tsx      # Trending games section
│
├── lib/                          # Utility Libraries
│   ├── models/                  # Database models
│   │   └── UserProfile.ts       # User profile schema
│   ├── ai.ts                    # AI engine (OpenAI/GitHub)
│   ├── db.ts                    # MongoDB connection
│   ├── games.ts                 # Game data access layer
│   ├── ollama.ts                # GitHub Models integration
│   ├── rawg.ts                  # RAWG.io API client
│   └── steam.ts                 # Steam API client
│
├── data/                         # Static Data
│   ├── games.json               # Local game database (12 games)
│   └── moods.json               # Mood definitions (7 moods)
│
├── public/                       # Static Assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── placeholder-game.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .env.local                    # Environment variables (gitignored)
├── .env.local.example            # Environment template
├── .gitignore
├── AGENTS.md                     # Agent rules
├── CLAUDE.md                     # Claude-specific docs
├── DOCUMENTATION.md              # This file
├── README.md                     # Project readme
├── eslint.config.mjs             # ESLint configuration
├── next-env.d.ts                 # Next.js TypeScript definitions
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── package-lock.json
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 20+ installed
- npm/yarn/pnpm package manager
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd gaming-assistant
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Environment Setup
`.env.local` file create karo aur required variables add karo:

```bash
cp .env.local.example .env.local
```

### Step 4: Run Development Server
```bash
npm run dev
```

Server `http://localhost:3000` pe start ho jayega.

### Step 5: Build for Production
```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

`.env.local` file mein ye variables set karo:

### Required Variables

```env
# AI Configuration (Choose one)
# Option 1: OpenAI API (Recommended)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Option 2: GitHub Models API (Free alternative)
GITHUB_TOKEN=ghp_your-github-token-here

# AI Model (default: gpt-4o-mini)
AI_MODEL=gpt-4o-mini

# RAWG.io API (Required for Explore & Decision Engine)
# Get free key at: https://rawg.io/apidocs
RAWG_API_KEY=your-rawg-api-key-here
```

### Optional Variables

```env
# MongoDB (Optional - app works without this)
MONGODB_URI=mongodb://localhost:27017/pixelverse
# or MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pixelverse
```

### How to Get API Keys

#### 1. **OpenAI API Key**
- Visit: https://platform.openai.com/api-keys
- Sign up / Login
- Create new API key
- Copy aur `.env.local` mein paste karo

#### 2. **GitHub Token** (Free Alternative)
- Visit: https://github.com/settings/tokens
- Generate new token (classic)
- Select `read:packages` scope
- Copy aur `.env.local` mein paste karo

#### 3. **RAWG API Key** (Free)
- Visit: https://rawg.io/apidocs
- Sign up for free account
- Get API key (20,000 requests/month free)
- Copy aur `.env.local` mein paste karo

---

## 📡 API Documentation

### AI Endpoints

#### 1. **POST /api/ai/recommend**
Game recommendation based on user query.

**Request:**
```json
{
  "query": "I want something relaxing tonight"
}
```

**Response:**
```json
{
  "recommendation": "Based on your mood, I recommend Stardew Valley..."
}
```

#### 2. **POST /api/ai/profile**
Generate gamer personality profile.

**Request:**
```json
{
  "favoriteGames": ["Elden Ring", "Hades", "Celeste"],
  "playStyle": "challenging",
  "hoursPerWeek": 15
}
```

**Response:**
```json
{
  "archetype": "The Challenger",
  "description": "You thrive on difficulty...",
  "strengths": ["Persistence", "Pattern Recognition", "Adaptability"],
  "recommendations": ["Sekiro", "Hollow Knight", "Cuphead"],
  "playstyleScore": {
    "strategy": 75,
    "action": 90,
    "exploration": 60,
    "social": 30,
    "creativity": 45
  }
}
```

#### 3. **POST /api/ai/mood**
Mood-based game suggestion.

**Request:**
```json
{
  "mood": "chill",
  "availableGames": [...]
}
```

**Response:**
```json
{
  "suggestion": "For a chill session, try Stardew Valley..."
}
```

#### 4. **GET /api/ai/health**
Check AI service health.

**Response:**
```json
{
  "online": true,
  "backend": "openai",
  "model": "gpt-4o-mini"
}
```

---

### Decision Engine

#### **POST /api/decision**
AI-powered game decision engine with strict filtering.

**Request:**
```json
{
  "timeAvailable": 2,
  "mood": "action",
  "device": "high"
}
```

**Response:**
```json
{
  "results": [
    {
      "game": "Elden Ring",
      "slug": "elden-ring",
      "reason": "Epic action RPG perfect for 2-hour sessions",
      "playtime": "~2h",
      "genre": ["RPG", "Action"],
      "matchScore": 95,
      "image": "https://...",
      "rating": 9.6,
      "metacritic": 96,
      "releaseYear": 2022,
      "developer": "FromSoftware",
      "multiplayer": false
    }
  ],
  "fallback": false
}
```

**Parameters:**
- `timeAvailable`: 0.5, 1, 2, 3, 5+ (hours)
- `mood`: chill, action, competitive, adventurous, creative, social, horror
- `device`: low-end, mid, high

---

### Game Endpoints

#### 1. **GET /api/games**
Get all games from local database.

**Query Parameters:**
- `trending=true` - Get trending games only
- `mood=chill` - Filter by mood
- `search=elden` - Search games

**Response:**
```json
[
  {
    "id": "elden-ring",
    "title": "Elden Ring",
    "genre": ["RPG", "Action", "Souls-like"],
    "platform": ["PC", "PS5", "Xbox"],
    "rating": 9.6,
    "releaseYear": 2022,
    "developer": "FromSoftware",
    "publisher": "Bandai Namco",
    "description": "An action RPG set in the Lands Between...",
    "image": "https://...",
    "coverColor": "#1a0a2e",
    "tags": ["open-world", "challenging", "dark-fantasy"],
    "mood": ["focused", "adventurous", "intense"],
    "trending": true,
    "aiScore": 95,
    "playtime": "60-100h",
    "multiplayer": false
  }
]
```

#### 2. **GET /api/games/[id]**
Get specific game details.

---

### RAWG Endpoints

#### 1. **GET /api/rawg/search**
Search games on RAWG.io.

**Query Parameters:**
- `q=elden` - Search query
- `page=1` - Page number

#### 2. **GET /api/rawg/game/[slug]**
Get game details from RAWG.

#### 3. **GET /api/rawg/trending**
Get trending games from RAWG.

#### 4. **GET /api/rawg/explore**
Explore games with filters.

**Query Parameters:**
- `genre=action`
- `platform=pc`
- `ordering=-rating`
- `page=1`

---

### Steam Endpoints

#### **GET /api/steam/[appId]**
Get Steam game data.

**Example:** `/api/steam/1245620` (Elden Ring)

---

### Price Comparison

#### **GET /api/prices**
Compare prices across stores.

**Query Parameters:**
- `game=elden-ring`

---

## 🎨 Components Guide

### Core Components

#### 1. **AIChat.tsx**
AI chat interface with message history.

**Features:**
- Real-time chat
- Suggested prompts
- Loading states
- Error handling
- Auto-scroll

**Usage:**
```tsx
import AIChat from "@/components/AIChat";

<AIChat />
```

#### 2. **DecisionEngine.tsx**
AI-powered game decision engine.

**Features:**
- Time selection (30min - 5h+)
- Mood selection (7 moods)
- Device selection (3 tiers)
- 3D card animations
- Mouse-tracking glow effects
- Match score visualization
- Carousel navigation

**Usage:**
```tsx
import DecisionEngine from "@/components/DecisionEngine";

<DecisionEngine />
```

#### 3. **GameCard.tsx**
Reusable game card component.

**Variants:**
- `default` - Standard card
- `compact` - Smaller card for lists
- `featured` - Large hero card

**Usage:**
```tsx
import GameCard from "@/components/GameCard";

<GameCard game={gameData} variant="default" index={0} />
```

#### 4. **MoodFilter.tsx**
Mood-based filtering UI.

**Features:**
- 7 mood options
- Visual feedback
- Active state management

---

### UI Components

All UI components are in `components/ui/` directory:

- **Avatar.tsx** - User avatars
- **Badge.tsx** - Status badges
- **Button.tsx** - Reusable buttons
- **Card.tsx** - Container cards
- **Divider.tsx** - Section dividers
- **Input.tsx** - Form inputs
- **Modal.tsx** - Modal dialogs
- **ProgressBar.tsx** - Progress indicators
- **Skeleton.tsx** - Loading skeletons
- **Toast.tsx** - Notifications
- **Tooltip.tsx** - Hover tooltips

---

## 🗄️ Database Schema

### MongoDB Models

#### UserProfile Model
```typescript
interface UserProfile {
  userId: string;
  username: string;
  favoriteGames: string[];
  playStyle: string;
  hoursPerWeek: number;
  archetype?: string;
  playstyleScore?: {
    strategy: number;
    action: number;
    exploration: number;
    social: number;
    creativity: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Location:** `lib/models/UserProfile.ts`

---

## 🤖 AI Integration

### AI Engine Architecture

**File:** `lib/ai.ts`

#### Supported Backends:
1. **OpenAI API** (Primary)
   - Endpoint: `https://api.openai.com/v1/chat/completions`
   - Model: `gpt-4o-mini`
   - Requires: `OPENAI_API_KEY`

2. **GitHub Models API** (Fallback)
   - Endpoint: `https://models.inference.ai.azure.com/chat/completions`
   - Model: `gpt-4o-mini`
   - Requires: `GITHUB_TOKEN`

#### Core Functions:

##### 1. `generateAIResponse(prompt, options)`
Basic AI completion.

```typescript
const response = await generateAIResponse(
  "Recommend a game like Elden Ring",
  {
    temperature: 0.7,
    maxTokens: 512,
    systemPrompt: "You are a gaming expert..."
  }
);
```

##### 2. `generateAIChat(messages, options)`
Multi-turn conversation.

```typescript
const messages = [
  { role: "user", content: "I like RPGs" },
  { role: "assistant", content: "Try Baldur's Gate 3" },
  { role: "user", content: "Something shorter?" }
];

const response = await generateAIChat(messages);
```

##### 3. `getGameRecommendation(query, availableGames)`
Specialized game recommendation.

##### 4. `getGamerProfile(favoriteGames, playStyle, hoursPerWeek)`
Generate personality profile.

##### 5. `getMoodSuggestion(mood, matchingGames)`
Mood-based suggestion.

##### 6. `checkAIHealth()`
Health check.

---

### System Prompt

```
You are PixelVerse AI — a world-class gaming expert assistant.

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
- Keep responses under 200 words unless asked for more detail
```

---

## 🌐 External APIs

### 1. RAWG.io API

**Base URL:** `https://api.rawg.io/api`

**Features:**
- 500,000+ games database
- Game details, screenshots, ratings
- Genre, platform, tag filtering
- Search functionality
- Free tier: 20,000 requests/month

**Client:** `lib/rawg.ts`

**Key Functions:**
- `searchRAWGGames(query, page)`
- `getRAWGGame(slugOrId)`
- `getTrendingRAWGGames(count)`
- `getTopRatedRAWGGames(count)`
- `getRAWGGamesByGenre(genre, count)`
- `getRAWGScreenshots(slugOrId)`

---

### 2. Steam API

**Base URL:** `https://store.steampowered.com/api`

**Features:**
- Game details
- Pricing information
- Screenshots, trailers
- Metacritic scores
- No API key required

**Client:** `lib/steam.ts`

**Key Functions:**
- `getSteamGameData(appId)`
- `getSteamHeaderImage(appId)`
- `getSteamCapsuleImage(appId)`
- `getSteamStoreUrl(appId)`

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
- Visit: https://vercel.com
- Import repository
- Add environment variables
- Deploy

3. **Environment Variables on Vercel**
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`

---

### Manual Deployment

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 💻 Development Guide

### Adding a New Feature

1. **Create Component**
```tsx
// components/NewFeature.tsx
"use client";

export default function NewFeature() {
  return <div>New Feature</div>;
}
```

2. **Create API Route**
```typescript
// app/api/new-feature/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello" });
}
```

3. **Add to Page**
```tsx
// app/page.tsx
import NewFeature from "@/components/NewFeature";

export default function Page() {
  return <NewFeature />;
}
```

---

### Code Style Guidelines

- **TypeScript**: Strict mode enabled
- **Components**: Use functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Animations**: Framer Motion for complex animations
- **API**: Use Next.js API routes
- **Error Handling**: Always use try-catch blocks
- **Types**: Define interfaces for all data structures

---

### Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **AI API Not Working**
```
Error: No AI API key configured
```

**Solution:**
- Check `.env.local` file
- Verify `OPENAI_API_KEY` or `GITHUB_TOKEN` is set
- Restart development server

---

#### 2. **RAWG API Rate Limit**
```
Error: RAWG API rate limit exceeded
```

**Solution:**
- Free tier: 20,000 requests/month
- Implement caching
- Use `next: { revalidate: 3600 }` in fetch calls

---

#### 3. **MongoDB Connection Failed**
```
Error: MONGODB_URI not set
```

**Solution:**
- App works without MongoDB (uses JSON data)
- To enable: Add `MONGODB_URI` to `.env.local`
- MongoDB is optional

---

#### 4. **Build Errors**
```
Error: Module not found
```

**Solution:**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

---

#### 5. **Hydration Errors**
```
Error: Hydration failed
```

**Solution:**
- Use `ClientOnly` wrapper for client-side components
- Add `suppressHydrationWarning` to dynamic elements
- Check for browser-only APIs in server components

---

### Performance Optimization

1. **Image Optimization**
- Use Next.js `<Image>` component
- Add `loading="lazy"` attribute
- Optimize image sizes

2. **API Caching**
```typescript
fetch(url, {
  next: { revalidate: 3600 } // Cache for 1 hour
});
```

3. **Code Splitting**
- Use dynamic imports for large components
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

---

## 📚 Additional Resources

### Documentation Links
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [RAWG API](https://rawg.io/apidocs)
- [OpenAI API](https://platform.openai.com/docs)

### Learning Resources
- [Next.js Tutorial](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/utility-first)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**PixelVerse Team**

For questions or support, please open an issue on GitHub.

---

## 🎉 Acknowledgments

- **RAWG.io** - Game database API
- **OpenAI** - AI model
- **GitHub Models** - Free AI access
- **Vercel** - Hosting platform
- **Next.js Team** - Amazing framework

---

**Last Updated:** April 2026

**Version:** 0.1.0

---

## Quick Start Checklist

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env.local` file
- [ ] Add `OPENAI_API_KEY` or `GITHUB_TOKEN`
- [ ] Add `RAWG_API_KEY`
- [ ] Run `npm run dev`
- [ ] Open `http://localhost:3000`
- [ ] Test AI chat
- [ ] Test decision engine
- [ ] Explore RAWG games

---

**Happy Gaming! 🎮**
