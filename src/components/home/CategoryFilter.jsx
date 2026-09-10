import * as LucideIcons from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES, CATEGORY_TYPES, getCategoriesByType } from '../../data/categories';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CategoryFilter({ activeCategory, setActiveCategory, activeType, setActiveType }) {
  const { t } = useLanguage();

  const filteredCategories = activeType === 'todos'
    ? CATEGORIES
    : getCategoriesByType(activeType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      {/* Type tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORY_TYPES.map(type => {
          const Icon = LucideIcons[type.icon] || LucideIcons.MapPin;
          return (
            <button
              key={type.id}
              onClick={() => {
                setActiveType(type.id);
                setActiveCategory('Todos');
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeType === type.id
                  ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={16} />
              {t(`cat.${type.id}`) || type.label}
            </button>
          );
        })}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('Todos')}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-all ${
            activeCategory === 'Todos'
              ? 'bg-accent-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {t('cat.all')}
        </button>

        {filteredCategories.map(cat => {
          const Icon = LucideIcons[cat.icon] || LucideIcons.MapPin;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat.id
                  ? 'text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
