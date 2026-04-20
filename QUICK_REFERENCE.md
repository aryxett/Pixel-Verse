# ⚡ PixelVerse Quick Reference Guide

One-page reference for common tasks and commands.

---

## 🚀 Quick Start

```bash
# Clone & Install
git clone <repo-url>
cd gaming-assistant
npm install

# Setup Environment
cp .env.local.example .env.local
# Add: OPENAI_API_KEY, RAWG_API_KEY

# Run
npm run dev
# Open: http://localhost:3000
```

---

## 📋 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Type Checking
npx tsc --noEmit        # Check TypeScript errors

# Clean
rm -rf .next            # Clear Next.js cache
rm -rf node_modules     # Remove dependencies
npm install             # Reinstall dependencies
```

---

## 🔑 Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...           # OpenAI API key
# OR
GITHUB_TOKEN=ghp_...            # GitHub token (free)

RAWG_API_KEY=...                # RAWG.io API key

# Optional
AI_MODEL=gpt-4o-mini            # AI model (default)
MONGODB_URI=mongodb://...       # MongoDB (optional)
```

---

## 📡 API Endpoints Cheat Sheet

### AI Endpoints
```bash
# Recommendations
POST /api/ai/recommend
Body: { "query": "relaxing game" }

# Profile
POST /api/ai/profile
Body: { "favoriteGames": [...], "playStyle": "...", "hoursPerWeek": 15 }

# Mood
POST /api/ai/mood
Body: { "mood": "chill", "availableGames": [...] }

# Health
GET /api/ai/health
```

### Decision Engine
```bash
POST /api/decision
Body: {
  "timeAvailable": 2,
  "mood": "action",
  "device": "high"
}
```

### Games
```bash
GET /api/games                  # All games
GET /api/games?trending=true    # Trending only
GET /api/games?mood=chill       # By mood
GET /api/games?search=elden     # Search
GET /api/games/[id]             # Specific game
```

### RAWG
```bash
GET /api/rawg/search?q=elden&page=1
GET /api/rawg/game/[slug]
GET /api/rawg/trending?count=10
GET /api/rawg/explore?genre=action&platform=4
```

### Steam
```bash
GET /api/steam/[appId]          # e.g., /api/steam/1245620
```

---

## 🎨 Component Usage

### AIChat
```tsx
import AIChat from "@/components/AIChat";

<AIChat />
```

### DecisionEngine
```tsx
import DecisionEngine from "@/components/DecisionEngine";

<DecisionEngine />
```

### GameCard
```tsx
import GameCard from "@/components/GameCard";

<GameCard game={gameData} variant="default" index={0} />
// Variants: "default" | "compact" | "featured"
```

### UI Components
```tsx
import { Button, Card, Badge } from "@/components/ui";

<Button variant="primary">Click Me</Button>
<Card>Content</Card>
<Badge color="green">New</Badge>
```

---

## 🔧 Common Code Patterns

### Fetch with Error Handling
```typescript
try {
  const res = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) throw new Error('Request failed');
  
  const result = await res.json();
  return result;
} catch (error) {
  console.error('Error:', error);
  throw error;
}
```

### AI Request
```typescript
import { generateAIResponse } from '@/lib/ai';

const response = await generateAIResponse(
  "Your prompt here",
  {
    temperature: 0.7,
    maxTokens: 512
  }
);
```

### RAWG API Call
```typescript
import { searchRAWGGames } from '@/lib/rawg';

const results = await searchRAWGGames("elden ring", 1);
```

### State Management
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<Game[]>([]);

useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const result = await fetchGames();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

---

## 🎯 Mood Options

```typescript
const MOODS = [
  "chill",       // 😌 Relaxed, low-stress
  "intense",     // 🔥 High-stakes, adrenaline
  "adventurous", // 🗺️ Explore vast worlds
  "competitive", // ⚔️ Ranked, PvP
  "creative",    // 🎨 Build, craft
  "social",      // 👥 Play with friends
  "focused"      // 🎯 Deep, skill-based
];
```

