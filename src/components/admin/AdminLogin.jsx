import { useState } from 'react';
import { Lock, Mountain, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mountain size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">TuriArica</h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.title')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <Lock size={14} className="inline mr-1.5" />
              {t('admin.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                  error
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-brand-500 bg-gray-50'
                }`}
                placeholder="••••••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 font-medium"
              >
                {t('admin.wrongPassword')}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('admin.login')}
          </button>
        </form>

        <a
          href="/"
          className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-6 transition-colors"
        >
          ← {t('admin.backToSite')}
        </a>
      </motion.div>
    </div>
  );
}
