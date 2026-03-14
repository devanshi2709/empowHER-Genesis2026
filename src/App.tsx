import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/shared/AppShell'
import { DashboardPage } from '@/pages/Dashboard'
import { SunLinkPage } from '@/pages/SunLink'
import { AdvocacyPage } from '@/pages/Advocacy'
import { AppProvider } from '@/context/AppContext'

function App() {
  return (
    <AppProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/scan" element={<SunLinkPage />} />
          <Route path="/result" element={<AdvocacyPage />} />
        </Routes>
      </AppShell>
    </AppProvider>
  )
}

export default App
