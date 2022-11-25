import "./Phase.css";
import { Helmet } from "react-helmet";
import { RoundId } from "../../rules";

const EconomyPhase = ({
  round,
  onFinished,
}: {
  round: RoundId;
  onFinished: () => void;
}) => {
  const lastRound = round === 6;
  const title = `${lastRound ? "Final" : `Round ${round}`} Economy Phase`;

  return (
    <main className="phase-container">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <h1>{title}</h1>
      {lastRound ? (
        <article className="big-text">Run all 🡆 converters</article>
      ) : (
        <article className="big-text">
          {"Run all 🡆 converters, keep all "}
          <span className="donation">donations</span>
        </article>
      )}
      <button onClick={onFinished} className="phase-control-button">
        Finished
      </button>
    </main>
  );
};

export default EconomyPhase;
