import { useState } from "react";
import "./App.css";
import { FactionID, PlayerCount, TradeTimeLimit } from "./rules";
import MainMenu from "./components/MainMenu";
import assertNever from "./assertNever";
import Game from "./components/Game/Game";

type AppState = "menu" | "game";

const App = () => {
  const [factions, setFactions] = useState<Set<FactionID>>(new Set());
  const [tradeTimer, setTradeTimer] = useState<TradeTimeLimit>(10 * 60 * 1000);
  const [state, setAppState] = useState<AppState>("menu");

  // TODO: use react router and move most of this state to the URL

  if (state === "menu") {
    return (
      <MainMenu
        onNewGame={(factions, tradeTimeLimit) => {
          setFactions(factions);
          setTradeTimer(tradeTimeLimit);
          setAppState("game");
        }}
      ></MainMenu>
    );
  } else if (state === "game") {
    return (
      <Game
        factions={factions}
        timeLimit={tradeTimer}
        onGameFinished={() => setAppState("menu")}
      ></Game>
    );
  } else {
    return assertNever(state);
  }
};

export default App;
