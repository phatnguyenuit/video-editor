import { useRef, useCallback } from 'react';

export default function useDebounceCallback(callback, delay, immediate) {
  const timer = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      const later = () => {
        timer.current = null;
        if (!immediate) {
          callback.apply(null, args);
        }
      };

      const callNow = !timer.current && immediate;
      clearTimeout(timer.current);

      timer.current = setTimeout(later, delay);

      if (callNow) {
        callback.apply(null, args);
      }
    },
    [callback, delay, immediate],
  );

  return debouncedCallback;
}
