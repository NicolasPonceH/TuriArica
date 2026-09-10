import { Map, MapPin, Accessibility, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto glass-panel rounded-2xl px-6 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <Mountain className="text-accent-500" />
          <span>TuriArica</span>
        </a>
        
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <li><a href="#inicio" className="hover:text-brand-600 transition-colors">Inicio</a></li>
          <li><a href="#lugares" className="hover:text-brand-600 transition-colors">Lugares</a></li>
          <li><a href="#mapa" className="hover:text-brand-600 transition-colors">Mapa</a></li>
          <li><a href="#accesibilidad" className="hover:text-brand-600 transition-colors">Accesibilidad</a></li>
        </ul>

        <div className="flex gap-4">
          <button className="p-2 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-600 transition-colors">
            <Accessibility size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
