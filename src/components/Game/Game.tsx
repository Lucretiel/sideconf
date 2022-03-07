import assertNever from "../../assertNever";
import {
  getSharingBonuses,
  FactionSet,
  TradeTimeLimit,
  Phase,
  SubPhase,
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
  round: number;
  transitionTo: (to: { round?: number; phase: Phase }) => void;
  toMainMenu: () => void;
  phase: Phase;
}) => {
  const bonuses = getSharingBonuses(factions.size);
  const currentRoundBonuses = bonuses[round - 1];

  if (currentRoundBonuses === undefined) {
    throw new Error(`Invalid round ${round}`);
  }

  const maxRounds = bonuses.length;
  const lastRound = round >= maxRounds;

  const roundLabel = getRoundLabel(
    round,
    phase.main === "confluence" ? maxRounds - 1 : maxRounds
  );
  const nextRoundLabel = getRoundLabel(round + 1, bonuses.length);

  return (
    <TechSharingDisplay
      normalSharingBonus={currentRoundBonuses?.normal ?? 0}
      yengiiSharingBonus={
        factions.has("yengii") ? currentRoundBonuses?.yengii ?? 0 : null
      }
    >
      {phase.main === "trade" ? (
        <TradePhase
          roundLabel={roundLabel}
          timeLimit={timeLimit}
          onFinished={() => transitionTo({ phase: { main: "economy" } })}
        />
      ) : phase.main === "economy" ? (
        <EconomyPhase
          onFinished={
            lastRound
              ? () => transitionTo({ phase: { main: "scoring" } })
              : () =>
                  transitionTo({
                    phase: { main: "confluence", subPhase: "sharing" },
                  })
          }
          roundLabel={roundLabel}
          lastRound={lastRound}
        />
      ) : phase.main === "confluence" ? (
        <ConfluencePhase
          subPhase={phase.subPhase}
          toSubPhase={(subPhase: SubPhase) =>
            transitionTo({ phase: { main: "confluence", subPhase } })
          }
          onFinished={() =>
            transitionTo({ phase: { main: "trade" }, round: round + 1 })
          }
          roundLabel={roundLabel}
          nextRoundLabel={nextRoundLabel}
          factions={factions}
        />
      ) : phase.main === "scoring" ? (
        <ScoringPhase onFinished={toMainMenu} />
      ) : (
        assertNever(phase.main)
      )}
    </TechSharingDisplay>
  );
};

export default Game;
