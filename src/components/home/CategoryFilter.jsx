import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORY_TYPES } from '../../data/categories';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CategoryFilter({ activeType, setActiveType, setActiveCategory }) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      {/* Barra de Categoría Sencilla y Elegante */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl max-w-full overflow-x-auto no-scrollbar border border-white/60 dark:border-white/10 shadow-xs">
        {CATEGORY_TYPES.map(type => {
          const Icon = LucideIcons[type.icon] || LucideIcons.Compass;
          const isSelected = activeType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => {
                setActiveType(type.id);
                if (setActiveCategory) setActiveCategory('Todos');
              }}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeCategoryType"
                  className="absolute inset-0 bg-brand-500 rounded-xl shadow-md shadow-brand-500/25"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={16} />
                <span>{t(`cat.${type.id}`) || type.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
