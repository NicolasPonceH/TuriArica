import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, ExternalLink, X, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '../../contexts/EventsContext';
import { resolveMediaUrl } from '../../utils/constants';

export default function NotificationBell() {
  const { activeEvents } = useEvents();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const badgeCount = activeEvents.length;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
        title="Avisos y Eventos en Arica"
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        {badgeCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-accent-500 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-sm animate-pulse">
            {badgeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-accent-400" />
                <span className="font-extrabold text-sm">Eventos y Avisos en Arica</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-100">
              {activeEvents.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No hay avisos ni alertas activas en este momento.
                </div>
              ) : (
                activeEvents.map((evt) => (
                  <div key={evt.id} className="p-4 hover:bg-gray-50/80 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-100">
                        {evt.type}
                      </span>
                      {evt.endDate && (
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                          <Calendar size={11} /> {evt.endDate}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-gray-900 text-sm mb-1">{evt.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-3">
                      {evt.message}
                    </p>

                    {evt.actionUrl && (
                      <a
                        href={evt.actionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                      >
                        <span>Más información</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
