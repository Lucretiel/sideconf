import { useCallback, useState } from "react";
import {
  PlayerCount,
  getSharingBonuses,
  playerCounts,
} from "../../rules/player_counts";
import TechSharingDisplay from "./TechSharingDisplay";
import Trade from "./Trade";

type Phase = "trade" | "economy" | "confluence";

// Top level component for a game in progress.
const Game = (props: {
  playerCount: PlayerCount;
  hasYengii: boolean;
  hasZeth: boolean;
  timeLimit: number;
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

  const bonuses = getSharingBonuses(props.playerCount);
  const currentRoundBonuses = bonuses[roundIndex];

  return (
    <TechSharingDisplay
      normalSharingBonus={currentRoundBonuses.normal}
      yengiiSharingBonus={props.hasYengii ? currentRoundBonuses.yengii : null}
    >
      {phase === "trade" ? (
        <Trade
          roundLabel={roundIndex + 1}
          timeLimit={props.timeLimit}
          onFinished={setEconomy}
        ></Trade>
      ) : null}
    </TechSharingDisplay>
  );
};

export default Game;
