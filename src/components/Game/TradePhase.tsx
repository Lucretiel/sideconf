// Component for the trade phase. Mostly handles the trade timer (which is
// the entire reason I wanted to make this app in the first place). Also shows
// various game info like sharing bonus.

import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import assertNever from "../../assertNever";
import useClock from "../../hooks/useClock";
import useDocumentHidden from "../../hooks/useDocumentHidden";
import useWakeLock from "../../hooks/useWakeLock";
import { TradeTimeLimit } from "../../rules";
import "./Phase.css";
import "./TradePhase.css";

type TimerState = "ready" | "running" | "paused" | "done";

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
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const TradePhaseTimer = ({
  timeLimit,
  onExpired,
}: {
  // How much time in the trading phase, in millis
  timeLimit: number;

  // Function to be called when the timer runs out
  onExpired: () => void;
}) => {
  const [state, setTimerState] = useState<TimerState>("ready");

  // *static* time elapsed. True elapsed time is calculated as this plus the
  // amount of time since timerStartedAt
  const [staticTimeElapsed, setStaticTimeElapsed] = useState(0);

  // Timestamp of the most recent time the timer was started. If the timer is
  // running, use this and the clock to find the true elapsed time
  const [timerStartedAt, setTimerStartedAt] = useState(() => Date.now());

  const startTimer = useCallback(() => {
    const now = Date.now();

    setTimerStartedAt(now);
    setTimerState("running");
  }, []);

  const pauseTimer = useCallback(() => {
    const elapsed = Date.now() - timerStartedAt;

    setStaticTimeElapsed((original) => original + elapsed);
    setTimerState("paused");
  }, [timerStartedAt]);

  // This effect controls everything that happens when the timer expires
  useEffect(() => {
    if (state === "running") {
      const id = setTimeout(() => {
        // TODO: Make some noise here
        setTimerState("done");
        onExpired();
      }, timeLimit - (staticTimeElapsed + (Date.now() - timerStartedAt)));

      return () => clearTimeout(id);
    }
  }, [state, timeLimit, timerStartedAt, staticTimeElapsed, onExpired]);

  // This manages awareness of the window focus state
  const documentHidden = useDocumentHidden();

  const live = !documentHidden && state === "running";

  // Try to keep the screen from turning off if the clock is running
  useWakeLock(live);

  // The current time. This also allows for ticking the clock
  const now = useClock(live ? 50 : null);

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

  const clockClass = classNames("clock", {
    "pause-blink": state === "paused" || state === "done",
  });
  return (
    <div>
      {minutes > 0 ? (
        <div className={clockClass}>
          <span key="minutes" id="minutes">
            {minutes}
          </span>
          <span>:</span>
          <span key="seconds" id="seconds">
            {integerSecondsFormatter.format(seconds)}
          </span>
        </div>
      ) : (
        <div className={clockClass}>
          <span key="seconds" id="seconds">
            {floatSecondsFormatter.format(seconds)}
          </span>
        </div>
      )}
      {state !== "done" ? (
        <button
          className="phase-control-button"
          onClick={
            state === "ready" || state === "paused"
              ? startTimer
              : state === "running"
              ? pauseTimer
              : assertNever(state)
          }
        >
          {state === "ready"
            ? "Start"
            : state === "running"
            ? "Pause"
            : state === "paused"
            ? "Resume"
            : assertNever(state)}
        </button>
      ) : null}
    </div>
  );
};

const TradePhase = ({
  timeLimit,
  onFinished,
  roundLabel,
}: {
  // How much time in the trading phase, in millis
  timeLimit: TradeTimeLimit;

  // Function to be called when the trading phase is complete
  onFinished: () => void;

  roundLabel: string;
}) => {
  const [timerExpired, updateTimerExpired] = useState(false);
  const title = `${roundLabel} Trading Phase`;
  const setTimerExpired = useCallback(() => updateTimerExpired(true), []);

  return (
    <main className="phase-container">
      <h1>{title}</h1>
      {timeLimit !== "unlimited" ? (
        <TradePhaseTimer onExpired={setTimerExpired} timeLimit={timeLimit} />
      ) : (
        <span className="big-text">No Time Limit</span>
      )}
      <button className="phase-control-button" onClick={onFinished}>
        {timerExpired || timeLimit === "unlimited" ? "Economy Phase" : "Skip"}
      </button>
    </main>
  );
};

export default TradePhase;