---

## 💻 Device Tiers

```typescript
const DEVICES = {
  "low-end": {
    platforms: ["PC", "Switch", "Mobile"],
    metacritic: "60,100",
    years: "2010-2024"
  },
  "mid": {
    platforms: ["PC", "PS4", "Xbox One"],
    metacritic: "70,100",
    years: "2015-2024"
  },
  "high": {
    platforms: ["PC", "PS5", "Xbox Series X"],
    metacritic: "80,100",
    years: "2019-2025"
  }
};
```

---

## ⏰ Time Options

```typescript
const TIME_OPTIONS = [
  { value: 0.5, label: "30 min" },
  { value: 1,   label: "1 hour" },
  { value: 2,   label: "2 hours" },
  { value: 3,   label: "3 hours" },
  { value: 5,   label: "5+ hours" }
];
```

---

## 🎨 Tailwind Classes

### Common Patterns
```css
/* Card */
.card {
  @apply rounded-2xl border border-white/[0.07] bg-slate-900/80 p-4;
}

/* Button */
.btn-primary {
  @apply px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700;
}

/* Input */
.input {
  @apply rounded-xl px-4 py-3 bg-slate-900 border border-white/[0.07] text-slate-200;
}

/* Badge */
.badge {
  @apply px-2.5 py-1 rounded-full text-xs font-semibold;
}
```

### Color Palette
```css
/* Primary */
--violet-500: #7c3aed
--violet-600: #6d28d9

/* Accent */
--cyan-500: #06b6d4
--orange-500: #f97316

/* Neutral */
--slate-900: #0f172a
--slate-800: #1e293b
--slate-700: #334155
```

---

## 🔍 Debugging Tips

### Check AI Connection
```bash
curl http://localhost:3000/api/ai/health
```

### Test Decision Engine
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{"timeAvailable":2,"mood":"action","device":"high"}'
```

### View Logs
```bash
# Development logs
npm run dev

# Check for errors
grep -r "Error" .next/
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

---

## 🐛 Common Issues & Fixes

### Issue: AI not working
```bash
# Check .env.local
cat .env.local | grep API_KEY

# Test health endpoint
curl http://localhost:3000/api/ai/health
```

### Issue: RAWG rate limit
```bash
# Check remaining requests
# Free tier: 20,000/month

# Solution: Implement caching
fetch(url, { next: { revalidate: 3600 } })
```

### Issue: Build errors
```bash
# Clear and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Hydration errors
```tsx
// Use ClientOnly wrapper
import ClientOnly from "@/components/ClientOnly";

<ClientOnly fallback={<Skeleton />}>
  <BrowserOnlyComponent />
</ClientOnly>
```

---

## 📊 Performance Tips

### Image Optimization
```tsx
import Image from "next/image";

<Image
  src={game.image}
  alt={game.title}
  width={400}
  height={600}
  loading="lazy"
/>
```

### Code Splitting
```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./Heavy"), {
  loading: () => <Skeleton />,
  ssr: false
});
```

### API Caching
```typescript
fetch(url, {
  next: { revalidate: 3600 } // 1 hour
});
```

### Debouncing
```typescript
const [query, setQuery] = useState("");
const [debounced, setDebounced] = useState("");

useEffect(() => {
  const timer = setTimeout(() => setDebounced(query), 300);
  return () => clearTimeout(timer);
}, [query]);
```

---

## 🔒 Security Checklist

- [ ] API keys in `.env.local` (not committed)
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose secrets
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] HTTPS in production

---

## 📦 Deployment Checklist

- [ ] Environment variables set
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] API keys configured
- [ ] Database connected (if using)
- [ ] Domain configured
- [ ] SSL certificate active

---

## 🔗 Quick Links

- **Docs**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **API**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Tech**: [TECHNICAL_GUIDE.md](./TECHNICAL_GUIDE.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📞 Get Help

- 📖 Read [DOCUMENTATION.md](./DOCUMENTATION.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

**Quick Reference v0.1.0**

**Last Updated**: April 2026
