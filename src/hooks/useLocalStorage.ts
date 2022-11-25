import React, { useCallback, useState } from "react";
import useAbortEffect from "./useAbortEffect";

const useLocalStorage = (
  key: string
): [string | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const [localValue, setLocalValue] = useState(() => {
    return localStorage.getItem(key);
  });

  // Subscribe to out-of-band changes in the value, and ensure that key changes
  // are propagated
  useAbortEffect(
    useCallback(
      (signal) => {
        setLocalValue(localStorage.getItem(key));

        window.addEventListener(
          "storage",
          (event) => {
            if (event.key === key) setLocalValue(event.newValue);
          },
          {
            passive: true,
            signal,
          }
        );
      },
      [key]
    )
  );

  // Ensure that setValue sends to localStorage, in addition to setState
  const setValue = useCallback(
    (value: React.SetStateAction<string | null>) => {
      const valueUpdater = typeof value === "function" ? value : () => value;

      setLocalValue((oldValue) => {
        const newValue = valueUpdater(oldValue);

        if (newValue === null) localStorage.removeItem(key);
        else localStorage.setItem(key, newValue);

        return newValue;
      });
    },
    [key]
  );

  return [localValue, setValue];
};

export default useLocalStorage;
