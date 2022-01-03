import { useCallback, useState } from "react";
import {
  PlayerCount,
  getSharingBonuses,
  playerCounts,
} from "../../rules/player_counts";
import Trade from "./Trade";

type Phase = "trade" | "economy" | "confluence";

// Top level component for a game in progress.
const Game = (props: {
  playerCount: PlayerCount;
  hasZengii: boolean;
  hasZeth: boolean;
  timeLimit: number;
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

  switch (phase) {
    case "trade":
      return (
        <Trade
          roundLabel={roundIndex + 1}
          timeLimit={props.timeLimit}
          onFinished={setEconomy}
        ></Trade>
      );
  }
};

export default Game;
