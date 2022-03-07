import "./Phase.css";

const ScoringPhase = ({ onFinished }: { onFinished: () => void }) => (
  <main className="phase-container">
    <h1>Scoring</h1>
    <article className="big-text">Score</article>
    <button onClick={onFinished} className="phase-control-button">
      Finished
    </button>
  </main>
);

export default ScoringPhase;
