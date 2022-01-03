import "./TechSharingDisplay.css";

const TechSharingDisplay = ({
  normalSharingBonus,
  yengiiSharingBonus,
  children,
}: {
  normalSharingBonus: number;
  yengiiSharingBonus: number | null;
  children: any;
}) => (
  <div className="tech-sharing-display">
    <div className="tech-sharing-sidebar">
      <h2>Sharing Bonus</h2>
      <div className="sharing-bonus">{normalSharingBonus}</div>
    </div>
    <div className="tech-sharing-main-content">{children}</div>
    <div className="tech-sharing-sidebar">
      {yengiiSharingBonus !== null ? (
        <>
          <h2>Yengii Bonus</h2>
          <div className="sharing-bonus">{yengiiSharingBonus}</div>
        </>
      ) : null}
    </div>
  </div>
);
export default TechSharingDisplay;
