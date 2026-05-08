# 🎮 PixelVerse — AI Gaming Assistant

Your AI-powered gaming companion. Discover games, build your gamer profile, and get personalized recommendations powered by GPT-4o-mini.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black)
![React](https://img.shields.io/badge/React-19.2.4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 🤖 **AI Chat Assistant** - Natural language game recommendations powered by GPT-4o-mini
- ⚡ **Decision Engine** - Smart game matching based on time, mood, and device
- 🔍 **Game Discovery** - Explore 500,000+ games from RAWG.io database
- 📊 **Gamer Profile** - Personalized gaming personality analysis
- 💰 **Price Comparison** - Compare prices across multiple stores
- 🎨 **Beautiful UI** - Modern design with 3D animations and smooth transitions
- 🌙 **Dark Theme** - Eye-friendly dark mode with glassmorphism effects

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd gaming-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# Choose one AI provider
OPENAI_API_KEY=sk-your-key-here
# OR
GITHUB_TOKEN=ghp_your-token-here

# Required for Explore & Decision Engine
RAWG_API_KEY=your-rawg-key-here
```

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

---

## 📚 Documentation

- **[Complete Documentation](./DOCUMENTATION.md)** - Full project documentation
- **[Technical Guide](./TECHNICAL_GUIDE.md)** - Deep dive into architecture
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Hindi Documentation](./README_HI.md)** - हिंदी में डॉक्यूमेंटेशन

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB** (Optional) - Database
- **OpenAI/GitHub Models** - AI recommendations

### External APIs
- **RAWG.io** - Game database (500,000+ games)
- **Steam API** - Game details & pricing
- **OpenAI API** - AI recommendations

---

## 🎯 Key Features Explained

### 1. AI Chat Assistant
Ask questions in natural language and get intelligent game recommendations.

```
You: "I want something relaxing tonight"
AI: "Try Stardew Valley - perfect for unwinding..."
```

### 2. Decision Engine
Get matched with games based on:
- ⏰ **Time Available** (30min - 5h+)
- 😌 **Current Mood** (7 moods)
- 💻 **Device** (Low-end, Mid-range, High-end)

### 3. Gamer Profile
Discover your gaming personality:
- 🎭 Archetype (e.g., "The Challenger")
- 💪 Strengths
- 📊 Play style scores
- 🎮 Personalized recommendations

---

## 📁 Project Structure

```
gaming-assistant/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── explore/           # Explore page
│   ├── game/              # Game details
│   └── profile/           # User profile
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── AIChat.tsx        # AI chat interface
│   └── DecisionEngine.tsx # Decision engine
├── lib/                   # Utilities
│   ├── ai.ts             # AI engine
│   ├── games.ts          # Game data layer
│   ├── rawg.ts           # RAWG API client
│   └── steam.ts          # Steam API client
└── data/                  # Static data
    ├── games.json        # Local games
    └── moods.json        # Mood definitions
```

---

## 🔑 Environment Variables

### Required

```env
# AI Provider (choose one)
OPENAI_API_KEY=sk-...        # OpenAI API key
GITHUB_TOKEN=ghp_...         # GitHub token (free alternative)

# Game Database
RAWG_API_KEY=...             # RAWG.io API key (free)
```

### Optional

```env
# Database (app works without this)
MONGODB_URI=mongodb://...    # MongoDB connection string

# AI Model
AI_MODEL=gpt-4o-mini         # Default model
```

### Getting API Keys

1. **OpenAI**: https://platform.openai.com/api-keys
2. **GitHub**: https://github.com/settings/tokens
3. **RAWG**: https://rawg.io/apidocs (20,000 free requests/month)

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

---

## 📖 API Endpoints

### AI Endpoints
- `POST /api/ai/recommend` - Game recommendations
- `POST /api/ai/profile` - Gamer profile generation
- `POST /api/ai/mood` - Mood-based suggestions
- `GET /api/ai/health` - AI health check

### Decision Engine
- `POST /api/decision` - Smart game matching

### Game Data
- `GET /api/games` - Local game database
- `GET /api/games/[id]` - Game details

### RAWG Proxy
- `GET /api/rawg/search` - Search games
- `GET /api/rawg/game/[slug]` - Game details
- `GET /api/rawg/trending` - Trending games
- `GET /api/rawg/explore` - Explore with filters

### Steam
- `GET /api/steam/[appId]` - Steam game data

See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.

---

## 🎨 Screenshots

### Home Page
AI chat assistant and trending games section.

### Decision Engine
Smart game matching with 3D card animations.

### Explore Page
Browse 500,000+ games with advanced filters.

### Game Details
Comprehensive game information with screenshots and pricing.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **RAWG.io** - Game database API
- **OpenAI** - AI model
- **GitHub Models** - Free AI access
- **Vercel** - Hosting platform
- **Next.js Team** - Amazing framework

---

## 📞 Support

- 📖 [Documentation](./DOCUMENTATION.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

## 🗺️ Roadmap

- [ ] User authentication
- [ ] Save favorite games
- [ ] Game library management
- [ ] Social features (friends, reviews)
- [ ] Mobile app
- [ ] More AI features

---

**Made with ❤️ by PixelVerse Team**

**Happy Gaming! 🎮**
