import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Global Error Boundary
 * Catches runtime errors in the component tree and displays a fallback UI
 * to prevent the entire application from crashing.
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
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
          <p className="text-gray-400 mb-8 max-w-md">
            The application encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#1db954] text-black font-bold rounded-full hover:scale-105 transition"
          >
            Refresh Player
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
