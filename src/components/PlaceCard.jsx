import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

export default function PlaceCard({ place, onAudioClick, onRouteClick, onMoreClick }) {
  const IconComponent = LucideIcons[place.icon] || LucideIcons.MapPin;

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full group bg-white shadow-lg hover:shadow-xl transition-shadow"
    >
      <div 
        className="h-32 relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${place.color}40, ${place.color}80)` }}
      >
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-gray-800 shadow-sm">
          {place.category}
        </span>
        <motion.div 
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg"
        >
          <IconComponent size={32} className="text-white" />
        </motion.div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-brand-600 transition-colors">
          {place.name}
        </h3>
        <p className="text-gray-600 text-sm mb-6 flex-grow">
          {place.shortDesc}
        </p>

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
            Ver más
          </button>
        </div>
      </div>
    </motion.article>
  );
}
