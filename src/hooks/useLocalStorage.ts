"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  createInitialValue: () => T,
  normalizeValue?: (value: T) => T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(() => createInitialValue());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (rawValue) {
        const parsedValue = JSON.parse(rawValue) as T;
        setValue(normalizeValue ? normalizeValue(parsedValue) : parsedValue);
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

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [isHydrated, key, value]);

  return [value, setValue, isHydrated];
}
