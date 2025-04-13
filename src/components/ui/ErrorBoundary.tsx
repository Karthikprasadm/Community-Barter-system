
import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Lazy load component for error details
const ErrorDetails = React.lazy(() => 
  new Promise<{ default: React.ComponentType<{ error: Error }> }>(resolve => 
    setTimeout(() => 
      resolve({ 
        default: ({ error }: { error: Error }) => (
          <div className="bg-white p-4 rounded-md shadow-sm w-full max-w-lg mb-4 overflow-auto animate-fade-in">
            <h3 className="font-semibold text-gray-800 mb-2">Error Details:</h3>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {error.toString()}
            </pre>
          </div>
        )
      }), 
      300
    )
  )
);

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also send this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-red-700 mb-2"
          >
            Something went wrong
          </motion.h1>
          
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-red-600 text-center mb-6 max-w-md"
          >
            We apologize for the inconvenience. Please try refreshing the page or contact support.
          </motion.p>
          
          {this.state.error && (
            <Suspense fallback={<Skeleton className="w-full h-32 max-w-lg mb-4" />}>
              <ErrorDetails error={this.state.error} />
            </Suspense>
          )}
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={this.handleReset} 
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
