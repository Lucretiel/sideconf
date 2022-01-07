import { round } from "lodash";
import { useCallback, useState } from "react";
import assertNever from "../../assertNever";
import {
  PlayerCount,
  getSharingBonuses,
  FactionSet,
  TradeTimeLimit,
} from "../../rules";
import ConfluencePhase from "./ConfluencePhase";
import EconomyPhase from "./EconomyPhase";
import TechSharingDisplay from "./TechSharingDisplay";
import TradePhase from "./TradePhase";

type Phase = "trade" | "economy" | "confluence";

const getRoundLabel = (roundIndex: number, maxRounds: number) =>
  roundIndex + 1 >= maxRounds ? "Final" : `Round ${roundIndex + 1}`;

// Top level component for a game in progress.
const Game = (props: {
  factions: FactionSet;
  timeLimit: TradeTimeLimit;
  onGameFinished: () => void;
}) => {
  const [roundIndex, setRoundIndex] = useState(0);

  const [phase, setPhase] = useState<Phase>("trade");
  const setTrade = useCallback(() => setPhase("trade"), []);
  const setEconomy = useCallback(() => setPhase("economy"), []);
  const setConfluence = useCallback(() => setPhase("confluence"), []);

  const nextRound = useCallback(() => {
    setPhase("trade");
    setRoundIndex((round) => round + 1);
  }, []);

  const bonuses = getSharingBonuses(props.factions.size);
  const currentRoundBonuses = bonuses[roundIndex];

  const roundLabel = getRoundLabel(roundIndex, bonuses.length);
  const nextRoundLabel = getRoundLabel(roundIndex + 1, bonuses.length);

  return (
    <TechSharingDisplay
      normalSharingBonus={currentRoundBonuses?.normal ?? 0}
      yengiiSharingBonus={
        props.factions.has("yengii") ? currentRoundBonuses?.yengii ?? 0 : null
      }
    >
      {phase === "trade" ? (
        <TradePhase
          roundLabel={roundLabel}
          timeLimit={props.timeLimit}
          onFinished={setEconomy}
        />
      ) : phase === "economy" ? (
        <EconomyPhase onFinished={setConfluence} roundLabel={roundLabel} />
      ) : phase === "confluence" ? (
        <ConfluencePhase
          onFinished={nextRound}
          roundLabel={roundLabel}
          nextRoundLabel={nextRoundLabel}
          factions={props.factions}
        />
      ) : (
        assertNever(phase)
      )}
    </TechSharingDisplay>
  );
};

export default Game;
