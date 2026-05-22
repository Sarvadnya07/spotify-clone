# 🤝 Contributing Guidelines

First off, thank you for taking the time to contribute to **Spotify Elite**! 

To maintain the high performance, accessibility, and clean architecture of this codebase, all contributors must follow our professional development workflows.

---

## 🌿 1. Git Branching Strategy

Our repository uses a simplified branch layout to keep development fast and clean:
- **`main`**: Production-ready branch. Must remain stable and compile successfully at all times.
- **Feature Branches (`feature/name-here`)**: Dedicated branches for new features.
- **Bugfix Branches (`bugfix/issue-name`)**: Dedicated branches for fixing reported bugs.

---

## 🛠️ 2. Development Workflow

Follow these steps to contribute your changes:

1. **Fork the Repository**: Create your own copy of the repository on GitHub.
2. **Create a Branch**: Create a feature branch off of the latest `main`:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
3. **Install Dependencies**: Install package managers and tools locally:
   ```bash
   npm install
   ```
4. **Develop and Test**: Implement your changes and verify that the test suite passes:
   ```bash
   npm run test
   ```
5. **Format and Lint**: Ensure your code meets our styling guidelines:
   ```bash
   npm run lint
   ```
6. **Commit Code**: Write clean, descriptive commits using semantic style:
   ```bash
   git commit -m "feat: add dynamic keyboard shortcut listeners"
   ```
7. **Submit Pull Request**: Open a Pull Request targeting our `main` branch.

---

## 🎨 3. Coding Standards & Styling

To keep the codebase easy to maintain, we enforce these style guidelines:

### A. TypeScript Guidelines
- Avoid using `any` casts. Use strict interfaces, generics, and return types.
- Put shared types and interfaces inside `/src/core/types.ts`.

### B. Code Style
- Run Prettier formatting before committing code.
- Group React imports first, followed by third-party packages, and then local components or hooks.

### C. State Management
- Never subscribe components to the entire Zustand store. Always use surgical selectors to prevent redundant component re-renders:
  ```typescript
  // Recommended
  const track = usePlayerStore(state => state.track);
  ```

---

## 🔍 4. Pull Request Review Checklist

Before submitting your PR, verify that it meets the following criteria:
- [ ] Code builds successfully with zero compilation warnings or errors (`npm run build`).
- [ ] Test coverage does not decrease.
- [ ] Key interactions (like progress sliders or toggles) work smoothly in the browser.
- [ ] Accessibility is maintained (elements have proper ARIA labels and roles).
- [ ] The PR description clearly details the changes made, the problem solved, and verification steps.
