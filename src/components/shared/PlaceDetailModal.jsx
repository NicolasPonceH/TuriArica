import { useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { resolveMediaUrl } from '../../utils/constants';

export default function PlaceDetailModal({ place, onClose, onAudioClick, onRouteClick }) {
  const { t } = useLanguage();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!place) return null;

  const photos = place.photos || [];
  const videos = place.videos || [];
  const aiTags = place.aiTags || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md backdrop-blur-xs transition-colors"
          onClick={onClose}
        >
          <LucideIcons.X size={20} />
        </button>

        {/* Media Section: Photos & Videos */}
        <div className="mb-6 -mt-2 -mx-2">
          {photos.length > 0 && (
            <div className="space-y-2">
              <div className="rounded-2xl overflow-hidden h-56 sm:h-72 bg-gray-900 relative">
                <img
                  src={resolveMediaUrl(photos[activePhotoIdx] || photos[0])}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 px-1">
                  {photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhotoIdx(i)}
                      className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activePhotoIdx === i ? 'border-brand-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={resolveMediaUrl(photo)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Section if available */}
          {videos.length > 0 && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 bg-black">
              <div className="px-4 py-2 bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5">
                <LucideIcons.Film size={14} className="text-accent-400" />
                <span>Video de {place.name}</span>
              </div>
              <video
                src={resolveMediaUrl(videos[0])}
                controls
                preload="metadata"
                className="w-full max-h-72 object-contain"
              />
            </div>
          )}
        </div>

        {/* Categories & Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 bg-accent-50 text-accent-700 text-xs font-black rounded-full border border-accent-200">
            {place.category}
          </span>
          {place.priceRange && (
            <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200">
              {place.priceRange}
            </span>
          )}
          {aiTags.slice(0, 4).map((tag, i) => (
            <span key={i} className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-gray-900">{place.name}</h2>
        <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6">{place.fullDesc || place.shortDesc}</p>

        {/* Practical info cards */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4 mb-6">
          <div className="flex gap-4 items-start">
            <LucideIcons.MapPin className="text-accent-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-0.5">{t('detail.howToGet')}</h4>
              <p className="text-gray-600 text-sm">{place.directions || "Consultar en el mapa interactivo."}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <LucideIcons.Bus className="text-accent-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-0.5">{t('detail.transport')}</h4>
              <p className="text-gray-600 text-sm">
                {t('detail.busLines')}: <span className="font-black text-gray-800">{place.transport?.lineas?.join(", ") || "No especificada"}</span> <br/>
                {place.transport?.letrero && <span>{t('detail.sign')}: {place.transport.letrero} <br/></span>}
                {place.transport?.parada && <span>{t('detail.stop')}: {place.transport.parada}</span>}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <LucideIcons.Clock className="text-accent-500 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-0.5">{t('detail.schedule')}</h4>
              <p className="text-gray-600 text-sm">{place.hours || "Sin horario especificado"}</p>
            </div>
          </div>

          {place.phone && (
            <div className="flex gap-4 items-start">
              <LucideIcons.Phone className="text-accent-500 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-0.5">{t('detail.phone')}</h4>
                <a href={`tel:${place.phone}`} className="text-brand-600 hover:underline text-sm font-semibold">{place.phone}</a>
              </div>
            </div>
          )}

          {place.website && (
            <div className="flex gap-4 items-start">
              <LucideIcons.Globe className="text-accent-500 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-0.5">{t('detail.website')}</h4>
                <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline text-sm font-semibold truncate block max-w-xs">{place.website}</a>
              </div>
            </div>
          )}
        </div>

        {/* Modal footer buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onAudioClick && onAudioClick(place)}
            className="flex-1 py-3 px-4 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <LucideIcons.Volume2 size={18} />
            <span>{t('card.listenAudio')}</span>
          </button>
          <button
            onClick={() => {
              onRouteClick && onRouteClick(place);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <LucideIcons.Navigation size={18} />
            <span>{t('card.howToGet')}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
