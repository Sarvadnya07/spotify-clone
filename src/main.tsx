import { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";

/* -----------------------------------------------------
   ⚡ Root Element Lookup (failsafe)
------------------------------------------------------ */

const ROOT_ID = "root";
const rootElement = document.getElementById(ROOT_ID);

if (!rootElement) {
  throw new Error(`[FATAL] Root element with id="${ROOT_ID}" not found.`);
}

/* -----------------------------------------------------
   ⚡ Diagnostics Wrapper
------------------------------------------------------ */

const DiagnosticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        "%c[INIT] Spotify Clone initialized.",
        "color:#1db954;font-weight:bold;"
      );
    }
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center bg-black text-white h-screen">
          <div className="animate-pulse text-xl">Loading Spotify...</div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

/* -----------------------------------------------------
   ⚡ Root React Tree
------------------------------------------------------ */

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <DiagnosticsWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DiagnosticsWrapper>
    </ErrorBoundary>
  </StrictMode>
);
