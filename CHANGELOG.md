# 📜 Changelog

All notable changes to the **Spotify Elite** project are documented in this file, which adheres to **Semantic Versioning** rules (`vMAJOR.MINOR.PATCH`).

---

## [2.0.0] - 2026-05-23

### Added
- **Global Header Redesign**: Overhauled `Navbar.tsx` to match the exact visual structure, margins, and alignments of Spotify's official desktop app.
- **Top Sidebar Toggle**: Integrated Left and Right sidebar dynamic collapse/expand triggers into the top header navigation.
- **Sleek Avatar Badge**: Implemented the white letter `'S'` Profile Avatar on a solid blue circle, matching desktop aesthetics.
- **Crisp SVG Vectors**: Swapped out PNGs in the header for lightweight, pixel-perfect inline SVG icons.

### Fixed
- **Navigation Redirection**: Standardized search input focus and typing behaviors to route users to `/search` without causing state loss.
- **Friend activity close**: Restored the dynamic close button to the Friend Social Activity box.

---

## [1.2.0] - 2026-05-22

### Added
- **Contextual Weather Telemetry**: Implemented browser geolocation queries paired with OpenWeather API integrations to sync playlists with local atmospheric conditions.
- **AI DJ Alex Voice Introductions**: Integrated standard speech synthesizers to vocalize smart song transitions based on current telemetry.
- **Weather Journal Timeline**: Built a timeline log visualizing previously played tracks alongside their corresponding weather data.

### Changed
- **Visual Overhaul**: Standardized Inter sans-serif typography, changed all neon tech glows to rich flat surfaces (`#121212`), and removed shouting uppercase labels.

### Fixed
- **Miniplayer White-on-White Bug**: Fixed the invisible white play icon inside the white play trigger button by adding the CSS class `brightness-0`.

---

## [1.1.0] - 2026-04-10

### Added
- **Media Session API**: Added support for OS-level media keys, enabling track controls via locking screens, hardware keys, and wireless controllers.
- **Frequency Audio Visualizer**: Integrated a Web Audio API AnalyserNode to drive real-time visualizer canvas elements.

### Performance
- **CSS variable decoupled progress**: Swapped out React progress bar state triggers for direct CSS variables, accelerating updates to 60FPS.

---

## [1.0.0] - 2026-01-15

### Added
- **Core Platform Release**: Released the core client featuring track playback, playlist generation, liked song indices, and local library files.
- **State Hydration**: Integrated persistent Zustand store layers to automatically restore player volume, queue, and library states across browser sessions.
