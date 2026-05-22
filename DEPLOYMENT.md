# 🚀 Production Deployment Manual

This manual provides instructions for containerizing, hosting, and deploying **Spotify Elite** to production environments.

---

## 🗂️ Deployment Options

Spotify Elite is a static Single Page Application (SPA). It can be compiled into HTML, CSS, and JS assets and hosted on any modern static file hosting provider:
1. **Static CDN Hosting** (Recommended: Vercel, Netlify, GitHub Pages, or AWS S3 + CloudFront).
2. **Containerized Hosting** (Recommended: Docker container behind an Nginx reverse proxy).

---

## 📦 Option A: Static Web Hosting (Vercel/Netlify)

Static hosting providers offer automated deployments from GitHub commits.

### Configure Redirects:
Because React Router uses client-side routing, you must configure your host to redirect all requests to `index.html` to prevent `404 Not Found` errors on page reloads.

#### For Vercel (`vercel.json`):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### For Netlify (`_redirects`):
```text
/*    /index.html   200
```

---

## 🐳 Option B: Containerized Nginx Deployment (Docker)

If you are deploying to a self-hosted server or container orchestration platform (e.g. AWS ECS, Kubernetes), use our Docker setup.

### 1. Build the Docker Image
```bash
docker build -t spotify-elite:latest .
```

### 2. Launch the Container
```bash
docker run -d -p 80:80 --name spotify-clone spotify-elite:latest
```
This serves the application via Nginx on port `80`.

---

## 🔁 CI/CD Automation (GitHub Actions)

Create a deployment workflow at `.github/workflows/deploy.yml` to automatically verify and deploy changes:

```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  validate-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-size: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Build
        run: npm run build
        env:
          VITE_WEATHER_API_KEY: ${{ secrets.VITE_WEATHER_API_KEY }}
          VITE_SPOTIFY_CLIENT_ID: ${{ secrets.VITE_SPOTIFY_CLIENT_ID }}
          VITE_SPOTIFY_REDIRECT_URI: ${{ secrets.VITE_SPOTIFY_REDIRECT_URI }}

      # Step to upload static assets to your chosen host (Vercel, AWS S3, etc.)
```

---

## 🔍 Post-Deployment Verification Checklist

Once the deployment finishes, run these quick smoke tests to confirm a successful release:
1. **Refresh Route Test**: Navigate to `https://yourdomain.com/search` and refresh the page. If the page reloads successfully, client-side routing is configured correctly.
2. **Weather Telemetry Handshake**: Verify that the homepage successfully fetches local weather telemetry or gracefully degrades to the fallback state rather than showing a blank screen.
3. **Asset Load Check**: Open the browser console to verify that all heavy mp3 audio files and image artwork load successfully with standard `200 OK` or `206 Partial Content` HTTP status codes.
