'use client';

import { useEffect, useMemo, useRef } from "react";

type Callback<T extends (...args: unknown[]) => void> = T;

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: Callback<T>,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useRef(callback);

  useEffect(() => {
    cb.current = callback;
  }, [callback]);

  return useMemo(() => {
    return (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        cb.current(...args);
      }, delay);
    };
  }, [delay]);
}
