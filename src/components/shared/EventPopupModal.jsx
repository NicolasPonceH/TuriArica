import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, Calendar, ExternalLink, Bell } from 'lucide-react';
import { useEvents } from '../../contexts/EventsContext';
import { resolveMediaUrl } from '../../utils/constants';

export default function EventPopupModal() {
  const { featuredPopup, dismissPopup } = useEvents();

  if (!featuredPopup) return null;

  const getTypeBadge = (type) => {
    switch (type) {
      case 'festival':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider">🎉 Festival</span>;
      case 'alerta':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500 text-white uppercase tracking-wider">⚠️ Aviso Preventivo</span>;
      case 'cultural':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500 text-white uppercase tracking-wider">🎭 Cultura</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-500 text-white uppercase tracking-wider">📅 Evento</span>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-lg w-full relative"
        >
          {/* Close button */}
          <button
            onClick={() => dismissPopup(featuredPopup.id)}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
            title="Cerrar"
          >
            <X size={18} />
          </button>

          {/* Banner */}
          {featuredPopup.bannerUrl ? (
            <div className="h-52 w-full relative bg-slate-900 overflow-hidden">
              <img
                src={resolveMediaUrl(featuredPopup.bannerUrl)}
                alt={featuredPopup.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <div className="mb-2">{getTypeBadge(featuredPopup.type)}</div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {featuredPopup.title}
                </h3>
              </div>
            </div>
          ) : (
            <div className="p-6 pb-2 bg-gradient-to-br from-brand-500 to-accent-500 text-white">
              <div className="mb-2">{getTypeBadge(featuredPopup.type)}</div>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                {featuredPopup.title}
              </h3>
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-7 space-y-4">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {featuredPopup.message}
            </p>

            {(featuredPopup.startDate || featuredPopup.endDate) && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                <Calendar size={15} className="text-brand-500 shrink-0" />
                <span>
                  Vigencia: {featuredPopup.startDate || 'Inmediata'} {featuredPopup.endDate ? `hasta ${featuredPopup.endDate}` : ''}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              {featuredPopup.actionUrl ? (
                <a
                  href={featuredPopup.actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => dismissPopup(featuredPopup.id)}
                  className="flex-1 py-3 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black text-sm text-center transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <span>Más Información</span>
                  <ExternalLink size={15} />
                </a>
              ) : null}

              <button
                onClick={() => dismissPopup(featuredPopup.id)}
                className="py-3 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors text-center"
              >
                No volver a mostrar hoy
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
