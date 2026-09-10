import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, MapPin, Accessibility, Mountain, Search, Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePlaces } from '../../contexts/PlacesContext';
import { SUPPORTED_LANGUAGES } from '../../utils/constants';
import NotificationBell from '../shared/NotificationBell';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { searchPlaces } = usePlaces();

  const searchResults = searchQuery.trim() ? searchPlaces(searchQuery).slice(0, 5) : [];

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4"
    >
      <div className="max-w-6xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 shrink-0">
          <Mountain className="text-accent-500" />
          <span className="hidden sm:inline">TuriArica</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <li><a href="/#inicio" className="hover:text-brand-600 transition-colors">{t('nav.home')}</a></li>
          <li><a href="/#lugares" className="hover:text-brand-600 transition-colors">{t('nav.places')}</a></li>
          <li><a href="/#mapa" className="hover:text-brand-600 transition-colors">{t('nav.map')}</a></li>
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Search toggle */}
          <button
            onClick={() => { setSearchOpen(!searchOpen); setMobileOpen(false); setLangOpen(false); }}
            className="p-2 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors"
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setSearchOpen(false); setMobileOpen(false); }}
              className="p-2 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors flex items-center gap-1"
              aria-label="Idioma"
            >
              <Globe size={20} />
              <span className="text-xs font-bold hidden sm:inline">{language.toUpperCase()}</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 min-w-[180px] z-50"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                        language === lang.code
                          ? 'bg-brand-50 text-brand-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => { setMobileOpen(!mobileOpen); setSearchOpen(false); setLangOpen(false); }}
            className="p-2 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors md:hidden"
            aria-label="Menú"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-6xl mx-auto mt-2"
          >
            <div className="glass-panel rounded-2xl px-4 py-3 shadow-2xl">
              <div className="flex items-center gap-3">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  {searchResults.map(place => (
                    <a
                      key={place.id}
                      href="/#mapa"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: place.color + '30' }}
                      >
                        <MapPin size={14} style={{ color: place.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{place.name}</p>
                        <p className="text-xs text-gray-500">{place.category}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-6xl mx-auto mt-2 md:hidden"
          >
            <div className="glass-panel rounded-2xl px-6 py-4 shadow-2xl">
              <ul className="space-y-1">
                {[
                  { href: "/#inicio", label: t('nav.home') },
                  { href: "/#lugares", label: t('nav.places') },
                  { href: "/#mapa", label: t('nav.map') },
                ].map(item => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 px-4 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
