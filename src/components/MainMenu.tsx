import classNames from "classnames";
import { useState } from "react";
import {
  allFactionIds,
  allFactions,
  FactionId,
  FactionSet,
  FactionType,
  TradeTimeLimit,
} from "../rules";
import "./MainMenu.css";
import useMap from "../hooks/useMap";
import assertNever from "../assertNever";

const getFactionName = (faction: FactionId, factions: FactionSet) => {
  const names = allFactions[faction];
  const type = factions.get(faction);

  return type === "base"
    ? names.baseName
    : type === "expansion"
    ? names.expansionName
    : type === undefined
    ? names.baseName
    : assertNever(type);
};

// Main Menu component for starting a new game. Also includes credits etc
const MainMenu = ({
  onNewGame,
}: {
  onNewGame: (factions: FactionSet, tradeTimer: TradeTimeLimit) => void;
}) => {
  const [factions, { update: updateFactions }] = useMap<
    FactionId,
    FactionType
  >();
  const [tradeTimer, setTradeTimer] = useState<TradeTimeLimit>(10 * 60 * 1000);

  return (
    <main className="main-menu">
      <h1>Sidereal Confluence</h1>
      <h2>Unofficial Assistant</h2>
      <div id="main-menu-buttons">
        <div id="faction-select-buttons">
          {allFactionIds.map((faction) => (
            <button
              className={classNames({
                "main-menu-button": true,
                "faction-select-button": true,
                "main-menu-button-active": factions.has(faction),
              })}
              key={faction}
              onClick={() =>
                updateFactions(faction, (type) =>
                  type === undefined
                    ? "base"
                    : type === "base"
                    ? "expansion"
                    : type === "expansion"
                    ? undefined
                    : assertNever(type)
                )
              }
            >
              {getFactionName(faction, factions)}
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
