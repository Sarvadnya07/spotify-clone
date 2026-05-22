# 🧪 Quality Assurance & Testing Guide

This document describes the testing strategy, test commands, mock settings, and QA standards implemented in **Spotify Elite**.

---

## 📐 1. Testing Strategy

Spotify Elite maintains high code quality using a layered testing approach:
1. **Unit Testing**: Tests core state transactions in Zustand stores (`usePlayerStore` and `useAuthStore`) using Vitest.
2. **Component Testing**: Verifies isolated rendering of UI components (e.g. `SongItem`, `Navbar`) under JSDOM.
3. **Integration Mocks**: Mocking external services (OpenWeather, Speech Synthesis, WebSockets) to ensure reliable test execution.

---

## 🏃 2. Running Tests

The test suite is powered by **Vitest** for fast performance and Hot Module Replacement (HMR).

### Execute the Full Test Suite:
```bash
npm run test
```

### Run Tests in Watch Mode (Interactive TDD):
```bash
npm run test:watch
```

### Run Coverage Reports:
```bash
npm run test:coverage
```

---

## 🧩 3. Mocking External Services

Because our application depends on browser APIs and external web services, we mock them during testing to prevent brittle test results.

### A. Geolocation & Weather Mocks (`tests/setup.ts`):
```typescript
// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn().mockImplementationOnce((success) => success({
    coords: {
      latitude: 19.0760,
      longitude: 72.8777
    }
  }))
};
global.navigator.geolocation = mockGeolocation as any;
```

### B. Speech Synthesis Mocks:
```typescript
global.window.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn().mockReturnValue([{ name: 'Google US English', lang: 'en-US' }])
} as any;
```

---

## 🎯 4. Critical Edge Cases to Test

When modifying the playback or state engine, ensure the following edge cases are covered:
- **Network Buffering**: Verify the `isBuffering` state flips to `true` during slow track loads, displaying the correct loading indicators in the UI.
- **Geolocation Timeout**: Ensure that if a user blocks browser location permissions, the app gracefully degrades to the default `'Clear'` weather fallback state instead of crashing.
- **Empty Queues**: Test that trigger commands (like `playNext`) loop back to the first track when the playlist queue is empty.

---

## 🚀 5. Future E2E Automation Roadmap

To achieve absolute "Top 1%" quality, we plan to implement automated End-to-End (E2E) testing:
- **Tooling**: Playwright or Cypress.
- **Focus Areas**: Audio playback start triggers, WebSocket synchronization across multiple virtual clients, and responsive layout testing on mobile devices.
