# Spotify Elite

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)

**Spotify Elite** is a high-performance, weather-aware music streaming platform engineered for ultra-low latency and contextual intelligence. Built with React 18 and TypeScript, it leverages a custom-built audio engine and hardware-accelerated rendering pipelines to deliver a "Top 1%" industry-standard experience.

---

## 🚀 Unique Selling Points (USP)

- **Contextual Intelligence Engine**: Synchronizes music recommendations with real-time local weather and atmospheric conditions.
- **Zero-Lag Architecture**: Surgical state management via Zustand and hardware-accelerated CSS variables ensure constant 60FPS during high-frequency UI updates.
- **SaaS-Grade UI**: A minimalist, distraction-free "Elite Dark" design system focused on professional-grade typography and density.
- **Pre-fetch Intelligence**: Background asset pre-loading that anticipates user navigation, resulting in near-instantaneous playback triggers.

---

## ✨ Key Features

- **Real-time Audio Visualizer**: Sharp, high-DPR frequency bar rendering using Web Audio API.
- **Media Session Integration**: Full support for system-level media controls and background playback metadata.
- **Weather-Music Sync**: Algorithmic Daily Mixes that adapt to environmental telemetry.
- **Advanced Social Hub**: Integrated "Friend Activity" simulation with real-time session syncing.
- **Elite Playback Controls**: Miniplayer, real-time lyrics synchronization, and transactional queue management.

---

## 🛠 Tech Stack

- **Core**: React 18, TypeScript, Vite
- **State Management**: Zustand (with Persistent Middleware)
- **Audio Engine**: HTMLAudioElement + Web Audio API Analyser
- **Styling**: Tailwind CSS (JIT Engine)
- **Animations**: Framer Motion (Optimized GPU paths)
- **Architecture**: Singleton Service Pattern

---

## 📦 Folder Structure

```text
spotify-clone/
├── src/
│   ├── assets/           # Static assets & Music database
│   ├── components/       # High-performance UI components
│   ├── hooks/            # Custom hooks (AudioEngine, Weather, etc.)
│   ├── services/         # API & Data services (Singleton pattern)
│   ├── store/            # Zustand state containers
│   ├── types/            # Strict TypeScript definitions
│   └── App.tsx           # Production-hardened root
├── public/               # Public assets & PWA manifest
├── .eslintrc.js          # Industrial linting rules
├── tailwind.config.js    # Design tokens & Utility mapping
└── package.json          # Dependency manifest
```

---

## 📥 Installation

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

### Step-by-Step Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spotify-clone.git
   cd spotify-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_MUSIC_PROVIDER=local
   VITE_WEATHER_API_KEY=your_openweather_key
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

---

## ⚡ Performance & Optimization

- **Granular Selectors**: Every store subscription is surgical to prevent parent re-renders.
- **Content Visibility**: Off-screen elements use `content-visibility: auto` to bypass layout thrashing.
- **GPU Acceleration**: All cinematic transitions are forced onto the GPU layer via `translateZ(0)`.
- **Progress Decoupling**: Progress bar updates are handled via CSS variables to bypass React's render loop entirely.

---

## 🛡 Security Considerations

- **Strict Typing**: 100% TypeScript coverage to prevent runtime type-errors.
- **Sanitized State**: Persistent storage is partially hydrated to prevent sensitive data exposure.
- **Environment Safety**: API keys and providers are managed via `import.meta.env` to prevent credential leaking.

---

## 🤝 Contributing

We welcome professional-grade contributions. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sarvadnya** - *Lead Engineer & Architect*
- GitHub: [@Sarvadnya07](https://github.com/Sarvadnya07)
