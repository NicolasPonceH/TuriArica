import { useState, useEffect } from 'react';
import { Type, Moon, Volume2, Settings, ZoomIn, ZoomOut, Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessibilityToolbar({ onAssistantClick, onReadPageClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const adjustText = (delta) => {
    const newSize = Math.max(14, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const toggleContrast = () => {
    document.body.classList.toggle('high-contrast');
  };

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Backdrop overlay on mobile for easy dismiss */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        {/* Menú Desplegable HACIA ARRIBA */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="accessibility-menu"
              initial={{ opacity: 0, y: 25, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.88 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ transformOrigin: "bottom right" }}
              className="mb-3 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-white/98 backdrop-blur-2xl rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.15)] border border-slate-200 p-4 sm:p-5 flex flex-col gap-4 text-slate-900 ring-1 ring-black/5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-slate-900">
                  <span className="p-1.5 rounded-lg bg-accent-500/10 text-accent-500">
                    <Settings size={16} />
                  </span>
                  Ajustes de Accesibilidad
                </h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Cerrar ajustes"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tamaño de texto */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tamaño del Texto
                </p>
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1 border border-slate-200/60">
                  <button 
                    onClick={() => adjustText(-2)} 
                    className="flex-1 py-2.5 flex justify-center items-center rounded-xl bg-white shadow-xs hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200/50 transition-all"
                    aria-label="Disminuir tamaño de texto"
                  >
                    <ZoomOut size={17} />
                  </button>
                  <div className="flex-1 py-2 flex justify-center items-center font-black text-sky-600 text-sm">
                    {fontSize}px
                  </div>
                  <button 
                    onClick={() => adjustText(2)} 
                    className="flex-1 py-2.5 flex justify-center items-center rounded-xl bg-white shadow-xs hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200/50 transition-all"
                    aria-label="Aumentar tamaño de texto"
                  >
                    <ZoomIn size={17} />
                  </button>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={toggleContrast} 
                  className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200/80 active:scale-95 text-slate-800"
                >
                  <Moon size={18} className="text-sky-500" />
                  <span className="text-xs font-bold">Contraste</span>
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onReadPageClick && onReadPageClick();
                  }} 
                  className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200/80 active:scale-95 text-slate-800"
                >
                  <Volume2 size={18} className="text-accent-500" />
                  <span className="text-xs font-bold">Leer Pantalla</span>
                </button>
              </div>

              {/* Turi-Asistente */}
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onAssistantClick && onAssistantClick();
                }} 
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-sky-500 to-accent-500 hover:from-sky-600 hover:to-accent-600 text-white rounded-2xl transition-all shadow-[0_4px_18px_rgba(14,165,233,0.35)] active:scale-98 font-extrabold text-sm"
              >
                <Bot size={20} />
                <span>Abrir Turi-Asistente</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón Flotante de la Tuerca */}
        <motion.button 
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-3.5 sm:p-4 bg-accent-500 text-white rounded-full shadow-[0_4px_25px_rgba(249,115,22,0.5)] hover:bg-accent-600 hover:scale-105 transition-all duration-300 flex items-center justify-center relative focus:outline-none focus:ring-4 focus:ring-accent-300/50"
          aria-label="Herramientas de accesibilidad"
          title="Opciones de accesibilidad"
        >
          <Settings 
            size={26} 
            className={`transition-transform duration-500 ease-out ${isOpen ? "rotate-90" : "rotate-0"}`} 
          />
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-600"></span>
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
}
