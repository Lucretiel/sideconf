import { useState } from "react";
import { PlayerCount } from "../../rules/player_counts";

type Phase = "trade" | "economy" | "confluence";

// Top level component for a game in progress.
const Game = (props: {
  playerCount: PlayerCount;
  hasZengii: boolean;
  hasZeth: boolean;
  
}) => {
  const [turnIndex, setTurnIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("trade");
};

export default Game;
