import { useCallback, useEffect, useReducer, useState } from "react";
import assertNever from "../assertNever";

type TimerState = "ready" | "running" | "paused" | "done";

type Timer = {
  elapsed: number;
  remaining: number;
  state: TimerState;
  start: () => void;
  pause: () => void;
  reset: () => void;
};

type TimerInnerState =
  | {
      state: "ready";
    }
  | {
      state: "running";
      startedAt: number;
    }
  | {
      state: "paused";
      elapsed: number;
    }
  | {
      state: "done";
    };

const useTimer = (duration: number, onExpired?: () => void): Timer => {
  const now = Date.now();

  const [timer, setTimer] = useState<TimerInnerState>({ state: "ready" });

  const start = useCallback(() => {
    const now = Date.now();

    setTimer((timer) =>
      timer.state === "ready" || timer.state === "paused"
        ? {
            state: "running",
            startedAt: now - (timer.state === "paused" ? timer.elapsed : 0),
          }
        : timer
    );
  }, []);

  const pause = useCallback(() => {
    const now = Date.now();

    setTimer((timer) =>
      timer.state === "running"
        ? { state: "paused", elapsed: now - timer.startedAt }
        : timer
    );
  }, []);

  const reset = useCallback(() => {
    setTimer((timer) => (timer.state === "ready" ? timer : { state: "ready" }));
  }, []);

  const startedAt = timer.state === "running" ? timer.startedAt : null;

  useEffect(() => {
    if (startedAt !== null) {
      const deadline = startedAt + duration;
      const remaining = deadline - Date.now();

      const timeout = setTimeout(() => {
        setTimer({ state: "done" });
        onExpired?.();
      }, remaining);

      return () => clearTimeout(timeout);
    }
  }, [duration, startedAt, onExpired]);

  const elapsed =
    timer.state === "ready"
      ? 0
      : timer.state === "done"
      ? duration
      : timer.state === "paused"
      ? timer.elapsed
      : timer.state === "running"
      ? Date.now() - timer.startedAt
      : assertNever(timer);

  const remaining = duration - elapsed;

  return {
    elapsed,
    remaining,
    state: timer.state,
    start,
    pause,
    reset,
  };
};

export default useTimer;
