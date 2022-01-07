import classNames from "classnames";
import lodash from "lodash";
import { useCallback, useState } from "react";
import {
  allFactionIds,
  allFactions,
  FactionID,
  FactionSet,
  PlayerCount,
  TradeTimeLimit,
} from "../rules";
import "./MainMenu.css";

const IncludeFactionButton = ({
  name,
  included,
  toggle,
}: {
  name: string;
  included: boolean;
  toggle: () => void;
}) => {
  const className = classNames("main-menu-button", {
    "main-menu-button-active": included,
  });

  return (
    <button onClick={toggle} className={className}>
      {included ? "Includes" : "No"} {name}
    </button>
  );
};

const useSet = <T,>(): [
  Set<T>,
  (value: T, update: boolean | ((current: boolean) => boolean)) => void
] => {
  const [set, updateSet] = useState<Set<T>>(new Set());

  const updateSetField = useCallback(
    (value: T, update: boolean | ((current: boolean) => boolean)) => {
      updateSet((set) => {
        const exists = set.has(value);
        const shouldExist =
          update === true || update === false ? update : update(exists);

        if (exists === shouldExist) {
          return set;
        }

        const newSet = new Set(set);

        if (shouldExist) {
          newSet.add(value);
        } else {
          newSet.delete(value);
        }

        return newSet;
      });
    },
    []
  );

  return [set, updateSetField];
};

// Main Menu component for starting a new game. Also includes credits etc
const MainMenu = ({
  onNewGame,
}: {
  onNewGame: (factions: FactionSet, tradeTimerMillis: TradeTimeLimit) => void;
}) => {
  const [factions, updateFactions] = useSet<FactionID>();
  const [tradeTimer, setTradeTimer] = useState<TradeTimeLimit>(10 * 60 * 1000);

  return (
    <main className="main-menu">
      <h1>Sidereal Confluence</h1>
      <h2>Unofficial Assistant</h2>
      <div id="main-menu-buttons">
        <div id="faction-select-buttons">
          {allFactionIds.map((faction) => (
            <button
              className={classNames(
                "main-menu-button",
                "faction-select-button",
                {
                  "main-menu-button-active": factions.has(faction),
                }
              )}
              key={faction}
              onClick={() => updateFactions(faction, (present) => !present)}
            >
              {allFactions[faction].name}
            </button>
          ))}
        </div>
        <button
          className="new-game-button main-menu-button"
          disabled={factions.size < 4}
          onClick={() => {
            if (factions.size >= 4) {
              onNewGame(factions, tradeTimer);
            }
          }}
        >
          New Game
        </button>
        <div id="timer-settings-row">
          <button
            onClick={() => setTradeTimer(2 * 60 * 1000)}
            className={classNames("main-menu-button", {
              "main-menu-button-active": tradeTimer === 2 * 60 * 1000,
            })}
          >
            2 Minutes
          </button>
          <button
            onClick={() => setTradeTimer(10 * 60 * 1000)}
            className={classNames("main-menu-button", {
              "main-menu-button-active": tradeTimer === 10 * 60 * 1000,
            })}
          >
            10 Minutes
          </button>
          <button
            onClick={() => setTradeTimer(15 * 60 * 1000)}
            className={classNames("main-menu-button", {
              "main-menu-button-active": tradeTimer === 15 * 60 * 1000,
            })}
          >
            15 Minutes
          </button>
          <button
            onClick={() => setTradeTimer("unlimited")}
            className={classNames("main-menu-button", {
              "main-menu-button-active": tradeTimer === "unlimited",
            })}
          >
            Unlimited
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainMenu;
