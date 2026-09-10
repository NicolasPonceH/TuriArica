import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, LogOut, Plus, Database, List } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import PlacesList from './PlacesList';
import PlaceForm from './PlaceForm';
import DataExport from './DataExport';

export default function AdminLayout() {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit' | 'export'
  const [editingPlace, setEditingPlace] = useState(null);
  const { logout } = useAuth();
  const { t } = useLanguage();

  const handleEdit = (place) => {
    setEditingPlace(place);
    setView('edit');
  };

  const handleDone = () => {
    setEditingPlace(null);
    setView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
              <Mountain className="text-accent-500" size={24} />
              <span>TuriArica</span>
            </Link>
            <span className="px-2 py-0.5 bg-brand-50 text-brand-600 text-xs font-bold rounded-full border border-brand-100">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors hidden sm:inline"
            >
              ← {t('admin.backToSite')}
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin navigation tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 py-2">
          <button
            onClick={() => { setView('list'); setEditingPlace(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              view === 'list'
                ? 'bg-brand-50 text-brand-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <List size={16} />
            Lugares
          </button>
          <button
            onClick={() => { setView('add'); setEditingPlace(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              view === 'add'
                ? 'bg-brand-50 text-brand-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Plus size={16} />
            {t('admin.addPlace')}
          </button>
          <button
            onClick={() => { setView('export'); setEditingPlace(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              view === 'export'
                ? 'bg-brand-50 text-brand-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Database size={16} />
            Datos
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {view === 'list' && (
          <PlacesList onEdit={handleEdit} />
        )}
        {view === 'add' && (
          <PlaceForm onDone={handleDone} />
        )}
        {view === 'edit' && editingPlace && (
          <PlaceForm place={editingPlace} onDone={handleDone} />
        )}
        {view === 'export' && (
          <DataExport />
        )}
      </main>
    </div>
  );
}
