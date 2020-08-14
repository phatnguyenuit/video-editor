import { useRef, useCallback, useEffect } from 'react';

/**
 * Use Throttle callback
 * @param {Function} callback Callback
 * @param {number} limit Accepted limit time for the next callback execution
 */
const useThrottle = (callback, limit) => {
  const waiting = useRef(false);
  const callbackRef = useRef(callback);
  const enhancedCallback = useCallback(
    (...args) => {
      if (!waiting.current) {
        waiting.current = true;
        callbackRef.current.apply(null, args);
        setTimeout(() => {
          waiting.current = false;
        }, limit);
      }
    },
    [limit],
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return enhancedCallback;
};

export default useThrottle;
