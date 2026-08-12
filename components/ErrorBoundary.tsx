import React, { ErrorInfo, ReactNode } from "react";
import { RefreshCcw, TriangleAlert } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-skeuo-raised border border-white max-w-md text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <TriangleAlert className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-serif-heading font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8 text-sm">
              We encountered an unexpected error. Our tech team has been notified. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center mx-auto hover:bg-brand-dark transition"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Reload Page
            </button>
            {this.state.error && (
                <details className="mt-6 text-left">
                    <summary className="text-xs font-bold text-gray-400 cursor-pointer uppercase tracking-wider">Error Details</summary>
                    <pre className="mt-2 bg-gray-100 p-4 rounded-lg text-[10px] text-gray-600 overflow-auto">
                        {this.state.error.toString()}
                    </pre>
                </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;