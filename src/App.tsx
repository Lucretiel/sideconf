import { useMemo } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import "./factions.css";
import {
  FactionId,
  FactionSet,
  FactionType,
  GameStep,
  Phase,
  RoundId,
  TradeTimeLimit,
  Transition,
} from "./rules";
import MainMenu from "./components/MainMenu";
import Game from "./components/Game/Game";
import useLocalStorage from "./hooks/useLocalStorage";
import ScoringPhase from "./components/Game/Scoring";

const seconds = (seconds: number): number => seconds * 1000;
const minutes = (minutes: number): number => seconds(minutes * 60);

const getTradeTimer = (timerStr: string | null): TradeTimeLimit =>
  timerStr === null
    ? minutes(10)
    : timerStr === "unlimited"
    ? "unlimited"
    : parseFloat(timerStr);

const getFactions = (factionsStr: string | null): FactionSet =>
  new Map(
    factionsStr === null || factionsStr === ""
      ? []
      : (Object.entries(JSON.parse(factionsStr)) as [FactionId, FactionType][])
  );

const getRound = (round: string | undefined): RoundId => {
  switch (round) {
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    default:
      throw new Error("round number must be 1-6");
  }
};

const getPhase = (phase: string | undefined): Phase => {
  switch (phase) {
    case "trade":
    case "economy":
      return { main: phase };
    case "sharing":
    case "bidding":
    case "stealing":
      return { subPhase: phase, main: "confluence" };
    default:
      throw new Error("Invalid game phase");
  }
};

const phasePath = (phase: Phase): string =>
  phase.main === "confluence"
    ? `/confluence/${phase.subPhase}`
    : `/${phase.main}`;

const stepPath = (step: GameStep): string =>
  step.phase === "scoring"
    ? "/game/scoring"
    : `/game/round/${step.round}/${phasePath(step.phase)}`;

const GameAdapter = ({
  factions,
  timeLimit,
  transitionTo,
  toMainMenu,
}: {
  factions: FactionSet;
  timeLimit: TradeTimeLimit;
  transitionTo: (to: GameStep) => void;
  toMainMenu: () => void;
}) => {
  const urlParams = useParams();
  const round = getRound(urlParams.round);
  const phase = getPhase(urlParams.phase);

  const localTransitionTo =
    round === 6
      ? (to: Transition) =>
          to.nextRound ? { phase: "scoring" } : { phase: to.phase, round }
      : (to: Transition) => ({
          phase: to.phase,
          round: to.nextRound ? ((round + 1) as RoundId) : round,
        });

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
  const transitionTo = (to: GameStep) => navigate(stepPath(to));
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
      <Route
        path="/game/scoring"
        element={<ScoringPhase onFinished={toMainMenu} />}
      />
      <Route path="/game/round/:round">
        <Route
          path="/:phase"
          element={
            <GameAdapter
              factions={factions}
              timeLimit={timeLimit}
              transitionTo={transitionTo}
              toMainMenu={toMainMenu}
            />
          }
        />
        <Route
          path="/confluence/:phase"
          element={
            <GameAdapter
              factions={factions}
              timeLimit={timeLimit}
              transitionTo={transitionTo}
              toMainMenu={toMainMenu}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
