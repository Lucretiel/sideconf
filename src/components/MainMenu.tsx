import { useState } from "react";
import { PlayerCount, playerCounts } from "../rules/player_counts";

const IncludeFactionButton = ({
  name,
  included,
  toggle,
}: {
  name: string;
  included: boolean;
  toggle: () => void;
}) => (
  <button onClick={toggle}>
    {included ? "Includes" : "No"} {name}
  </button>
);

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
    tradeTimerMinutes: number
  ) => void;
}) => {
  const { onNewGame } = props;
  const [hasYengii, setHasYengii] = useState(false);
  const [hasZeth, setHasZeth] = useState(false);
  const [tradeTimer, setTradeTimer] = useState(10);

  return (
    <main>
      <h1>Sidereal Confluence</h1>
      <h2>Unofficial Assistant</h2>
      <div id="main-menu-buttons">
        <div id="new-game-buttons">
          {playerCounts.map((playerCount) => (
            <button
              key={playerCount}
              onClick={() => onNewGame(playerCount, hasYengii, 10)}
            >
              {playerCount}
            </button>
          ))}
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
            <button onClick={() => setTradeTimer(10)}>10 Minutes</button>
            <button onClick={() => setTradeTimer(15)}>15 Minutes</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainMenu;
