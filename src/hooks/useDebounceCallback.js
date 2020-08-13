import { useRef, useCallback, useEffect } from 'react';

export default function useDebounceCallback(callback, delay, immediate) {
  const timer = useRef(null);
  const debouncedCallback = useRef();

  const enhancedCallback = useCallback(
    (...args) => {
      const later = () => {
        timer.current = null;
        if (!immediate) {
          debouncedCallback.current.apply(null, args);
        }
      };

      const callNow = !timer.current && immediate;
      clearTimeout(timer.current);

      timer.current = setTimeout(later, delay);

      if (callNow) {
        debouncedCallback.current.apply(null, args);
      }
    },
    [delay, immediate],
  );

  useEffect(() => {
    debouncedCallback.current = callback;
  }, [callback]);

  return enhancedCallback;
}
