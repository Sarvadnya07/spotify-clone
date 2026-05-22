# 🛠️ Installation & Setup Manual

This manual provides instructions for setting up, configuring, running, and troubleshooting the **Spotify Elite** development environment.

---

## 📋 Prerequisites

Ensure your development workstation meets the minimum version requirements:
- **Node.js**: `v18.18.0` or higher (Recommended: `v20.x` LTS)
- **Package Manager**: `npm v9.x+` (or `yarn v1.22+` / `pnpm v8.x+`)
- **Supported OS**: Windows 10/11, macOS (Ventura+), or Linux (Ubuntu 22.04+)

---

## 🚀 Step-by-Step Installation

### 1. Clone the Codebase
```bash
git clone https://github.com/Sarvadnya07/spotify-clone.git
cd spotify-clone
```

### 2. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```
Open the `.env` file in your preferred editor and populate the variables:
```ini
# Core Configuration
VITE_MUSIC_PROVIDER=local

# OpenWeather API Configuration
VITE_WEATHER_API_KEY=your_openweather_api_key_here

# Spotify OAuth Configuration (For PKCE Connect)
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

### 3. Install NPM Packages
```bash
npm install
```

### 4. Boot the Dev Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173` with instant Hot Module Replacement (HMR) active.

---

## 🏗️ Building for Production

To create an optimized, production-ready assets bundle:
```bash
npm run build
```
This builds your distribution bundle inside the `/dist` directory. You can test the production build locally using:
```bash
npm run preview
```

---

## 🛠️ Common Troubleshooting Guide

### 1. Port Collision (`5173` already in use)
If port `5173` is bound to another running process:
- **Symptom**: Dev server starts on `5174` or fails with `EADDRINUSE`.
- **Solution**: Explicitly allocate a new port using:
  ```bash
  npx vite --port 8080
  ```

### 2. Image Optimization and Visualizer Warnings
- **Warning**: `vite-plugin-imagemin not installed. Skipping image optimization.`
- **Explanation**: This is a non-blocking warning. Image compression and Rollup bundle analyzer are bypassed in local dev mode to accelerate HMR compile loops. Production bundles compile cleanly without these plugins.

### 3. Node-GYP Compilation Failures
- **Symptom**: `npm install` crashes trying to compile native C++ modules.
- **Solution**: Ensure you are running Node LTS. Run standard clean commands before installing dependencies:
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## 🧪 Quick Verification
To verify the absolute integrity of the setup, run:
```bash
# Verify TypeScript compile paths
npx tsc --noEmit

# Run unit tests
npm run test
```
If both commands exit with a zero status, your environment is fully configured and ready for development!
