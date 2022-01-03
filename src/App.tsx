import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { PlayerCount, playerCounts } from "./rules/player_counts";
import MainMenu from "./components/MainMenu";
import assertNever from "./assertNever";
import Game from "./components/Game/Game";
import { BrowserRouter } from "react-router-dom";

type AppState = "menu" | "game";

const App = () => {
  const [playerCount, setPlayerCount] = useState<PlayerCount>(4);
  const [hasYengii, setHasYengii] = useState(false);
  const [hasZeth, setHasZeth] = useState(false);
  const [tradeTimer, setTradeTimer] = useState(10 * 60 * 1000);
  const [state, setAppState] = useState<AppState>("menu");

  // TODO: use react router and move most of this state to the URL

  if (state === "menu") {
    return (
      <MainMenu
        onNewGame={(playerCount, withYengii, withZeth, tradeTimer) => {
          setPlayerCount(playerCount);
          setHasYengii(withYengii);
          setHasZeth(withZeth);
          setTradeTimer(tradeTimer);
          setAppState("game");
        }}
      ></MainMenu>
    );
  } else if (state === "game") {
    return (
      <Game
        playerCount={playerCount}
        hasYengii={hasYengii}
        hasZeth={hasZeth}
        timeLimit={tradeTimer}
        onGameFinished={() => setAppState("menu")}
      ></Game>
    );
  } else {
    return assertNever(state);
  }
};

export default App;
