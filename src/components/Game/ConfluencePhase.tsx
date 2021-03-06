import assertNever from "../../assertNever";
import { FactionSet } from "../../rules";
import "./Phase.css";

type SubPhase = "sharing" | "bidding" | "stealing";

const SharingContent = ({ hasYengii }: { hasYengii: boolean }) => (
  <article>
    <h2>Technology Sharing</h2>
    <p>
      All players {hasYengii ? "(except Yengii)" : null} announce invented
      technologies
    </p>
  </article>
);

const BiddingContent = ({ factions }: { factions: FactionSet }) => (
  <article>
    <h2>Bidding</h2>
    <ul>
      <li>Players bid for colonies and research teams</li>
      <li>
        Tiebreakers
        <ol>
          <li>Fewest cards of that type</li>
          <li>Highest bid tiebreaker value</li>
        </ol>
      </li>
      {factions.has("kit") ? (
        <li>Kt'zr'kt'rtl (orange) wins all colony bid ties</li>
      ) : null}
      {factions.has("caylion") ? (
        <li>Caylion (green) colony bids are worth half</li>
      ) : null}
      {factions.has("kjas") ? (
        <li>Kjasjavikalimm (red) colony bids may be split</li>
      ) : null}
    </ul>
  </article>
);

const StealingContent = () => (
  <article>
    <h2>Zeth Steal</h2>
    <p>
      Zeth (Pink) player may use <span className="zeth">🡆</span> converters to
      steal from players that they didn't trade with this round.
    </p>
  </article>
);

const ConfluencePhase = ({
  subPhase,
  toSubPhase,
  roundLabel,
  nextRoundLabel,
  onFinished,
  factions,
}: {
  subPhase: SubPhase;
  toSubPhase: (subPhase: SubPhase) => void;
  roundLabel: string;
  nextRoundLabel: string;
  onFinished: () => void;
  factions: FactionSet;
}) => {
  const nextStep =
    subPhase === "sharing"
      ? () => toSubPhase("bidding")
      : subPhase === "bidding" && factions.has("zeth")
      ? () => toSubPhase("stealing")
      : onFinished;

  return (
    <main className="phase-container">
      <h1>{roundLabel} Confluence Phase</h1>
      {subPhase === "sharing" ? (
        <SharingContent hasYengii={factions.has("yengii")} />
      ) : subPhase === "bidding" ? (
        <BiddingContent factions={factions} />
      ) : subPhase === "stealing" ? (
        <StealingContent />
      ) : (
        assertNever(subPhase)
      )}
      <button onClick={nextStep} className="phase-control-button">
        {subPhase === "sharing"
          ? "Bidding"
          : subPhase === "bidding" && factions.has("zeth")
          ? "Stealing"
          : `Begin Round ${nextRoundLabel}`}
      </button>
    </main>
  );
};

export default ConfluencePhase;
