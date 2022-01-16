import "./Phase.css";

const EconomyPhase = ({
  roundLabel,
  onFinished,
}: {
  roundLabel: string;
  onFinished: () => void;
}) => (
  <main className="phase-container">
    <h1>{roundLabel} Economy Phase</h1>
    <article className="big-text">Run all 🡆 converters</article>
    <button onClick={onFinished} className="phase-control-button">
      Finished
    </button>
  </main>
);

export default EconomyPhase;
