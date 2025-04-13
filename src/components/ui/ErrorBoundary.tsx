
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h1>
          <p className="text-red-600 text-center">
            We apologize for the inconvenience. Please try refreshing the page or contact support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
