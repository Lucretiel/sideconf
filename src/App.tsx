import { useMemo } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import { FactionID, FactionSet, Phase, TradeTimeLimit } from "./rules";
import MainMenu from "./components/MainMenu";
import Game from "./components/Game/Game";
import useLocalStorage from "./hooks/useLocalStorage";

const seconds = (seconds: number): number => seconds * 1000;
const minutes = (minutes: number): number => seconds(minutes * 60);

const getTradeTimer = (timerStr: string | null): TradeTimeLimit =>
  timerStr === null
    ? minutes(10)
    : timerStr === "unlimited"
    ? "unlimited"
    : parseFloat(timerStr);

const getFactions = (factionsStr: string | null): FactionSet =>
  new Set(
    factionsStr === null || factionsStr === ""
      ? []
      : (JSON.parse(factionsStr) as FactionID[])
  );

const getRound = (round: string | undefined): number => {
  if (round === undefined || !/^[1-6]$/.test(round))
    throw new Error("round number must be 1-6");

  return parseInt(round);
};

const phasePath = (phase: Phase): string =>
  phase.main === "confluence"
    ? `confluence/${phase.subPhase}`
    : `${phase.main}`;

const GameAdapter = ({
  factions,
  timeLimit,
  transitionTo,
  toMainMenu,
  phase,
}: {
  factions: FactionSet;
  timeLimit: TradeTimeLimit;
  transitionTo: (to: { round: number; phase: Phase }) => void;
  toMainMenu: () => void;
  phase: Phase;
}) => {
  const urlParams = useParams();
  const round = getRound(urlParams.round);

  const localTransitionTo = (to: { round?: number; phase: Phase }) =>
    transitionTo({ round: to.round ?? round, phase: to.phase });

  return (
    <Game
      factions={factions}
      timeLimit={timeLimit}
      round={round}
      transitionTo={localTransitionTo}
      toMainMenu={toMainMenu}
      phase={phase}
    />
  );
};

const App = () => {
  const [factionsStr, setFactionsStr] = useLocalStorage("factions");
  const factions = useMemo(() => getFactions(factionsStr), [factionsStr]);
  const setFactions = (factions: FactionSet) =>
    setFactionsStr(JSON.stringify(Array.from(factions)));

  const [timeLimitStr, setTimeLimitStr] = useLocalStorage("timer");
  const timeLimit = getTradeTimer(timeLimitStr);
  const setTimeLimit = (timeLimit: TradeTimeLimit) =>
    setTimeLimitStr(timeLimit.toString());

  const navigate = useNavigate();
  const transitionTo = (to: { round: number; phase: Phase }) =>
    navigate(`/game/round/${to.round}/${phasePath(to.phase)}`);
  const toMainMenu = () => navigate("/");

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainMenu
            onNewGame={(factions, tradeTimeLimit) => {
              setFactions(factions);
              setTimeLimit(tradeTimeLimit);
              transitionTo({ round: 1, phase: { main: "trade" } });
            }}
          />
        }
      />
      <Route path="/game/round/:round/">
        {(["trade", "economy", "scoring"] as const).map((main) => (
          <Route
            key={main}
            path={main}
            element={
              <GameAdapter
                factions={factions}
                timeLimit={timeLimit}
                transitionTo={transitionTo}
                toMainMenu={toMainMenu}
                phase={{ main }}
              />
            }
          />
        ))}
        <Route path="confluence" key="confluence">
          {(["sharing", "bidding", "stealing"] as const).map((subPhase) => (
            <Route
              key={subPhase}
              path={subPhase}
              element={
                <GameAdapter
                  factions={factions}
                  timeLimit={timeLimit}
                  transitionTo={transitionTo}
                  toMainMenu={toMainMenu}
                  phase={{ main: "confluence", subPhase }}
                />
              }
            />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
