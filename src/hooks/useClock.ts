import { useEffect, useState } from "react";

// Hook for a ticking clock. Every time this hook is evaluated, it returns the
// current time. In addition, it sets up an effect that causes the component
// to re-render every `interval` ms, if given.
const useClock = (interval: number | null): number => {
  const [_, setTick] = useState(false);

  useEffect(() => {
    if (interval !== null) {
      const intervalId = setInterval(() => setTick((b) => !b), interval);
      return () => clearInterval(intervalId);
    }
  }, [interval]);

  return Date.now();
};

export default useClock;
