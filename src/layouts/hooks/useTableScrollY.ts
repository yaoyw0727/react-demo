import { useState, useEffect, useRef } from 'react';

interface UseTableScrollYOptions {
  offset?: number;
  debounceMs?: number;
}

export const useTableScrollY = (options: UseTableScrollYOptions = {}) => {
  const { offset = 60, debounceMs = 100 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(300);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(rect.height - offset);
      }
    };

    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(updateHeight, debounceMs);
    };

    updateHeight();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [offset, debounceMs]);

  return { containerRef, scrollY };
};