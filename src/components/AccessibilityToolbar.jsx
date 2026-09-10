import { useState } from 'react';
import { Type, Moon, Volume2, Mic, Settings, ZoomIn, ZoomOut, Bot } from 'lucide-react';
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

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="flex flex-col bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 p-5 w-72 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <Settings size={18} className="text-accent-500" />
                Ajustes Rápidos
              </h4>
            </div>

            <div className="space-y-4">
              {/* Tamaño de texto */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tamaño de Texto</p>
                <div className="flex bg-gray-100 rounded-2xl p-1">
                  <button onClick={() => adjustText(-2)} className="flex-1 py-2 flex justify-center items-center rounded-xl hover:bg-white hover:shadow-sm text-gray-700 transition-all">
                    <ZoomOut size={18} />
                  </button>
                  <div className="flex-1 py-2 flex justify-center items-center font-bold text-brand-600 text-sm">
                    {fontSize}px
                  </div>
                  <button onClick={() => adjustText(2)} className="flex-1 py-2 flex justify-center items-center rounded-xl hover:bg-white hover:shadow-sm text-gray-700 transition-all">
                    <ZoomIn size={18} />
                  </button>
                </div>
              </div>

              {/* Botones de acción rápida */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={toggleContrast} 
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-100 text-gray-700 hover:text-brand-600"
                >
                  <Moon size={20} />
                  <span className="text-xs font-bold">Contraste</span>
                </button>
                <button 
                  onClick={onReadPageClick} 
                  className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-100 text-gray-700 hover:text-brand-600"
                >
                  <Volume2 size={20} />
                  <span className="text-xs font-bold">Leer pág.</span>
                </button>
              </div>

              {/* Asistente CTA */}
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onAssistantClick();
                }} 
                className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-2xl transition-all shadow-[0_4px_15px_rgba(14,165,233,0.3)] hover:shadow-[0_4px_20px_rgba(14,165,233,0.5)] font-bold mt-2 hover:scale-[1.02]"
              >
                <Bot size={22} />
                Turi-Asistente
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-accent-500 text-white rounded-full shadow-[0_4px_25px_rgba(249,115,22,0.5)] hover:bg-accent-600 hover:scale-110 transition-all duration-300"
        aria-label="Herramientas de accesibilidad"
      >
        <Settings size={28} className={`transition-transform duration-500 ${isOpen ? "rotate-90" : "rotate-0"}`} />
      </button>
    </div>
  );
}
