import assertNever from "../../assertNever";
import {
  FactionSet,
  GameStep,
  getSharingBonuses,
  Phase,
  RoundId,
  SubPhase,
  TradeTimeLimit,
  Transition,
} from "../../rules";
import ConfluencePhase from "./ConfluencePhase";
import EconomyPhase from "./EconomyPhase";
import ScoringPhase from "./Scoring";
import TechSharingDisplay from "./TechSharingDisplay";
import TradePhase from "./TradePhase";

const getRoundLabel = (round: number, maxRounds: number) =>
  round >= maxRounds ? "Final" : `Round ${round}`;

// Top level component for a game in progress. Manages transitions between
// rounds & phases.
const Game = ({
  timeLimit,
  round,
  transitionTo,
  toMainMenu,
  factions,
  phase,
}: {
  factions: FactionSet;
  timeLimit: TradeTimeLimit;
  round: RoundId;
  transitionTo: (to: Transition) => void;
  toMainMenu: () => void;
  phase: Phase;
}) => {
  const bonuses = getSharingBonuses(factions.size);
  const currentRoundBonuses = bonuses[round];
  const lastRound = round === 6;

  return (
    <TechSharingDisplay
      normalSharingBonus={currentRoundBonuses.normal}
      yengiiSharingBonus={
        factions.has("yengii") ? currentRoundBonuses.yengii : null
      }
    >
      {phase.main === "trade" ? (
        <TradePhase
          round={round}
          timeLimit={timeLimit}
          onFinished={() => transitionTo({ phase: { main: "economy" } })}
        />
      ) : phase.main === "economy" ? (
        <EconomyPhase
          onFinished={() =>
            transitionTo({ phase: { main: "confluence", subPhase: "sharing" } })
          }
          round={round}
        />
      ) : phase.main === "confluence" ? (
        <ConfluencePhase
          subPhase={phase.subPhase}
          toSubPhase={(subPhase: SubPhase) =>
            transitionTo({ phase: { main: "confluence", subPhase } })
          }
          onFinished={() =>
            transitionTo({
              nextRound: true,
              phase: { main: "trade" },
            })
          }
          round={round}
          factions={factions}
        />
      ) : (
        assertNever(phase.main)
      )}
    </TechSharingDisplay>
  );
};

export default Game;
