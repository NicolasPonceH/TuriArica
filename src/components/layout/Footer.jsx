import { Link } from 'react-router-dom';
import { Mountain, Settings } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface-900 py-12 text-center border-t border-gray-200">
      <div className="flex items-center justify-center gap-2 font-bold text-2xl text-gray-800 mb-4">
        <Mountain className="text-accent-500" />
        <span>TuriArica</span>
      </div>
      <p className="text-gray-500 mb-6">{t('footer.tagline')}</p>
      <div className="text-sm text-gray-400 mb-4">
        {t('footer.madeWith')}
      </div>

      {/* Admin link - discrete */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-gray-500 transition-colors"
        >
          <Settings size={12} />
          <span>{t('footer.admin')}</span>
        </Link>
      </div>
    </footer>
  );
}
