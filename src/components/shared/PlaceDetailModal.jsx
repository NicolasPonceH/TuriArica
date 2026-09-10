import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PlaceDetailModal({ place, onClose, onAudioClick, onRouteClick }) {
  const { t } = useLanguage();

  if (!place) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
          onClick={onClose}
        >
          <LucideIcons.X size={24} />
        </button>

        <div className="mb-6">
          {/* Photo carousel if available */}
          {place.photos && place.photos.length > 0 && (
            <div className="mb-4 -mt-2 -mx-2 rounded-2xl overflow-hidden">
              <img src={place.photos[0]} alt={place.name} className="w-full h-48 object-cover" />
            </div>
          )}

          <span className="inline-block px-3 py-1 bg-accent-50 text-accent-600 text-xs font-bold rounded-full mb-4 border border-accent-200">
            {place.category}
          </span>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">{place.name}</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">{place.fullDesc}</p>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
            <div className="flex gap-4 items-start">
              <LucideIcons.MapPin className="text-accent-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t('detail.howToGet')}</h4>
                <p className="text-gray-600">{place.directions}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <LucideIcons.Bus className="text-accent-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t('detail.transport')}</h4>
                <p className="text-gray-600">
                  {t('detail.busLines')}: <span className="font-bold">{place.transport?.lineas?.join(", ") || "N/A"}</span> <br/>
                  {t('detail.sign')}: {place.transport?.letrero || ""} <br/>
                  {t('detail.stop')}: {place.transport?.parada || ""}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <LucideIcons.Clock className="text-accent-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{t('detail.schedule')}</h4>
                <p className="text-gray-600">{place.hours}</p>
              </div>
            </div>

            {place.phone && (
              <div className="flex gap-4 items-start">
                <LucideIcons.Phone className="text-accent-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('detail.phone')}</h4>
                  <a href={`tel:${place.phone}`} className="text-brand-600 hover:underline">{place.phone}</a>
                </div>
              </div>
            )}

            {place.website && (
              <div className="flex gap-4 items-start">
                <LucideIcons.Globe className="text-accent-500 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('detail.website')}</h4>
                  <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">{place.website}</a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onAudioClick(place)}
            className="flex-1 py-3 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LucideIcons.Volume2 size={20} />
            {t('places.listenAudio')}
          </button>
          <button
            onClick={() => {
              onClose();
              onRouteClick(place);
            }}
            className="flex-1 py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <LucideIcons.Navigation size={20} />
            {t('places.traceRoute')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
