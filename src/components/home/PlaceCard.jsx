import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { resolveMediaUrl } from '../../utils/constants';

export default function PlaceCard({ place, onAudioClick, onRouteClick, onMoreClick }) {
  const IconComponent = LucideIcons[place.icon] || LucideIcons.MapPin;
  const { t } = useLanguage();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full group bg-white shadow-lg hover:shadow-xl transition-shadow"
    >
      {/* Header with gradient and icon */}
      <div
        className="h-32 relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${place.color}40, ${place.color}80)` }}
      >
        {/* Photo if available */}
        {place.photos && place.photos.length > 0 ? (
          <img
            src={resolveMediaUrl(place.photos[0])}
            alt={place.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}

        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
          <IconComponent size={12} style={{ color: place.color }} />
          {place.category}
        </span>

        {place.is24h && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/90 backdrop-blur-md rounded-full text-[10px] font-bold text-white">
            24h
          </span>
        )}

        {!place.photos?.length && (
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg"
          >
            <IconComponent size={32} className="text-white" />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-brand-600 transition-colors">
          {place.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {place.shortDesc}
        </p>

        {/* Price range if available */}
        {place.priceRange && (
          <p className="text-xs font-bold text-accent-600 mb-3">{place.priceRange}</p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onAudioClick(place)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-brand-600 transition-colors"
            aria-label={`Escuchar descripción de ${place.name}`}
          >
            <LucideIcons.Volume2 size={18} />
          </button>
          <button
            onClick={() => onRouteClick(place)}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-brand-600 transition-colors"
            aria-label={`Cómo llegar a ${place.name}`}
          >
            <LucideIcons.Navigation size={18} />
          </button>
          <button
            onClick={() => onMoreClick(place)}
            className="flex-1 py-2 px-4 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 hover:text-brand-700 font-bold transition-colors border border-brand-100"
          >
            {t('places.seeMore')}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
