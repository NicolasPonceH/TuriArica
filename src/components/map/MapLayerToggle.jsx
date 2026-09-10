import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../../data/categories';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MapLayerToggle({ visibleCategories, onToggleCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="absolute top-4 right-4 z-20 pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-2.5 flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <LucideIcons.Layers size={16} />
        {t('map.layers')}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute right-0 top-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-3 min-w-[200px] max-h-[400px] overflow-y-auto"
        >
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 px-1">
            {t('map.layers')}
          </p>
          <div className="space-y-0.5">
            {CATEGORIES.map(cat => {
              const Icon = LucideIcons[cat.icon] || LucideIcons.MapPin;
              const isVisible = visibleCategories.includes(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => onToggleCategory(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isVisible
                      ? 'bg-gray-50 text-gray-900'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-opacity ${
                      isVisible ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon size={12} className="text-white" />
                  </div>
                  <span className="flex-1 text-left truncate">{cat.label}</span>
                  {isVisible ? (
                    <LucideIcons.Eye size={14} className="text-green-500 shrink-0" />
                  ) : (
                    <LucideIcons.EyeOff size={14} className="text-gray-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
