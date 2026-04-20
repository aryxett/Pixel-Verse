# 📡 PixelVerse API Reference

Complete API documentation for all endpoints.

---

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.vercel.app
```

---

## Table of Contents

1. [AI Endpoints](#ai-endpoints)
2. [Decision Engine](#decision-engine)
3. [Game Endpoints](#game-endpoints)
4. [RAWG Proxy Endpoints](#rawg-proxy-endpoints)
5. [Steam Endpoints](#steam-endpoints)
6. [Price Comparison](#price-comparison)
7. [Error Responses](#error-responses)
8. [Rate Limiting](#rate-limiting)

---

## AI Endpoints

### 1. POST /api/ai/recommend

Get AI-powered game recommendations based on user query.

**Endpoint:** `/api/ai/recommend`

**Method:** `POST`

**Request Body:**
```json
{
  "query": "string (required, max 500 chars)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "I want something relaxing tonight"}'
```

**Success Response (200):**
```json
{
  "recommendation": "Based on your mood, I recommend Stardew Valley. It's a peaceful farming simulator where you can take things at your own pace, perfect for unwinding after a long day."
}
```

**Error Response (400):**
```json
{
  "error": "query is required"
}
```

**Error Response (503):**
```json
{
  "error": "AI request timed out after 30s",
  "fallback": true
}
```

---

### 2. POST /api/ai/profile

Generate a gamer personality profile based on gaming preferences.

**Endpoint:** `/api/ai/profile`

**Method:** `POST`

**Request Body:**
```json
{
  "favoriteGames": ["string[]", "required", "min 1 game"],
  "playStyle": "string (required)",
  "hoursPerWeek": "number (required, positive)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/ai/profile \
  -H "Content-Type: application/json" \
  -d '{
    "favoriteGames": ["Elden Ring", "Hades", "Celeste"],
    "playStyle": "challenging",
    "hoursPerWeek": 15
  }'
```

**Success Response (200):**
```json
{
  "archetype": "The Challenger",
  "description": "You thrive on difficulty and mastery. Games that push your limits and reward persistence are your bread and butter. You're not afraid to die 100 times to beat a boss.",
  "strengths": [
    "Persistence and determination",
    "Pattern recognition",
    "Adaptability under pressure",
    "Mechanical skill development"
  ],
  "recommendations": [
    "Sekiro: Shadows Die Twice",
    "Hollow Knight",
    "Cuphead"
  ],
  "playstyleScore": {
    "strategy": 75,
    "action": 90,
    "exploration": 60,
    "social": 30,
    "creativity": 45
  }
}
```

**Error Response (400):**
```json
{
  "error": "favoriteGames must be an array with at least 1 game"
}
```

---

### 3. POST /api/ai/mood

Get mood-based game suggestions.

**Endpoint:** `/api/ai/mood`

**Method:** `POST`

**Request Body:**
```json
{
  "mood": "string (required, one of: chill, intense, adventurous, competitive, creative, social, focused)",
  "availableGames": "array of game objects (optional)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/ai/mood \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "chill",
    "availableGames": [
      {"title": "Stardew Valley", "genre": ["Simulation"], "mood": ["chill"]},
      {"title": "Minecraft", "genre": ["Sandbox"], "mood": ["chill", "creative"]}
    ]
  }'
```

**Success Response (200):**
```json
{
  "suggestion": "For a chill session, try Stardew Valley. It's perfect for unwinding with its peaceful farming gameplay and relaxing soundtrack."
}
```

---

### 4. GET /api/ai/health

Check AI service health status.

**Endpoint:** `/api/ai/health`

**Method:** `GET`

**Example Request:**
```bash
curl http://localhost:3000/api/ai/health
```

**Success Response (200):**
```json
{
  "online": true,
  "backend": "openai",
  "model": "gpt-4o-mini"
}
```

**Offline Response (200):**
```json
{
  "online": false,
  "backend": "none",
  "model": "gpt-4o-mini"
}
```

---

## Decision Engine

### POST /api/decision

AI-powered game decision engine with strict filtering.

**Endpoint:** `/api/decision`

**Method:** `POST`

**Request Body:**
```json
{
  "timeAvailable": "number (required, one of: 0.5, 1, 2, 3, 5)",
  "mood": "string (required, one of: chill, action, competitive, adventurous, creative, social, horror)",
  "device": "string (required, one of: low-end, mid, high)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/decision \
  -H "Content-Type: application/json" \
  -d '{
    "timeAvailable": 2,
    "mood": "action",
    "device": "high"
  }'
```

**Success Response (200):**
```json
{
  "results": [
    {
      "game": "Elden Ring",
      "slug": "elden-ring",
      "reason": "Epic action RPG perfect for 2-hour sessions on high-end systems. Challenging combat and stunning visuals.",
      "playtime": "~2h",
      "genre": ["RPG", "Action", "Souls-like"],
      "matchScore": 95,
      "image": "https://media.rawg.io/media/games/...",
      "rating": 9.6,
      "metacritic": 96,
      "releaseYear": 2022,
      "developer": "FromSoftware",
      "multiplayer": false
    },
    {
      "game": "DOOM Eternal",
      "slug": "doom-eternal",
      "reason": "Fast-paced FPS with intense action. Perfect for high-end PCs with 2-hour sessions.",
      "playtime": "~2h",
      "genre": ["Shooter", "Action"],
      "matchScore": 92,
      "image": "https://media.rawg.io/media/games/...",
      "rating": 8.8,
      "metacritic": 88,
      "releaseYear": 2020,
      "developer": "id Software",
      "multiplayer": false
    }
  ],
  "fallback": false
}
```

**Fallback Response (200):**
```json
{
  "results": [
    {
      "game": "Elden Ring",
      "slug": "elden-ring",
      "reason": "Epic open-world RPG for high-end systems.",
      "playtime": "~3h",
      "genre": ["RPG", "Action"],
      "matchScore": 90,
      "image": "",
      "rating": 4.8,
      "metacritic": 96,
      "releaseYear": 2022,
      "developer": "FromSoftware",
      "multiplayer": false
    }
  ],
  "fallback": true,
  "error": "AI request timed out"
}
```

**Error Response (400):**
```json
{
  "error": "timeAvailable must be positive number"
}
```

**Validation Rules:**
- `timeAvailable`: Must be 0.5, 1, 2, 3, or 5
- `mood`: Must be one of 7 valid moods
- `device`: Must be low-end, mid, or high

---

## Game Endpoints

### 1. GET /api/games

Get games from local database.

**Endpoint:** `/api/games`

**Method:** `GET`

**Query Parameters:**
- `trending` (optional): "true" to get only trending games
- `mood` (optional): Filter by mood (chill, intense, etc.)
- `search` (optional): Search query

**Example Requests:**
```bash
# Get all games
curl http://localhost:3000/api/games

# Get trending games
curl http://localhost:3000/api/games?trending=true

# Filter by mood
curl http://localhost:3000/api/games?mood=chill

# Search games
curl http://localhost:3000/api/games?search=elden
```

**Success Response (200):**
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
    "image": "https://images.igdb.com/igdb/image/upload/...",
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

---

### 2. GET /api/games/[id]

Get specific game details by ID.

**Endpoint:** `/api/games/[id]`

**Method:** `GET`

**Example Request:**
```bash
curl http://localhost:3000/api/games/elden-ring
```

**Success Response (200):**
```json
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
  "image": "https://images.igdb.com/igdb/image/upload/...",
  "coverColor": "#1a0a2e",
  "tags": ["open-world", "challenging", "dark-fantasy"],
  "mood": ["focused", "adventurous", "intense"],
  "trending": true,
  "aiScore": 95,
  "playtime": "60-100h",
  "multiplayer": false
}
```

**Error Response (404):**
```json
{
  "error": "Game not found"
}
```

---

## RAWG Proxy Endpoints

### 1. GET /api/rawg/search

Search games on RAWG.io.

**Endpoint:** `/api/rawg/search`

**Method:** `GET`

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)

**Example Request:**
```bash
curl "http://localhost:3000/api/rawg/search?q=elden&page=1"
```

**Success Response (200):**
```json
{
  "count": 42,
  "results": [
    {
      "id": 326243,
      "slug": "elden-ring",
      "name": "Elden Ring",
      "released": "2022-02-25",
      "background_image": "https://media.rawg.io/media/games/...",
      "rating": 4.48,
      "rating_top": 5,
      "ratings_count": 3542,
      "metacritic": 96,
      "playtime": 58,
      "platforms": [...],
      "genres": [...],
      "tags": [...]
    }
  ]
}
```

---

### 2. GET /api/rawg/game/[slug]

Get game details from RAWG by slug.

**Endpoint:** `/api/rawg/game/[slug]`

**Method:** `GET`

**Example Request:**
```bash
curl http://localhost:3000/api/rawg/game/elden-ring
```

**Success Response (200):**
```json
{
  "id": 326243,
  "slug": "elden-ring",
  "name": "Elden Ring",
  "description_raw": "Full game description...",
  "released": "2022-02-25",
  "background_image": "https://media.rawg.io/media/games/...",
  "rating": 4.48,
  "metacritic": 96,
  "playtime": 58,
  "platforms": [...],
  "genres": [...],
  "developers": [...],
  "publishers": [...],
  "tags": [...],
  "short_screenshots": [...],
  "ratings": [...],
  "esrb_rating": {...},
  "website": "https://..."
}
```

---

### 3. GET /api/rawg/trending

Get trending games from RAWG.

**Endpoint:** `/api/rawg/trending`

**Method:** `GET`

**Query Parameters:**
- `count` (optional): Number of games (default: 12, max: 40)

**Example Request:**
```bash
curl "http://localhost:3000/api/rawg/trending?count=10"
```

**Success Response (200):**
```json
[
  {
    "id": 326243,
    "slug": "elden-ring",
    "name": "Elden Ring",
    "background_image": "https://media.rawg.io/media/games/...",
    "rating": 4.48,
    "metacritic": 96,
    "playtime": 58,
    "platforms": [...],
    "genres": [...],
    "tags": [...]
  }
]
```

---

### 4. GET /api/rawg/explore

Explore games with advanced filters.

**Endpoint:** `/api/rawg/explore`

**Method:** `GET`

**Query Parameters:**
- `genre` (optional): Genre slug (e.g., "action", "rpg")
- `platform` (optional): Platform ID (e.g., "4" for PC)
- `ordering` (optional): Sort order (e.g., "-rating", "-metacritic")
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Results per page (default: 20, max: 40)

**Example Request:**
```bash
curl "http://localhost:3000/api/rawg/explore?genre=action&platform=4&ordering=-rating&page=1"
```

**Success Response (200):**
```json
{
  "count": 15234,
  "next": "https://api.rawg.io/api/games?page=2...",
  "previous": null,
  "results": [...]
}
```

---

### 5. GET /api/rawg/stores/[slug]

Get store information for a game.

**Endpoint:** `/api/rawg/stores/[slug]`

**Method:** `GET`

**Example Request:**
```bash
curl http://localhost:3000/api/rawg/stores/elden-ring
```

**Success Response (200):**
```json
{
  "results": [
    {
      "id": 1,
      "store": {
        "id": 1,
        "name": "Steam",
        "slug": "steam",
        "domain": "store.steampowered.com"
      },
      "url": "https://store.steampowered.com/app/1245620/"
    },
    {
      "id": 2,
      "store": {
        "id": 3,
        "name": "PlayStation Store",
        "slug": "playstation-store"
      },
      "url": "https://store.playstation.com/..."
    }
  ]
}
```

---

## Steam Endpoints

### GET /api/steam/[appId]

Get Steam game data by App ID.

**Endpoint:** `/api/steam/[appId]`

**Method:** `GET`

**Example Request:**
```bash
curl http://localhost:3000/api/steam/1245620
```

**Success Response (200):**
```json
{
  "steam_appid": 1245620,
  "name": "ELDEN RING",
  "short_description": "THE NEW FANTASY ACTION RPG...",
  "detailed_description": "Full HTML description...",
  "header_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
  "screenshots": [...],
  "movies": [...],
  "genres": [...],
  "categories": [...],
  "developers": ["FromSoftware Inc."],
  "publishers": ["Bandai Namco Entertainment"],
  "release_date": {
    "coming_soon": false,
    "date": "Feb 25, 2022"
  },
  "platforms": {
    "windows": true,
    "mac": false,
    "linux": false
  },
  "metacritic": {
    "score": 96,
    "url": "https://www.metacritic.com/..."
  },
  "recommendations": {
    "total": 542318
  },
  "price_overview": {
    "currency": "USD",
    "initial": 5999,
    "final": 5999,
    "discount_percent": 0,
    "final_formatted": "$59.99"
  },
  "is_free": false
}
```

**Error Response (404):**
```json
{
  "error": "Game not found on Steam"
}
```

---

## Price Comparison

### GET /api/prices

Compare prices across multiple stores.

**Endpoint:** `/api/prices`

**Method:** `GET`

**Query Parameters:**
- `game` (required): Game slug or ID

**Example Request:**
```bash
curl "http://localhost:3000/api/prices?game=elden-ring"
```

**Success Response (200):**
```json
{
  "game": "Elden Ring",
  "prices": [
    {
      "store": "Steam",
      "price": "$59.99",
      "currency": "USD",
      "discount": 0,
      "url": "https://store.steampowered.com/app/1245620/"
    },
    {
      "store": "PlayStation Store",
      "price": "$59.99",
      "currency": "USD",
      "discount": 0,
      "url": "https://store.playstation.com/..."
    },
    {
      "store": "Xbox Store",
      "price": "$59.99",
      "currency": "USD",
      "discount": 0,
      "url": "https://www.xbox.com/..."
    }
  ],
  "lowestPrice": {
    "store": "Steam",
    "price": "$59.99",
    "url": "https://store.steampowered.com/app/1245620/"
  }
}
```

---

## Error Responses

### Standard Error Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (AI timeout, external API down)

### Common Errors

#### 400 Bad Request
```json
{
  "error": "query is required"
}
```

#### 404 Not Found
```json
{
  "error": "Game not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "AI API error 500: Internal server error"
}
```

#### 503 Service Unavailable
```json
{
  "error": "AI request timed out after 30s",
  "fallback": true
}
```

---

## Rate Limiting

### Current Limits

- **AI Endpoints**: No built-in rate limiting (relies on OpenAI/GitHub limits)
- **RAWG Endpoints**: 20,000 requests/month (RAWG free tier)
- **Steam Endpoints**: No official limit (use responsibly)

### Best Practices

1. **Cache responses** when possible
2. **Implement client-side rate limiting**
3. **Use debouncing** for search inputs
4. **Handle 429 errors** gracefully

### Example Rate Limit Error

```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

