import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after a short delay to not be intrusive
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-24 left-6 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-xs"
      >
        <button
          onClick={() => setShowPrompt(false)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 text-gray-400"
        >
          <X size={14} />
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
            <Download size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900">{t('pwa.install')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('pwa.installDesc')}</p>
            <button
              onClick={handleInstall}
              className="mt-2 px-4 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors"
            >
              {t('pwa.install')}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
