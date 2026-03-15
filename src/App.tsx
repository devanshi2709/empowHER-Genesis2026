import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NavBar } from '@/components/shared/NavBar';
import { Dashboard } from '@/pages/Dashboard';
import { Advocacy } from '@/pages/Advocacy';
import { SunLink } from '@/pages/SunLink';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/advocacy" element={<Advocacy />} />
            <Route path="/sunlink" element={<SunLink />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
