import { useEffect, useState } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
export function useSimulatedFetch<T>(resolver: () => T, deps: unknown[] = [], delay = 650) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const key = JSON.stringify(deps);
  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    const timer = setTimeout(() => {
      try {
        const result = resolver();
        if (!cancelled) setState({ data: result, loading: false, error: null });
      } catch (e) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: e instanceof Error ? e.message : 'Failed to load data',
          });
        }
      }
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    }; 
  }, [key, delay]);

  return state;
}
