import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mountain, LogOut, Plus, Database, List, Bell, KeyRound,
  CheckCircle2, AlertCircle, X, LayoutDashboard, UserCheck, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePlaces } from '../../contexts/PlacesContext';
import { useEvents } from '../../contexts/EventsContext';
import AdminDashboard from './AdminDashboard';
import PlacesList from './PlacesList';
import PlaceForm from './PlaceForm';
import DataExport from './DataExport';
import EventsManager from './EventsManager';

export default function AdminLayout() {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'list' | 'add' | 'edit' | 'events' | 'export'
  const [editingPlace, setEditingPlace] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState(null);
  const [changingPass, setChangingPass] = useState(false);

  const { logout, adminUser, isBackendConnected, changePassword } = useAuth();
  const { places } = usePlaces();
  const { activeEvents } = useEvents();
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

  const username = adminUser?.username || 'admin';
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);
  const initialLetter = displayName.charAt(0);
  const avatarGradient = username === 'nicolas'
    ? 'from-blue-600 to-cyan-500'
    : 'from-purple-600 to-pink-500';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <Link to="/" className="flex items-center gap-2.5 font-black text-xl text-slate-900 tracking-tight group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Mountain size={20} />
              </div>
              <span className="font-extrabold">TuriArica</span>
            </Link>

            {/* DB status pill */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                isBackendConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={isBackendConnected ? 'Base de datos SQLite activa' : 'Modo local'}
            >
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isBackendConnected ? 'SQLite 3 Activo' : 'Modo Local'}</span>
            </div>
          </div>

          {/* Right Profile & Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-brand-600 font-bold px-3 py-2 rounded-lg transition-colors hidden md:inline-flex items-center gap-1"
            >
              ← {t('admin.backToSite')}
            </Link>

            {/* User Profile Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-2xs"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} text-white font-black text-sm flex items-center justify-center shadow-xs`}>
                  {initialLetter}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-none">{displayName}</p>
                  <p className="text-[10px] font-semibold text-slate-400 capitalize">{adminUser?.role || 'Admin'}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900">{displayName}</p>
                    <p className="text-[11px] text-slate-500">Credencial activa en SQLite</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true);
                      setPasswordNotice(null);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <KeyRound size={15} className="text-slate-400" />
                    <span>Cambiar Contraseña</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={15} />
                    <span>{t('admin.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation Bar (Sleek SaaS Tabs) */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[61px] z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setView('dashboard'); setEditingPlace(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
              view === 'dashboard'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Resumen</span>
          </button>

          <button
            onClick={() => { setView('list'); setEditingPlace(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
              view === 'list'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <List size={16} />
            <span>Lugares</span>
            <span className={`px-2 py-0.2 text-[11px] font-extrabold rounded-full ${view === 'list' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {places.length}
            </span>
          </button>

          <button
            onClick={() => { setView('add'); setEditingPlace(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
              view === 'add'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Plus size={16} />
            <span>{t('admin.addPlace')}</span>
          </button>

          <button
            onClick={() => { setView('events'); setEditingPlace(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
              view === 'events'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell size={16} />
            <span>Eventos & Avisos</span>
            {activeEvents.length > 0 && (
              <span className={`px-2 py-0.2 text-[11px] font-extrabold rounded-full ${view === 'events' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'}`}>
                {activeEvents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setView('export'); setEditingPlace(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 ${
              view === 'export'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database size={16} />
            <span>Base de Datos & Backup</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {view === 'dashboard' && (
          <AdminDashboard onNavigate={(v) => { setView(v); setEditingPlace(null); }} />
        )}
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <KeyRound className="text-brand-500" size={20} />
              <span>Cambiar Contraseña ({displayName})</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Actualiza la clave para la cuenta de <strong className="text-slate-800">{displayName}</strong>.
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nueva Contraseña (mínimo 6 caracteres)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 outline-none text-sm"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={changingPass}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {changingPass ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm"
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
