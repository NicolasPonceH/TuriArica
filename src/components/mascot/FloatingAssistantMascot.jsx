import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import TuriMascot from './TuriMascot';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * FloatingAssistantMascot - Botón flotante interactivo con la mascota Turi.
 * Sigue el cursor con la mirada, tiene microinteracciones y abre el Asistente Turístico.
 */
export default function FloatingAssistantMascot({
  onOpenAssistant,
  positionClassName = "bottom-6 right-20 sm:right-24"
}) {
  const { t } = useLanguage();
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Mostrar el saludo inicial tras 2 segundos si el usuario no ha interactuado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowSpeechBubble(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleMascotClick = (e) => {
    setHasInteracted(true);
    setShowSpeechBubble(false);
    if (onOpenAssistant) {
      onOpenAssistant();
    }
  };

  return (
    <aside aria-label="Asistente virtual interactiva Momita" className={`fixed ${positionClassName} z-40 flex flex-col items-end pointer-events-auto`}>
      {/* Globo de diálogo contextual / Tooltip interactivo */}
      <AnimatePresence>
        {showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2 mr-1 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-sky-100 flex items-center gap-2 max-w-[210px] sm:max-w-xs relative group cursor-pointer"
            onClick={handleMascotClick}
          >
            <Sparkles size={14} className="text-amber-500 shrink-0 animate-pulse" />
            <span className="leading-snug">
              ¡Hola! Soy <strong>Momita</strong>. Haz clic para preguntarme lo que necesites ✨
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeechBubble(false);
                setHasInteracted(true);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Cerrar saludo"
            >
              <X size={12} />
            </button>
            {/* Flecha del globo hacia la mascota */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-sky-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor del Botón de la Mascota */}
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => {
          if (!hasInteracted) setShowSpeechBubble(true);
        }}
      >
        {/* Halo luminoso / Glow decorativo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/30 to-amber-400/30 rounded-full blur-lg scale-90 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />

        {/* Base circular con cristal táctil y sombra suave */}
        <div
          onClick={handleMascotClick}
          className="relative bg-white/90 hover:bg-white backdrop-blur-xl border-2 border-white shadow-[0_8px_25px_rgba(14,165,233,0.22)] hover:shadow-[0_12px_32px_rgba(14,165,233,0.35)] rounded-full p-1 transition-all duration-200 ease-out active:scale-95 flex items-center justify-center"
        >
          {/* Componente Mascota reactivo al cursor */}
          <div className="w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center overflow-hidden rounded-full">
            <TuriMascot
              size={64}
              label="Momita, tu asistente turística de Arica"
              onClick={handleMascotClick}
            />
          </div>

          {/* Badge indicador de estado online */}
          <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
            <div className="relative flex items-center justify-center w-3.5 h-3.5 bg-emerald-500 rounded-full">
              <span className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75" />
              <MessageCircle size={8} className="text-white relative z-10" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
