import "./Phase.css";

const ScoringPhase = ({ onFinished }: { onFinished: () => void }) => (
  <main className="phase-container">
    <h1>Scoring</h1>
    <article>
      <ul>
        <li>
          Worth 1 point:
          <ul>
            <li>2 Octagons.</li>
            <li>4 Large Cubes.</li>
            <li>6 Small Cubes or Ships.</li>
          </ul>
        </li>
      </ul>
      <ul></ul>
    </article>
    <button onClick={onFinished} className="phase-control-button">
      Finished
    </button>
  </main>
);

export default ScoringPhase;
