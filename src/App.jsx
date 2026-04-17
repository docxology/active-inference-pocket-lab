/**
 * @file App.jsx — Root Application Component
 * @description Sets up React Router and wraps the app with context providers.
 * Routes: Home, Modules (list + detail), Map, Hearth, Pause, Glossary, Search, Settings, 404.
 *
 * Route-level code splitting via React.lazy keeps the initial bundle small
 * so the app boots quickly on mobile networks; Suspense provides a
 * reduced-motion-safe loading fallback.
 *
 * @module App
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ActivityBankProvider } from './contexts/ActivityBankContext';
import { SettingsProvider } from './contexts/SettingsContext';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import RouteFallback from './components/layout/RouteFallback';

// Route-level code splitting. HomePage is eager (first paint);
// everything else is lazy.
const ModuleListPage = lazy(() => import('./pages/ModuleListPage'));
const ModulePage = lazy(() => import('./pages/ModulePage'));
const ProficiencyMapPage = lazy(() => import('./pages/ProficiencyMapPage'));
const HearthPage = lazy(() => import('./pages/HearthPage'));
const PausePage = lazy(() => import('./pages/PausePage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * App — Root component with routing and context providers.
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppProvider>
          <ActivityBankProvider>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/modules"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ModuleListPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/modules/:moduleId"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ModulePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <ProficiencyMapPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/hearth"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <HearthPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/pause"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <PausePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/glossary"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <GlossaryPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <SearchPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <SettingsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<RouteFallback />}>
                      <NotFoundPage />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </ActivityBankProvider>
        </AppProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
