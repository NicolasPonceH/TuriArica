import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, LogOut, Plus, Database, List, Bell, KeyRound, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import PlacesList from './PlacesList';
import PlaceForm from './PlaceForm';
import DataExport from './DataExport';
import EventsManager from './EventsManager';

export default function AdminLayout() {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit' | 'events' | 'export'
  const [editingPlace, setEditingPlace] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState(null);
  const [changingPass, setChangingPass] = useState(false);

  const { logout, adminUser, isBackendConnected, changePassword } = useAuth();
  const { t } = useLanguage();

  const handleEdit = (place) => {
    setEditingPlace(place);
    setView('edit');
  };

  const handleDone = () => {
    setEditingPlace(null);
    setView('list');
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPass(true);
    setPasswordNotice(null);

    const res = await changePassword(currentPassword, newPassword);
    setChangingPass(false);

    if (res.success) {
      setPasswordNotice({ type: 'success', text: 'Contraseña cambiada exitosamente.' });
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setShowPasswordModal(false), 2000);
    } else {
      setPasswordNotice({ type: 'error', text: res.error || 'Error al cambiar contraseña.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
              <Mountain className="text-accent-500" size={24} />
              <span>TuriArica</span>
            </Link>
            <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-200">
              Admin: {adminUser?.username || 'admin'}
            </span>

            {/* Backend DB indicator */}
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              title={isBackendConnected ? 'Base de datos SQLite activa' : 'Modo local offline'}
            >
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isBackendConnected ? 'Base de Datos SQLite' : 'Modo Local'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setPasswordNotice(null);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Cambiar Contraseña"
            >
              <KeyRound size={15} />
              <span className="hidden sm:inline">Credenciales</span>
            </button>

            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-gray-800 font-bold px-3 py-2 transition-colors hidden sm:inline"
            >
              ← {t('admin.backToSite')}
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
            >
              <LogOut size={15} />
              <span>{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin navigation tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1.5 py-2.5 overflow-x-auto">
          <button
            onClick={() => { setView('list'); setEditingPlace(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ${
              view === 'list'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List size={16} />
            <span>Lugares</span>
          </button>

          <button
            onClick={() => { setView('add'); setEditingPlace(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ${
              view === 'add'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus size={16} />
            <span>{t('admin.addPlace')}</span>
          </button>

          <button
            onClick={() => { setView('events'); setEditingPlace(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ${
              view === 'events'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell size={16} />
            <span>Eventos & Avisos</span>
          </button>

          <button
            onClick={() => { setView('export'); setEditingPlace(null); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ${
              view === 'export'
                ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Database size={16} />
            <span>Datos & Backup</span>
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
        {view === 'events' && (
          <EventsManager />
        )}
        {view === 'export' && (
          <DataExport />
        )}
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-extrabold text-gray-900 mb-1 flex items-center gap-2">
              <KeyRound className="text-brand-500" size={20} />
              <span>Cambiar Contraseña de Administrador</span>
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Actualiza las credenciales de acceso al panel para proteger el sitio.
            </p>

            {passwordNotice && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-bold flex items-center gap-2 ${
                  passwordNotice.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {passwordNotice.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{passwordNotice.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nueva Contraseña (mínimo 6 caracteres)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-500 outline-none text-sm"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={changingPass}
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {changingPass ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
