
import React, { Component, ErrorInfo, ReactNode, Suspense, lazy } from 'react';
import { AlertTriangle, RefreshCw, ExternalLink, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
  logKey: string; // Used to force remounting when we need to
}

// Lazy load component for error details to reduce initial bundle size
const ErrorDetails = lazy(() => 
  new Promise<{ default: React.ComponentType<{ error: Error, errorInfo?: ErrorInfo }> }>(resolve => 
    setTimeout(() => 
      resolve({ 
        default: ({ error, errorInfo }: { error: Error, errorInfo?: ErrorInfo }) => (
          <div className="bg-white p-4 rounded-md shadow-sm w-full max-w-lg mb-4 overflow-auto animate-fade-in">
            <Accordion type="single" collapsible>
              <AccordionItem value="error-message">
                <AccordionTrigger className="text-left font-semibold text-gray-800">
                  Error Message
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 font-mono overflow-auto max-h-[200px]">
                    {error.toString()}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {errorInfo && (
                <AccordionItem value="stack-trace">
                  <AccordionTrigger className="text-left font-semibold text-gray-800">
                    Component Stack
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 font-mono overflow-auto max-h-[300px]">
                      <pre>{errorInfo.componentStack}</pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        )
      }), 
      300
    )
  )
);

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    showDetails: false,
    logKey: 'initial' // Used to force remount of the error logs component
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Here you could also send the error to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  private handleReset = () => {
    // Clear the error state and trigger a re-render
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      showDetails: false
    });
  };
  
  private toggleDetails = () => {
    // Toggle the visibility of additional error details
    this.setState(prevState => ({ 
      showDetails: !prevState.showDetails,
      logKey: prevState.showDetails ? prevState.logKey : `log-${Date.now()}` // Force remount when showing
    }));
  };
  
  private reportError = () => {
    // In a real app, this would send the error to your reporting service
    // For now, we'll just alert to show this is working
    alert("This would report the error to your error tracking service in a real application.");
    
    // You could use something like:
    // sendToErrorReportingService({
    //   error: this.state.error,
    //   errorInfo: this.state.errorInfo,
    //   userInfo: { /* user context */ }
    // });
  };

  public render() {
    const { hasError, error, errorInfo, showDetails, logKey } = this.state;
    
    if (hasError) {
      return this.props.fallback || (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Something went wrong
            </motion.h1>
            
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-center mb-6"
            >
              We apologize for the inconvenience. The application has encountered an unexpected error.
            </motion.p>
            
            {error && showDetails && (
              <motion.div
                key={logKey} // Using key to force remount when toggling
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <Suspense fallback={<Skeleton className="w-full h-32 max-w-lg mb-4" />}>
                  <ErrorDetails error={error} errorInfo={errorInfo} />
                </Suspense>
              </motion.div>
            )}
            
            <div className="flex flex-col md:flex-row justify-center gap-3 mb-2">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={this.handleReset} 
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline"
                  onClick={this.toggleDetails} 
                  className="flex items-center gap-2"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show Details
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline"
                  onClick={this.reportError} 
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Report Bug
                </Button>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-xs text-gray-500"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center gap-1 cursor-help">
                      <Terminal className="h-3 w-3" />
                      <span>Error Code: {Math.floor(Math.random() * 9000) + 1000}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Share this code when reporting the issue</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
