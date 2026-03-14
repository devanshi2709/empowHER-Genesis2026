import React from "react";
import { Routes, Route } from "react-router-dom";
import SunLink from "./pages/SunLink";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/sunlink" element={<SunLink />} />
      <Route path="/" element={<SunLink />} />
    </Routes>
  );
};

export default App;