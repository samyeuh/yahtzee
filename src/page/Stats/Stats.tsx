import React from "react";
import Navbar from "../../components/Navbar/Navbar";

const GrafanaPanel: React.FC = () => {
  return <>
    <Navbar />
    <div className="grafana-container" style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>les stats!!!! :o</h2>
      <iframe
        src="http://localhost:3000/public-dashboards/85b582cd7d77487b8207fd98b2868d28"
        width="100%"
        height="800"
        allowFullScreen
        title="Grafana Dashboard"
      />
    </div>
  </>;
};

export default GrafanaPanel;
