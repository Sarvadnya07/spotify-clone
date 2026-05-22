# 🎧 Spotify Elite — High-Performance, Weather-Aware Streaming Client

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Spotify Elite** is a production-grade, highly optimized music streaming platform engineered for ultra-low latency, real-time social syncing, and contextual weather intelligence. Built with **React 18**, **TypeScript**, and **Vite**, it leverages a custom-built Web Audio engine and hardware-accelerated rendering pipelines to deliver a polished, enterprise-ready music streaming experience.

---

## 🚀 Unique Engineering Highlights (USP)

- **Contextual Music Telemetry**: Automatically syncs music playback recommendations with real-time local weather metrics (e.g. rainy, sunny, freezing) using the OpenWeather API.
- **AI DJ Alex Voice Synthesis**: Cross-references local ambient conditions and current track metadata to dynamically generate and vocalize (browser Speech Synthesis) slick, contextual introductions.
- **CSS-Variable Decoupling**: Progress and volume updates are decoupled from React's state loop and written directly to DOM CSS variables, locking the UI rendering at a smooth **60FPS** during playback.
- **Surgical Store Hydration**: Leverages custom Zustand storage partialization to hydrate only critical variables, keeping local storage clean and load times fast.
- **PKCE Authentication Flow**: Safe, secret-free OAuth 2.0 PKCE authentication flow, eliminating client-side credential exposure.

---

## ✨ Key Features

- 🎙️ **Ambient AI DJ Alex**: A weather-aware voice assistant that narrates song transitions.
- 📊 **Real-time Audio Visualizer**: A high-DPR rendering frequency bar powered by the Web Audio API.
- 👥 **Real-time Social Hub**: Event-driven WebSockets sync playback queues and track listening states with online friends instantly.
- 📖 **Weather Journal**: A timeline log tracking previously played songs alongside local weather conditions.
- 🎯 **Advanced Playback Overlays**: Precision-synced lyrics scroll panel, transactional queue overlays, and interactive audio panning controls.

---

## 🛠️ Architecture & Tech Stack

```text
spotify-clone/
├── src/
│   ├── assets/           # Static audio files, artwork & assets database
│   ├── components/       # Presentation & high-performance UI components
│   │   ├── layout/       # Sidebar, Navbar, and Display frame panels
│   │   └── ui/           # Reusable controls, buttons, and portals
│   ├── core/             # Types, interfaces, and baseline configurations
│   ├── features/         # Modular feature panels (Visualizer, Player, Weather)
│   ├── hooks/            # Custom hooks (useAudioEngine, useWeather)
│   ├── services/         # Decoupled API singletons (Socket, AI DJ, OAuth)
│   └── store/            # Lightweight Zustand reactive state containers
├── public/               # Static PWA manifests and public icons
├── tsconfig.json         # Strict TypeScript compile rules
├── tailwind.config.js    # Design tokens, themes, and colors
└── vite.config.ts        # Fast bundling & module maps
```

- **Framework**: React 18 (Concurrent rendering path)
- **Tooling & Bundler**: Vite + TypeScript 5
- **State Management**: Zustand + Persistence Middleware
- **Acoustics & Visuals**: HTML5 Audio + Web Audio API AnalyserNode
- **Styling & Layout**: Tailwind CSS + Framer Motion GPU assets

---

## 📥 Getting Started

### 1. Prerequisites
Ensure you have **Node.js v18+** and npm/yarn installed.

### 2. Quick Setup
```bash
# Clone the codebase
git clone https://github.com/Sarvadnya07/spotify-clone.git
cd spotify-clone

# Install packages
npm install

# Copy env template
cp .env.example .env
```

### 3. Environment Setup
Configure your keys inside `.env`:
```ini
# Core Configuration
VITE_MUSIC_PROVIDER=local

# Atmospheric Telemetry API
VITE_WEATHER_API_KEY=your_openweathermap_api_key_here

# Spotify OAuth Configuration (For PKCE Connect)
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

### 4. Boot Dev Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ⚡ Performance Optimization

- **Surgical Subscriptions**: Prevents layout reflows by utilizing granular Zustand store selectors.
- **Paint Boundaries**: Hidden panels utilize CSS containment rules (`contain: layout style`) to instruct the browser to skip layout and paint loops for off-screen elements.
- **Hardware Acceleration**: Transitions are promoted to dedicated GPU layers using hardware properties (`will-change: transform`).

---

## 📜 Documentation Index

To explore our complete developer documentation ecosystem, check out the following guides:
- 🏛️ [System Architecture](ARCHITECTURE.md): Visual charts, state topology, and deep design choices.
- 🔌 [API & Integration Reference](API_GUIDE.md): Cataloging WebSockets, weather telemetry payloads, and PKCE OAuth.
- 🛠️ [Setup & Troubleshooting](SETUP_GUIDE.md): Troubleshooting dev configurations, port conflicts, and dependencies.
- 🛡️ [Security Protocol](SECURITY.md): Threat modeling, client-side token safety, and secure disclosure.
- ⚡ [Performance Engineering](PERFORMANCE.md): Decoupling high-frequency loops and rendering boundaries.
- 🤝 [Contributing Guidelines](CONTRIBUTING.md): PR requirements, linting rules, and branch strategies.
- 🧪 [QA & Testing Guide](TESTING_GUIDE.md): Testing commands, mocks, and E2E coverage.
- 🚀 [Deployment Manual](DEPLOYMENT.md): Serves as Nginx Docker setups, Vercel SPA routing, and CI/CD pipelines.

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Maintainer

**Sarvadnya** - *Lead Architect & Engineer*
- GitHub: [@Sarvadnya07](https://github.com/Sarvadnya07)
