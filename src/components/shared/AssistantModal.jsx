import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User } from 'lucide-react';
import { usePlaces } from '../../contexts/PlacesContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AssistantModal({ onClose }) {
  const { places } = usePlaces();
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState([
    { text: t('assistant.greeting'), isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Build context from places for AI
  const placesContext = places.map(p => `${p.name} (${p.category}): ${p.shortDesc}`).join('\n');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { text: userText, isBot: false }]);
    setInput('');
    setIsTyping(true);

    try {
      // Try Puter.js AI first
      if (typeof window !== 'undefined' && window.puter && window.puter.ai) {
        const systemPrompt = `Eres "Turi-Asistente", un guía turístico amigable y experto de Arica, Chile.
Responde siempre en ${language === 'es' ? 'español de Chile' : language === 'en' ? 'inglés' : language === 'pt' ? 'portugués' : 'español'}.
Sé breve (máximo 3 oraciones) y entusiasta.
Estos son los lugares disponibles en la app:
${placesContext}

Si el usuario pregunta por algo que no está en la lista, sugiere algo similar o dile que pronto se agregarán más lugares.`;

        const response = await window.puter.ai.chat(userText, {
          systemPrompt,
        });

        const botText = typeof response === 'string' ? response : response?.message?.content || response?.text || 'Lo siento, no pude procesar tu pregunta.';

        setMessages(prev => [...prev, { text: botText, isBot: true }]);
        setIsTyping(false);

        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(botText);
          utterance.lang = language === 'es' ? 'es-CL' : language === 'pt' ? 'pt-BR' : 'en-US';
          window.speechSynthesis.speak(utterance);
        }
        return;
      }
    } catch {
      // Fall through to local fallback
    }

    // Local fallback (keyword matching)
    setTimeout(() => {
      let respuesta = "No estoy seguro de qué lugar recomendarte. Intenta con 'playas', 'museos', 'restaurantes' o 'naturaleza'.";
      const q = userText.toLowerCase();
      if (q.includes("playa")) respuesta = "¡Arica tiene playas para todos! El Laucho y La Lisera son como piscinas naturales perfectas para ir en familia.";
      else if (q.includes("museo")) respuesta = "El Museo del Mar y el Museo de Sitio Colón 10 son opciones increíbles llenas de historia y cultura local.";
      else if (q.includes("comer") || q.includes("comida") || q.includes("restaurante")) respuesta = "Para comer rico y fresco, el Terminal Agropecuario ASOCAPEC es el lugar ideal. ¡También puedes buscar restaurantes en el mapa!";
      else if (q.includes("naturaleza")) respuesta = "El Humedal del Río Lluta es un santuario natural increíble para la observación de aves.";
      else if (q.includes("farmacia")) respuesta = "Puedes buscar farmacias en el mapa interactivo activando la capa 'Farmacias'. El administrador puede agregar nuevas.";
      else if (q.includes("hotel") || q.includes("alojamiento") || q.includes("dormir")) respuesta = "Revisa la sección de Alojamiento en el mapa para ver opciones de hospedaje en Arica.";
      else if (q.includes("hola") || q.includes("hi") || q.includes("hello")) respuesta = "¡Hola! Bienvenido a Arica 🌸 ¿Qué te gustaría hacer hoy? Puedo recomendarte playas, museos, restaurantes o servicios.";

      setMessages(prev => [...prev, { text: respuesta, isBot: true }]);
      setIsTyping(false);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(respuesta);
        utterance.lang = 'es-CL';
        window.speechSynthesis.speak(utterance);
      }
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="bg-surface-900 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col h-[600px] max-h-[85vh] border border-white/50 relative"
      >
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-gray-100 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-md">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 leading-tight">{t('assistant.title')}</h3>
              <p className="text-xs text-brand-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t('assistant.online')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5 bg-gradient-to-b from-gray-50 to-surface-900">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 max-w-[85%] ${m.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {m.isBot && (
                  <div className="w-8 h-8 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm mt-auto mb-1">
                    <Bot size={16} className="text-brand-500" />
                  </div>
                )}
                <div
                  className={`p-4 text-[15px] leading-relaxed shadow-sm ${
                    m.isBot
                      ? 'bg-white border border-gray-100 text-gray-800 rounded-3xl rounded-bl-sm'
                      : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-3xl rounded-br-sm'
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="self-start flex gap-3 max-w-[85%]"
              >
                <div className="w-8 h-8 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm mt-auto mb-1">
                  <Bot size={16} className="text-brand-500" />
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-bl-sm flex items-center gap-1 shadow-sm h-12">
                  <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                  <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 pb-safe">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1.5 pr-2 shadow-inner border border-gray-200 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={t('assistant.placeholder')}
              className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`p-3 rounded-full flex items-center justify-center transition-all ${
                input.trim() && !isTyping
                  ? 'bg-accent-500 hover:bg-accent-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={18} className={input.trim() && !isTyping ? "ml-1" : ""} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
