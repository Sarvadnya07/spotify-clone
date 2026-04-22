# 🎵 Spotify Clone — Premium Music Streaming Experience

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A high-fidelity, production-ready music streaming interface built with the modern React ecosystem. This project replicates the core Spotify experience, featuring a seamless audio player, dynamic routing, and a pixel-perfect UI.

🔗 **Live Demo:** [spotify-clone-psi-red.vercel.app](https://spotify-clone-psi-red.vercel.app/)

---

## 📖 Overview

The **Spotify Clone** is more than just a UI replica; it is a full-featured frontend application designed to demonstrate modern web development best practices. Leveraging **React 18** and **Vite**, the application delivers near-instant load times and a fluid user experience. The global audio state is managed via the **Context API**, ensuring that music playback remains uninterrupted as users navigate through albums and artist pages.

### 🚀 Key Features

- **🎧 Persistent Audio Engine:** Global playback control that persists across route changes.
- **🎨 Pixel-Perfect UI:** Modern, responsive design using Tailwind CSS with glassmorphism and smooth transitions.
- **🧭 Dynamic Routing:** Client-side navigation with React Router Dom v6.
- **📱 Mobile Optimized:** Adaptive layouts for a seamless experience across all device types.
- **⚡ Performance First:** Optimized asset loading and Vite-powered HMR for a rapid development cycle.
- **🔍 Album & Song Discovery:** Dynamic rendering of music collections with detailed views.

---

## 📸 Screenshots

| Home Dashboard | Album View | Mobile Layout |
| :---: | :---: | :---: |
| ![Home](./screenshots/home.png) | ![Album](./screenshots/album.png) | ![Mobile](./screenshots/mobile.png) |

*(Note: Replace with actual screenshots in your repository)*

---

## 🛠 Tech Stack

### Frontend Core
- **Framework:** React 18 (Functional Components, Hooks)
- **Build Tool:** Vite (Ultra-fast bundling)
- **Routing:** React Router Dom v6
- **State Management:** React Context API (Audio/Player State)

### Styling & UI
- **CSS:** Tailwind CSS
- **Icons:** Custom SVG & Tailwind-based iconography
- **Typography:** System fonts optimized for readability

### Tooling
- **Linting:** ESLint (Flat Config)
- **Formatting:** Prettier
- **Environment:** Node.js (>=18)

---

## 🏗 Architecture

The project follows a modular, component-driven architecture:

- **`src/context`**: Houses the `PlayerContext`, managing audio refs, play/pause states, track progress, and volume.
- **`src/components`**: Atomic and molecular components like `AlbumItem`, `SongItem`, and the complex `Player` control bar.
- **`src/assets`**: Centralized storage for static assets and reusable media.

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Sarvadnya07/spotify-clone.git
cd spotify-clone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 📂 Folder Structure

```plaintext
spotify-clone/
├── public/                 # Static assets (audios, images)
├── src/
│   ├── assets/             # Icons and media files
│   ├── components/         # React components
│   │   ├── Player.jsx      # Bottom playback controls
│   │   ├── Sidebar.jsx     # Navigation and Library
│   │   ├── Navbar.jsx      # Top navigation header
│   │   └── ...             # Item components (Album, Song)
│   ├── context/            # Global State Management
│   │   └── PlayerContext.jsx
│   ├── App.jsx             # Root layout
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind & Global Styles
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite optimization settings
└── package.json            # Scripts and dependencies
```

---

## 🔐 Security Considerations

- **XSS Prevention:** React's built-in escaping handles most XSS vectors; however, any future user-generated content (comments, playlist names) should be sanitized.
- **Environment Variables:** Use `.env` for any future API keys (e.g., Spotify API, Supabase).
- **Dependency Audits:** Regularly run `npm audit` to check for vulnerable packages.

---

## 📈 Performance Optimization

- **Vite Bundling:** Optimized for production using Rollup under the hood.
- **Asset Optimization:** Large images are stored in `public` and should be compressed/converted to WebP for production.
- **Code Splitting:** Future implementations can use `React.lazy()` for route-based splitting.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Sarvadnya**
- GitHub: [@Sarvadnya07](https://github.com/Sarvadnya07)
- LinkedIn: [Profile Link](https://linkedin.com/in/yourprofile)

---

<p align="center">
  <i>Give this project a ⭐ if you like it!</i>
</p>
