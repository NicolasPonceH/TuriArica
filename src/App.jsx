import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { PlacesProvider } from './contexts/PlacesContext';
import { EventsProvider } from './contexts/EventsContext';
import HomePage from './pages/HomePage';
import ErrorBoundary from './ErrorBoundary';
import { Loader2, Compass } from 'lucide-react';

const MapPage = lazy(() => import('./pages/MapPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50/30 flex flex-col items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-xl border border-sky-100/80 rounded-3xl p-8 shadow-xl shadow-sky-900/5 flex flex-col items-center gap-4 text-center max-w-xs animate-in fade-in zoom-in-95 duration-200">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <Compass size={28} className="text-sky-600 animate-pulse" />
          </div>
          <Loader2 size={36} className="absolute -inset-1.5 animate-spin text-sky-400 opacity-60" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm">Cargando experiencia...</h3>
          <p className="text-xs text-slate-500 mt-1">Preparando la información de Arica</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <LanguageProvider>
        <AuthProvider>
          <PlacesProvider>
            <EventsProvider>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/mapa" element={<MapPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </EventsProvider>
          </PlacesProvider>
        </AuthProvider>
      </LanguageProvider>
    </HashRouter>
  );
}

export default App;
