import classNames from "classnames";
import { useState } from "react";
import { PlayerCount, playerCounts } from "../rules/player_counts";
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

// Utility function. Given a state setter for a bool, create a function that
// inverts that bool's state
const boolStateInverter =
  (setState: (update: (current: boolean) => boolean) => void) => () =>
    setState((current) => !current);

// Main Menu component for starting a new game. Also includes credits etc
const MainMenu = (props: {
  onNewGame: (
    playerCount: PlayerCount,
    withYengii: boolean,
    withZeth: boolean,
    tradeTimerMillis: number
  ) => void;
}) => {
  const { onNewGame } = props;
  const [hasYengii, setHasYengii] = useState(false);
  const [hasZeth, setHasZeth] = useState(false);
  const [tradeTimer, setTradeTimer] = useState(10 * 60 * 1000);

  return (
    <main className="main-menu">
      <h1>Sidereal Confluence</h1>
      <h2>Unofficial Assistant</h2>
      <div id="main-menu-buttons">
        <div id="new-game-buttons">
          {playerCounts.map((playerCount) => (
            <button
              className="main-menu-button"
              key={playerCount}
              onClick={() =>
                onNewGame(playerCount, hasYengii, hasZeth, tradeTimer)
              }
            >
              {playerCount} players
            </button>
          ))}
        </div>
        <IncludeFactionButton
          name="Yengii"
          included={hasYengii}
          toggle={boolStateInverter(setHasYengii)}
        />
        <IncludeFactionButton
          name="Zeth"
          included={hasZeth}
          toggle={boolStateInverter(setHasZeth)}
        />
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
        </div>
      </div>
    </main>
  );
};

export default MainMenu;
