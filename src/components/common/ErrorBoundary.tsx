import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Global Error Boundary
 * Catches runtime errors in the component tree and displays a graceful fallback.
 * Critical for production stability in high-performance audio apps.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white p-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-4">Something went wrong</h1>
          <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
            The application encountered an unexpected error. This might be due to a corrupted audio stream or a temporary connectivity issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:scale-105 active:scale-95 transition"
          >
            Reload Platform
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
