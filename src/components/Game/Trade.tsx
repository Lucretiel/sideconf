// Component for the trade phase. Mostly handles the trade timer (which is
// the entire reason I wanted to make this app in the first place). Also shows
// various game info like sharing bonus.

import { useCallback, useEffect, useRef, useState } from "react";
import useClock from "../../hooks/useClock";

type TimerState = "ready" | "running" | "paused" | "done";

const assertNever = (n: never): never => {
  return n;
};

// Given some number of milliseconds, like 61000, return a wall clock, like
// {minutes: 1, seconds: 1}. If the minutes component is not 0, the seconds
// will be rounded to the nearest integer.
const clockify = (millis: number): { minutes: number; seconds: number } => {
  const totalSeconds = millis / 1000;
  if (totalSeconds < 60) {
    // Less than a minute left, so include fractional seconds
    return { minutes: 0, seconds: totalSeconds };
  } else {
    // Round *up* to the nearest second
    const roundedSeconds = Math.ceil(totalSeconds);
    return {
      minutes: Math.floor(roundedSeconds / 60),
      seconds: roundedSeconds % 60,
    };
  }
};

const integerSecondsFormatter = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 2,
  maximumFractionDigits: 0,
});

const floatSecondsFormatter = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 1,
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

const Trade = ({
  timeLimit,
  onFinished,
  roundLabel,
}: {
  // How much time in the trading phase, in millis
  timeLimit: number;

  // Function to be called when the trading phase is complete
  onFinished: () => void;

  // The round number (1 - 6)
  roundLabel: number;
}) => {
  const [state, setTimerState] = useState<TimerState>("ready");

  // *static* time elapsed. True elapsed time is calculated as this plus the
  // amount of time since timerStartedAt
  const [staticTimeElapsed, setStaticTimeElapsed] = useState(0);

  // Timestamp of the most recent time the timer was started. If the timer is
  // running, use this and the clock to find the true elapsed time
  const [timerStartedAt, setTimerStartedAt] = useState(() => Date.now());

  // Call this to start or resume the timer counting down. The rendered UI
  // should take care to make it impossible to call this if the timer is in
  // the running or done states
  const startTimer = useCallback(() => {
    const now = Date.now();

    setTimerStartedAt(now);
    setTimerState("running");
  }, []);

  const pauseTimer = useCallback(() => {
    const now = Date.now();
    const elapsed = now - timerStartedAt;

    setStaticTimeElapsed((original) => original + elapsed);
    setTimerState("paused");
  }, [timerStartedAt]);

  // Call this when the timer expires, or when the player skips to the end of
  // the phase
  const completeTimer = useCallback(() => {
    setTimerState("done");
  }, []);

  // This effect controls the transition to the done state when the timer
  // expires
  useEffect(() => {
    if (state === "running") {
      const timeRemaining = timeLimit - staticTimeElapsed;
      const id = setTimeout(() => setTimerState("done"), timeRemaining);
      return () => clearTimeout(id);
    }
  }, [state, timeLimit, staticTimeElapsed]);

  // The current time
  const now = useClock(state === "running" ? 25 : null);

  // Compute time remaining
  const timeRemaining =
    state === "ready"
      ? timeLimit
      : state === "done"
      ? 0
      : state === "paused"
      ? timeLimit - staticTimeElapsed
      : state === "running"
      ? timeLimit - (staticTimeElapsed + (now - timerStartedAt))
      : assertNever(state);

  const { minutes, seconds } = clockify(timeRemaining);

  const buttons = [];

  return (
    <div>
      <h1 className="phase-title">
        Round {roundLabel} Trading Phase
        {state === "paused" ? "(Paused)" : state === "done" ? "(Complete)" : ""}
      </h1>
      {minutes > 0 ? (
        <div id="clock">
          <span key="minutes" id="minutes">
            {minutes}
          </span>
          :
          <span key="seconds" id="seconds">
            {integerSecondsFormatter.format(seconds)}
          </span>
        </div>
      ) : (
        <div id="clock">
          <span key="seconds" id="seconds">
            {floatSecondsFormatter.format(seconds)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Trade;