---

## Authentication

Currently, all endpoints are **public** and do not require authentication.

For production, consider implementing:
- API key authentication
- JWT tokens
- Rate limiting per user/IP

---

## Caching

### Server-Side Caching

All external API calls use Next.js caching:

```typescript
fetch(url, {
  next: { revalidate: 3600 } // Cache for 1 hour
});
```

### Cache Durations

- **Game details**: 1 hour (3600s)
- **Trending games**: 30 minutes (1800s)
- **Search results**: 5 minutes (300s)
- **AI responses**: No cache (always fresh)

---

## Webhooks

Currently not implemented. Future consideration for:
- New game releases
- Price drops
- Trending changes

---

## SDK / Client Libraries

Currently not available. Use standard HTTP clients:

### JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:3000/api/ai/recommend', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'relaxing game' })
});
const data = await response.json();
```

### Python
```python
import requests

response = requests.post(
    'http://localhost:3000/api/ai/recommend',
    json={'query': 'relaxing game'}
)
data = response.json()
```

### cURL
```bash
curl -X POST http://localhost:3000/api/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{"query": "relaxing game"}'
```

---

## Changelog

### v0.1.0 (Current)
- Initial API release
- AI recommendation endpoints
- Decision engine
- RAWG proxy endpoints
- Steam integration
- Price comparison

---

## Support

For API issues or questions:
- Open an issue on GitHub
- Check documentation
- Review error messages

---

**API Version:** 0.1.0

**Last Updated:** April 2026
