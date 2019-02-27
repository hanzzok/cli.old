import { useEffect } from 'react';

export function useInterval(callback: () => void, interval: number) {
  useEffect(() => {
    const instance = setInterval(callback, interval);

    return () => {
      clearInterval(instance);
    };
  }, []);
}
