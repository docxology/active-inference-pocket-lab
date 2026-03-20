/**
 * @file App.jsx — Root Application Component
 * @description Sets up React Router and wraps the app with context providers.
 * Routes map to the five-tab navigation plus module detail views.
 *
 * @module App
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ActivityBankProvider } from './contexts/ActivityBankContext';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import ModuleListPage from './pages/ModuleListPage';
import ModulePage from './pages/ModulePage';
import ProficiencyMapPage from './pages/ProficiencyMapPage';
import HearthPage from './pages/HearthPage';
import PausePage from './pages/PausePage';

/**
 * App — Root component with routing and context providers.
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ActivityBankProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/modules" element={<ModuleListPage />} />
              <Route path="/modules/:moduleId" element={<ModulePage />} />
              <Route path="/map" element={<ProficiencyMapPage />} />
              <Route path="/hearth" element={<HearthPage />} />
              <Route path="/pause" element={<PausePage />} />
            </Route>
          </Routes>
        </ActivityBankProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
