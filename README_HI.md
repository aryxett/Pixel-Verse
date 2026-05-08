# 🎮 PixelVerse — AI Gaming Assistant
## पूर्ण प्रोजेक्ट डॉक्यूमेंटेशन (हिंदी में)

---

## 📋 विषय सूची

1. [प्रोजेक्ट का परिचय](#प्रोजेक्ट-का-परिचय)
2. [मुख्य फीचर्स](#मुख्य-फीचर्स)
3. [टेक्नोलॉजी स्टैक](#टेक्नोलॉजी-स्टैक)
4. [इंस्टॉलेशन गाइड](#इंस्टॉलेशन-गाइड)
5. [एनवायरनमेंट सेटअप](#एनवायरनमेंट-सेटअप)
6. [प्रोजेक्ट स्ट्रक्चर](#प्रोजेक्ट-स्ट्रक्चर)
7. [API एंडपॉइंट्स](#api-एंडपॉइंट्स)
8. [कंपोनेंट्स की जानकारी](#कंपोनेंट्स-की-जानकारी)
9. [AI इंटीग्रेशन](#ai-इंटीग्रेशन)
10. [डिप्लॉयमेंट](#डिप्लॉयमेंट)
11. [ट्रबलशूटिंग](#ट्रबलशूटिंग)

---

## 🎯 प्रोजेक्ट का परिचय

**PixelVerse** एक AI-powered gaming assistant है जो gamers को personalized game recommendations देता है। यह प्रोजेक्ट Next.js 16, React 19, और GPT-4o-mini AI model का उपयोग करके बनाया गया है।

### मुख्य विशेषताएं:
- **AI-Powered Recommendations**: GPT-4o-mini से intelligent game suggestions
- **Mood-Based Filtering**: अपने mood के अनुसार games खोजें
- **Decision Engine**: समय, device, और mood के आधार पर perfect game match
- **Real-time Data**: RAWG.io API से 500,000+ games का database
- **Price Comparison**: विभिन्न stores से price comparison
- **Gamer Profile**: व्यक्तिगत gaming personality analysis

---

## ✨ मुख्य फीचर्स

### 1. **AI Chat Assistant** 🤖
- सामान्य भाषा में game recommendations
- Context-aware जवाब
- Gaming terminology की समझ
- Multi-turn conversations

**कैसे काम करता है:**
```
User: "मुझे कोई relaxing game चाहिए"
AI: "आपके mood के लिए Stardew Valley perfect है..."
```

### 2. **Decision Engine** ⚡
- समय-आधारित filtering (30 मिनट से 5+ घंटे)
- Mood-based recommendations (7 moods)
- Device compatibility (Low-end, Mid-range, High-end)
- Match score calculation (0-100)
- 3D card animations

**उदाहरण:**
```
समय: 2 घंटे
Mood: Action
Device: High-end
↓
Result: Top 5 games with 90+ match score
```

### 3. **Game Discovery** 🔍
- Trending games section
- Genre-based filtering
- Search functionality
- 7 mood filters

### 4. **Game Details** 📊
- विस्तृत game information
- Screenshots gallery
- Metacritic scores
- Platform availability
- Price comparison
- Related games

### 5. **Gamer Profile** 👤
- Personality archetype analysis
- Play style scoring
- Gaming strengths
- Personalized recommendations

### 6. **Explore Page** 🗺️
- RAWG.io integration
- 500,000+ games database
- Advanced filtering
- Real-time search

---

## 🛠️ टेक्नोलॉजी स्टैक

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
- **Database**: MongoDB (Mongoose) - Optional
- **AI**: OpenAI API / GitHub Models API

### External APIs
- **RAWG.io**: Game database (500,000+ games)
- **Steam API**: Game details और pricing
- **OpenAI/GitHub Models**: AI recommendations

---

## 🚀 इंस्टॉलेशन गाइड

### आवश्यक चीजें (Prerequisites)
- Node.js 20+ installed
- npm/yarn/pnpm package manager
- Git

### Step 1: Repository Clone करें
```bash
git clone <repository-url>
cd gaming-assistant
```

### Step 2: Dependencies Install करें
```bash
npm install
```

### Step 3: Environment Variables Setup करें
`.env.local` file बनाएं:

```bash
cp .env.local.example .env.local
```

### Step 4: Development Server चलाएं
```bash
npm run dev
```

Server `http://localhost:3000` पर start हो जाएगा।

### Step 5: Production Build
```bash
npm run build
npm start
```

---

## 🔐 एनवायरनमेंट सेटअप

`.env.local` file में ये variables set करें:

### जरूरी Variables

```env
# AI Configuration (एक चुनें)
# Option 1: OpenAI API (Recommended)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Option 2: GitHub Models API (Free alternative)
GITHUB_TOKEN=ghp_your-github-token-here

# AI Model (default: gpt-4o-mini)
AI_MODEL=gpt-4o-mini

# RAWG.io API (जरूरी - Explore & Decision Engine के लिए)
# Free key यहाँ से लें: https://rawg.io/apidocs
RAWG_API_KEY=your-rawg-api-key-here
```

### Optional Variables

```env
# MongoDB (Optional - app इसके बिना भी काम करता है)
MONGODB_URI=mongodb://localhost:27017/pixelverse
```

### API Keys कैसे प्राप्त करें

#### 1. **OpenAI API Key**
1. https://platform.openai.com/api-keys पर जाएं
2. Sign up / Login करें
3. नया API key बनाएं
4. Copy करके `.env.local` में paste करें

#### 2. **GitHub Token** (Free Alternative)
1. https://github.com/settings/tokens पर जाएं
2. नया token generate करें (classic)
3. `read:packages` scope select करें
4. Copy करके `.env.local` में paste करें

#### 3. **RAWG API Key** (Free)
1. https://rawg.io/apidocs पर जाएं
2. Free account के लिए sign up करें
3. API key प्राप्त करें (20,000 requests/month free)
4. Copy करके `.env.local` में paste करें

---

## 📁 प्रोजेक्ट स्ट्रक्चर

```
gaming-assistant/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── ai/                   # AI-related endpoints
│   │   │   ├── recommend/       # Game recommendations
│   │   │   ├── profile/         # Gamer profile
│   │   │   └── mood/            # Mood suggestions
│   │   ├── decision/            # Decision Engine
│   │   ├── games/               # Game data
│   │   ├── rawg/                # RAWG.io proxy
│   │   └── steam/               # Steam API proxy
│   ├── explore/                 # Explore page
│   ├── game/                    # Game detail pages
│   ├── profile/                 # User profile
│   └── page.tsx                 # Home page
│
├── components/                   # React Components
│   ├── ui/                      # UI components
│   ├── AIChat.tsx               # AI chat interface
│   ├── DecisionEngine.tsx       # Decision engine
│   ├── GameCard.tsx             # Game card
│   └── ...                      # अन्य components
│
├── lib/                          # Utility Libraries
│   ├── ai.ts                    # AI engine
│   ├── games.ts                 # Game data layer
│   ├── rawg.ts                  # RAWG API client
│   └── steam.ts                 # Steam API client
│
├── data/                         # Static Data
│   ├── games.json               # Local games (12)
│   └── moods.json               # Mood definitions (7)
│
└── public/                       # Static Assets
```

---

## 📡 API एंडपॉइंट्स

### AI Endpoints

#### 1. **POST /api/ai/recommend**
User query के आधार पर game recommendation।

**Request:**
```json
{
  "query": "मुझे कोई relaxing game चाहिए"
}
```

**Response:**
```json
{
  "recommendation": "आपके mood के लिए Stardew Valley perfect है..."
}
```

#### 2. **POST /api/ai/profile**
Gamer personality profile generate करें।

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
  "description": "आप difficulty पर thrive करते हैं...",
  "strengths": ["Persistence", "Pattern Recognition"],
  "recommendations": ["Sekiro", "Hollow Knight"],
  "playstyleScore": {
    "strategy": 75,
    "action": 90,
    "exploration": 60,
    "social": 30,
    "creativity": 45
  }
}
```

#### 3. **POST /api/decision**
AI-powered game decision engine।

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
      "reason": "2 घंटे के session के लिए perfect action RPG",
      "playtime": "~2h",
      "genre": ["RPG", "Action"],
      "matchScore": 95,
      "image": "https://...",
      "rating": 9.6,
      "metacritic": 96
    }
  ]
}
```

---

## 🎨 कंपोनेंट्स की जानकारी

### 1. **AIChat Component**

AI chat interface जो real-time recommendations देता है।

**Features:**
- Message history
- Suggested prompts
- Loading states
- Error handling
- Auto-scroll

**उपयोग:**
```tsx
import AIChat from "@/components/AIChat";

<AIChat />
```

### 2. **DecisionEngine Component**

AI-powered game decision engine।

**Features:**
- समय selection (30min - 5h+)
- Mood selection (7 moods)
- Device selection (3 tiers)
- 3D card animations
- Match score visualization

**उपयोग:**
```tsx
import DecisionEngine from "@/components/DecisionEngine";

<DecisionEngine />
```

### 3. **GameCard Component**

Reusable game card।

**Variants:**
- `default` - Standard card
- `compact` - छोटा card
- `featured` - बड़ा hero card

**उपयोग:**
```tsx
import GameCard from "@/components/GameCard";

<GameCard game={gameData} variant="default" />
```

---

## 🤖 AI इंटीग्रेशन

### AI Engine कैसे काम करता है

**File:** `lib/ai.ts`

#### दो Backend Support:

1. **OpenAI API** (Primary)
   - Model: `gpt-4o-mini`
   - जरूरी: `OPENAI_API_KEY`

2. **GitHub Models API** (Free Alternative)
   - Model: `gpt-4o-mini`
   - जरूरी: `GITHUB_TOKEN`

#### मुख्य Functions:

##### 1. `generateAIResponse(prompt, options)`
Basic AI completion।

```typescript
const response = await generateAIResponse(
  "Elden Ring जैसा game recommend करो",
  {
    temperature: 0.7,
    maxTokens: 512
  }
);
```

##### 2. `getGameRecommendation(query, availableGames)`
Game recommendation।

##### 3. `getGamerProfile(favoriteGames, playStyle, hoursPerWeek)`
Personality profile।

##### 4. `getMoodSuggestion(mood, matchingGames)`
Mood-based suggestion।

---

## 🚢 डिप्लॉयमेंट

### Vercel पर Deploy करें (Recommended)

#### Step 1: GitHub पर Push करें
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### Step 2: Vercel से Connect करें
1. https://vercel.com पर जाएं
2. Repository import करें
3. Environment variables add करें
4. Deploy button click करें

#### Step 3: Environment Variables Add करें
- Project Settings → Environment Variables
- सभी variables `.env.local` से copy करें

### Manual Deployment

```bash
# Build करें
npm run build

# Production server start करें
npm start
```

---

## 🐛 ट्रबलशूटिंग

### आम समस्याएं और समाधान

#### 1. **AI API काम नहीं कर रहा**
```
Error: No AI API key configured
```

**समाधान:**
- `.env.local` file check करें
- `OPENAI_API_KEY` या `GITHUB_TOKEN` set है या नहीं verify करें
- Development server restart करें

---

#### 2. **RAWG API Rate Limit**
```
Error: RAWG API rate limit exceeded
```

**समाधान:**
- Free tier: 20,000 requests/month
- Caching implement करें
- `next: { revalidate: 3600 }` use करें

---

#### 3. **MongoDB Connection Failed**
```
Error: MONGODB_URI not set
```

**समाधान:**
- App MongoDB के बिना भी काम करता है (JSON data use करता है)
- Enable करने के लिए: `.env.local` में `MONGODB_URI` add करें
- MongoDB optional है

---

#### 4. **Build Errors**
```
Error: Module not found
```

**समाधान:**
```bash
# Cache clear करें
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

**समाधान:**
- Client-side components के लिए `ClientOnly` wrapper use करें
- Dynamic elements में `suppressHydrationWarning` add करें
- Server components में browser-only APIs check करें

---

## 📚 सीखने के संसाधन

### Documentation Links
- [Next.js Docs](https://nextjs.org/docs) - Next.js documentation
- [React Docs](https://react.dev) - React documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Tailwind documentation
- [RAWG API](https://rawg.io/apidocs) - RAWG API docs
- [OpenAI API](https://platform.openai.com/docs) - OpenAI docs

### Video Tutorials (Hindi)
- Next.js Tutorial (Hindi)
- React Basics (Hindi)
- TypeScript Tutorial (Hindi)

---

## 🎓 Development Tips

### Code लिखते समय ध्यान दें:

1. **TypeScript Use करें**
   - सभी variables के लिए types define करें
   - `any` type से बचें

2. **Components छोटे रखें**
   - एक component में 300 lines से ज्यादा न हो
   - Reusable components बनाएं

3. **Error Handling**
   - हमेशा try-catch blocks use करें
   - User-friendly error messages दें

4. **Performance**
   - Images optimize करें
   - API responses cache करें
   - Heavy components lazy load करें

---

## 🤝 योगदान (Contributing)

Contributions welcome हैं! कृपया ये steps follow करें:

1. Repository fork करें
2. Feature branch बनाएं (`git checkout -b feature/AmazingFeature`)
3. Changes commit करें (`git commit -m 'Add AmazingFeature'`)
4. Branch पर push करें (`git push origin feature/AmazingFeature`)
5. Pull Request open करें

---

## 📄 License

यह project open source है और MIT License के तहत उपलब्ध है।

---

## 👨‍💻 Author

**PixelVerse Team**

सवालों या support के लिए, कृपया GitHub पर issue open करें।

---

## 🎉 धन्यवाद (Acknowledgments)

- **RAWG.io** - Game database API
- **OpenAI** - AI model
- **GitHub Models** - Free AI access
- **Vercel** - Hosting platform
- **Next.js Team** - Amazing framework

---

## Quick Start Checklist (हिंदी में)

- [ ] Repository clone करें
- [ ] Dependencies install करें (`npm install`)
- [ ] `.env.local` file बनाएं
- [ ] `OPENAI_API_KEY` या `GITHUB_TOKEN` add करें
- [ ] `RAWG_API_KEY` add करें
- [ ] `npm run dev` run करें
- [ ] `http://localhost:3000` open करें
- [ ] AI chat test करें
- [ ] Decision engine test करें
- [ ] RAWG games explore करें

---

## 📞 संपर्क (Contact)

अगर कोई सवाल है तो:
- GitHub Issues पर पूछें
- Documentation पढ़ें
- Community से जुड़ें

---

**Happy Gaming! 🎮**

**खुश गेमिंग! 🎮**
