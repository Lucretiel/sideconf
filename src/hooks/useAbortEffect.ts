import { useEffect } from "react";

// Basically `useEffect`, but it also gets an `AbortSignal` that's called
// whenever the effect re-runs. Make sure to use `useCallback` or something like
// that to preserve the identity of the effect.
const useAbortEffect = (effect: (signal: AbortSignal) => void) => {
  useEffect(() => {
    const controller = new AbortController();
    effect(controller.signal);
    return () => controller.abort();
  }, [effect]);
};

export default useAbortEffect;
