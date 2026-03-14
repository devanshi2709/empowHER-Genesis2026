import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/shared/AppShell";
import SunLink from "./pages/SunLink";

const AdvocacyPage: React.FC = () => (
  <div className="page-frame">
    <div className="glass-page-heading">
      <div>
        <h1>Your Connected Path</h1>
        <p>Personalized next steps based on your scan results.</p>
      </div>
    </div>
    <div className="glass-surface page-section-stack" style={{ padding: "1.5rem" }}>
      <p style={{ color: "rgba(244,244,244,0.8)" }}>
        Advocacy content and recommended actions will appear here based on your latest SunLink scan.
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<SunLink />} />
        <Route path="/scan" element={<SunLink />} />
        <Route path="/result" element={<AdvocacyPage />} />
        <Route path="/advocacy" element={<AdvocacyPage />} />
      </Routes>
    </AppShell>
  );
};

export default App;