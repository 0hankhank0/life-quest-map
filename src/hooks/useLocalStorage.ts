"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  createInitialValue: () => T,
  normalizeValue?: (value: unknown) => T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(() => createInitialValue());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (rawValue) {
        const parsedValue: unknown = JSON.parse(rawValue);
        setValue(normalizeValue ? normalizeValue(parsedValue) : (parsedValue as T));
      } else {
        setValue(createInitialValue());
      }
    } catch {
      setValue(createInitialValue());
    } finally {
      setIsHydrated(true);
    }
  }, [createInitialValue, key, normalizeValue]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable (private browsing, quota, security policy).
      // Keep the in-memory session usable instead of failing the page.
    }
  }, [isHydrated, key, value]);

  return [value, setValue, isHydrated];
}
