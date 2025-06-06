import React from "react";

const GrafanaPanel: React.FC = () => {
  return (
    <div className="grafana-container" style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Stats Yahtzee</h2>
      <iframe
        src="http://localhost:3000/goto/g9VxeMYNR?orgId=1"
        width="100%"
        height="800"
        allowFullScreen
        title="Grafana Dashboard"
      />
    </div>
  );
};

export default GrafanaPanel;
