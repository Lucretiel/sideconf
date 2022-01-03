import { useEffect, useState } from "react";

// Hook for a ticking clock. Returns the current Date.now() at the moment the
// hook is called, and triggers a re-render (with an updated current timestamp)
// every `interval` millis.
//
// If `interval` is `null`, the clock doesn't tick.
//
// The clock will refresh instantly if the interval changes.
const useClock = (interval: number | null): number => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());

    if (interval !== null) {
      const intervalId = setInterval(() => setNow(Date.now()), interval);
      return () => clearInterval(intervalId);
    }
  }, [interval]);

  return now;
};

export default useClock;
