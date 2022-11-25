// Component for the trade phase. Mostly handles the trade timer (which is
// the entire reason I wanted to make this app in the first place). Also shows
// various game info like sharing bonus.

import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import assertNever from "../../assertNever";
import useClock from "../../hooks/useClock";
import useDocumentHidden from "../../hooks/useDocumentHidden";
import useWakeLock from "../../hooks/useWakeLock";
import { RoundId, TradeTimeLimit } from "../../rules";
import { Helmet } from "react-helmet";
import "./Phase.css";
import "./TradePhase.css";
import useTimer from "../../hooks/useTimer";

type TimerState = "ready" | "running" | "paused" | "done";

// Given some number of milliseconds, like 61000, return a wall clock, like
// {minutes: 1, seconds: 1}. If the minutes component is not 0, the seconds
// will be rounded to the nearest integer.
const clockify = (
  milliseconds: number
): { minutes: number; seconds: number } => {
  const totalSeconds = milliseconds / 1000;
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
  const timer = useTimer(timeLimit);

  // This manages awareness of the window focus state
  const documentHidden = useDocumentHidden();

  const live = !documentHidden && timer.state === "running";

  // Try to keep the screen from turning off if the clock is running
  useWakeLock(live);

  // The current time. This also allows for ticking the clock by forcing this
  // component to render every 50ms while the timer is live
  const _now = useClock(live ? 50 : null);

  const { minutes, seconds } = clockify(timer.remaining);

  const clockClass = classNames("clock", {
    "pause-blink": timer.state === "paused" || timer.state === "done",
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
      {timer.state !== "done" ? (
        <button
          className="phase-control-button"
          onClick={
            timer.state === "ready" || timer.state === "paused"
              ? timer.start
              : timer.state === "running"
              ? timer.pause
              : assertNever(timer.state)
          }
        >
          {timer.state === "ready"
            ? "Start"
            : timer.state === "running"
            ? "Pause"
            : timer.state === "paused"
            ? "Resume"
            : assertNever(timer.state)}
        </button>
      ) : null}
    </div>
  );
};

const TradePhase = ({
  timeLimit,
  onFinished,
  round,
}: {
  // How much time in the trading phase, in millis
  timeLimit: TradeTimeLimit;

  // Function to be called when the trading phase is complete
  onFinished: () => void;

  round: RoundId;
}) => {
  const [timerExpired, updateTimerExpired] = useState(false);
  const finalRound = round === 6;
  const title = `${finalRound ? "Final" : `Round ${round}`} Trading Phase`;
  const setTimerExpired = useCallback(() => updateTimerExpired(true), []);

  return (
    <main className="phase-container">
      <Helmet>
        <title>{title}</title>
      </Helmet>
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
