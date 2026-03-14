import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/shared/AppShell";
import SunLink from "./pages/SunLink";
import AdvocacyPage from "./pages/Advocacy";

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
