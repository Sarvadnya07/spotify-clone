# 🔌 Integration & API Reference Guide

This document catalogs the integration protocols, authentication flows, WebSockets, and public service APIs powering **Spotify Elite**.

---

## 🔐 1. Spotify OAuth 2.0 PKCE Integration

Spotify Elite incorporates the high-security **Proof Key for Code Exchange (PKCE)** protocol to safely verify accounts without risking secret keys on client browsers.

### Authentication Topology
```
[Client App] ----------> 1. Generate verifier & challenge ----------> [User Agent]
     |                                                                   |
     |                                                                   | 2. Redirect to Spotify Auth
     |                                                                   v
     | <--- 4. Code exchange <--- 3. Redirect back with ?code= -------- Spotify Login
     v
[Spotify Token Endpoint] (Exchanges code + verifier for access token)
```

### Protocol Details
- **Authorization Endpoint**: `https://accounts.spotify.com/authorize`
- **Token Endpoint**: `https://accounts.spotify.com/api/token`
- **Scope Parameters**: `user-read-private user-read-email user-library-read user-top-read playlist-read-private`

### In-Memory Client Payload (`SpotifyAuthService.ts`):
```typescript
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
```

---

## ☁️ 2. OpenWeather Atmospheric Telemetry

The weather telemetry engine pulls real-time environmental conditions to sync music context.

- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Protocol**: HTTP GET
- **Query Params**:
  ```ini
  lat={latitude}
  lon={longitude}
  appid={VITE_WEATHER_API_KEY}
  units=metric
  ```

### Normalized Telemetry Object (`WeatherData`):
```json
{
  "temp": 24.5,
  "condition": "Clouds",
  "location": "Mumbai"
}
```

### Fallback Safe Engine:
If the telemetry endpoint returns an HTTP error code (e.g. `401 Unauthorized` or `429 Rate Limited`), the system falls back to a clean mock condition representing `"Clear"` at `20°C` to guarantee uninterrupted audio playback.

---

## 👥 3. Social Activity WebSockets

Our real-time social session synchronization operates via low-overhead WebSockets.

- **Provider**: Socket.io / WebSocket Server
- **Endpoint**: `WS_SERVER_URL` (configured via env variables)

### Dispatched Events:

#### 1. Outbound listening updates:
```json
{
  "event": "SOCIAL_UPDATE",
  "payload": {
    "user": "Sarvadnya",
    "trackId": 3,
    "timestamp": 1716503923380
  }
}
```

#### 2. Inbound listening notifications:
When a connected friend switches tracks, the client receives the payload:
```json
{
  "event": "SOCIAL_UPDATE",
  "payload": {
    "user": "Alex",
    "trackId": 1
  }
}
```

---

## 🎙️ 4. AI DJ Speech Synthesis Engine

The AI DJ Alex uses the internal `window.speechSynthesis` API for premium Premium account voice introducers.

### Action Payload Blueprint:
```typescript
interface SpeechConfiguration {
  text: string;           // Narrated text
  pitch: 0.9;             // Deepened resonance
  rate: 0.95;             // Paced, realistic cadence
  volume: 1.0;            // Full audio saturation
}
```

### Semantic Prompt Context Example:
```typescript
const prompt = `You are AI DJ Alex on Spotify. Introduce the song "${track.name}" by "${track.desc}" given the current weather is ${weather.temp}°C and ${weather.condition}. Keep it under 2 sentences, slick, cool, and highly conversational.`;
```

### UI Integration & Store Triggers:
The DJ overlay is tightly coupled to `usePlayerStore` via the `showDjOverlay` and `toggleDjOverlay` actions. 
- The user triggers the overlay via a prominent, pulsing UI button in the Player control bar.
- Upon activation, the `showDjOverlay` boolean flags the `DJOverlay.tsx` component to mount, rendering the animated DJ interface and automatically initiating the voice sequence.

---

## 🛡️ Integration Error Handling Guidelines

1. **Graceful Degradation**: Always warp API requests inside standard `try/catch` wrappers. If external connections fail, drop back to local in-memory mock assets instantly.
2. **Rate Limit Jitter**: When encountering HTTP `429 Too Many Requests`, use exponential backoff with random jitter to schedule retries, preserving system resource slots.
3. **Partial Hydration Guard**: Hydrate Zustand states with a validation checker (`isObject`) to ensure incomplete or deprecated localStorage objects are discarded immediately.
