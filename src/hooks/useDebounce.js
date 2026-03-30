import { useState, useEffect } from 'react';

// Custom hook for debouncing values (like search inputs)
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also periodically checks)
    // This is how we prevent debounced value from updating if value is changed ...
    // ... within the delay period
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
