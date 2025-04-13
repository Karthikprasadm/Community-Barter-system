
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ApiOptions {
  errorMessage?: string;
  successMessage?: string;
  retryCount?: number;
  retryDelay?: number;
}

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  retries: number;
}

export function useReliableApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
    retries: 0,
  });
  const { toast } = useToast();

  const callApi = useCallback(
    async (
      apiFunction: () => Promise<T>,
      options: ApiOptions = {}
    ): Promise<{success: boolean; data?: T; error?: Error}> => {
      const {
        errorMessage = 'Something went wrong. Please try again.',
        successMessage,
        retryCount = 2,
        retryDelay = 1000,
      } = options;

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      let currentTry = 0;
      let lastError: Error | null = null;

      while (currentTry <= retryCount) {
        try {
          const result = await apiFunction();
          
          setState({
            data: result,
            isLoading: false,
            error: null,
            retries: currentTry,
          });

          if (successMessage) {
            toast({
              title: 'Success',
              description: successMessage,
            });
          }

          return { success: true, data: result };
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          setState(prev => ({
            ...prev,
            retries: currentTry,
          }));

          // If we've reached our retry limit, break out of the loop
          if (currentTry >= retryCount) break;
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          currentTry++;
        }
      }

      // If we've reached this point, all retries have failed
      setState({
        data: null,
        isLoading: false,
        error: lastError,
        retries: currentTry,
      });

      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });

      return { success: false, error: lastError as Error };
    },
    [toast]
  );

  const resetState = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      retries: 0,
    });
  }, []);

  return {
    ...state,
    callApi,
    resetState,
  };
}
