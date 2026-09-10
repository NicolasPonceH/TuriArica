import { HashRouter, Routes, Route } from 'react-router-dom';
import { PlacesProvider } from './contexts/PlacesContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <HashRouter>
      <LanguageProvider>
        <PlacesProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </ErrorBoundary>
          </AuthProvider>
        </PlacesProvider>
      </LanguageProvider>
    </HashRouter>
  );
}

export default App;
