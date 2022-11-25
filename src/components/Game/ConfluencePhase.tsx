import { Helmet } from "react-helmet";
import assertNever from "../../assertNever";
import { FactionSet, RoundId } from "../../rules";
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
      <li key="bidding">Players bid for colonies and research teams</li>
      <li key="tiebreakers">
        Tiebreakers
        <ol>
          <li>Fewest cards of that type</li>
          <li>Highest bid tiebreaker value</li>
        </ol>
      </li>
      {factions.has("kit") && (
        <li key="kit">
          <span className="kit">Kt'zr'kt'rtl</span> wins all colony bid ties.
        </li>
      )}
      {factions.has("caylion") && (
        <li key="caylion">
          <span className="caylion">Caylion</span> colony bids are worth half.
        </li>
      )}
      {factions.has("kjas") && (
        <li key="kjas">
          <span className="kjas">Kjasjavikalimm</span> colony bids may be split.
        </li>
      )}
    </ul>
  </article>
);

const StealingContent = () => (
  <article>
    <h2>Zeth Steal</h2>
    <p>
      <span className="zeth">Zeth</span>
      {" player may use "}
      <span className="zeth-steal">🡆</span>
      {
        " converters to steal from players that they didn't trade with this round."
      }
    </p>
  </article>
);

const ConfluencePhase = ({
  subPhase,
  toSubPhase,
  round,
  onFinished,
  factions,
}: {
  subPhase: SubPhase;
  toSubPhase: (subPhase: SubPhase) => void;
  round: RoundId;
  onFinished: () => void;
  factions: FactionSet;
}) => {
  const mainTitle = `Round ${round} Confluence Phase`;
  const subTitle =
    subPhase === "bidding"
      ? "Bidding"
      : subPhase === "sharing"
      ? "Sharing"
      : subPhase === "stealing"
      ? "Stealing"
      : assertNever(subPhase);

  const headTitle = `${mainTitle} (${subTitle})`;

  const nextStep =
    subPhase === "sharing"
      ? () => toSubPhase("bidding")
      : subPhase === "bidding" && factions.has("zeth")
      ? () => toSubPhase("stealing")
      : onFinished;

  return (
    <main className="phase-container">
      <Helmet>
        <title>{headTitle}</title>
      </Helmet>
      <h1>{mainTitle}</h1>
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
          : `Begin Round ${round + 1}`}
      </button>
    </main>
  );
};

export default ConfluencePhase;
