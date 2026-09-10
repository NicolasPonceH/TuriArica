import { useState } from 'react';
import { Waves, Sun, ShieldAlert, Wind, ChevronRight, Compass, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BEACHES = [
  {
    name: 'Playa El Laucho',
    status: 'Apta para Baño',
    flag: 'green',
    waves: '0.5 m',
    temp: '19°C',
    type: 'Familiar & Natación',
    desc: 'Piscina natural de aguas calmas y templadas con rampas de accesibilidad universal.'
  },
  {
    name: 'Playa Chinchorro',
    status: 'Apta para Baño',
    flag: 'green',
    waves: '0.8 m',
    temp: '20°C',
    type: 'Aguas Cálidas',
    desc: 'Extensa costanera con oleaje moderado y variada gastronomía frente al mar.'
  },
  {
    name: 'Playa Las Machas',
    status: 'No Apta para Baño',
    flag: 'red',
    waves: '1.6 m',
    temp: '18°C',
    type: 'Surf & Bodyboard',
    desc: 'Corrientes oceánicas fuertes, arena oscura y el paraíso para surfistas locales.'
  },
  {
    name: 'Ex Isla Alacrán (El Gringo)',
    status: 'Solo Surfistas Expertos',
    flag: 'black',
    waves: '2.2 m',
    temp: '17°C',
    type: 'Ola Tubular de Nivel Mundial',
    desc: 'Fondo rocoso con olas tubulares peligrosas que albergan campeonatos mundiales WSL.'
  }
];

export default function CoastalSurfWidget({ onSelectBeach }) {
  const [selectedBeach, setSelectedBeach] = useState(0);

  const getFlagBadge = (flag) => {
    switch (flag) {
      case 'green':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Bandera Verde · Apta para Baño</span>
          </span>
        );
      case 'red':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Bandera Roja · Peligro de Marejadas</span>
          </span>
        );
      case 'black':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Solo Surfistas Experimentados</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <span>Precaución</span>
          </span>
        );
    }
  };

  const current = BEACHES[selectedBeach];

  const handleViewOnMap = () => {
    if (onSelectBeach) {
      onSelectBeach(current.name);
    } else {
      document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 text-slate-800 relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-brand-600 text-xs font-black uppercase tracking-wider mb-1">
            <Waves size={16} />
            <span>Condición Costera y Marítima en Tiempo Real</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Playas, Mareas y Surf en Arica
          </h3>
        </div>

        {/* Live weather pills in light palette */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-amber-50 text-amber-900 border border-amber-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold shadow-2xs">
            <Sun size={16} className="text-amber-500" />
            <span>23°C · Eterna Primavera</span>
          </div>

          <div className="bg-orange-50 text-orange-900 border border-orange-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold shadow-2xs">
            <ShieldAlert size={16} className="text-orange-500" />
            <span>Índice UV 8 (Muy Alto)</span>
          </div>

          <div className="bg-sky-50 text-sky-900 border border-sky-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 font-bold shadow-2xs">
            <Wind size={16} className="text-sky-500" />
            <span>Viento: 14 km/h S</span>
          </div>
        </div>
      </div>

      {/* Beach Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6">
        {BEACHES.map((b, idx) => {
          const isSelected = selectedBeach === idx;
          return (
            <button
              key={b.name}
              onClick={() => setSelectedBeach(idx)}
              className={`text-left p-4 rounded-2xl transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/25 scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {b.name}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${b.flag === 'green' ? (isSelected ? 'bg-white' : 'bg-emerald-500') : b.flag === 'red' ? 'bg-red-500' : 'bg-amber-500'}`} />
              </div>
              <p className={`text-[11px] font-semibold truncate ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                {b.type}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Beach Details Card */}
      <div className="mt-5 bg-gradient-to-br from-sky-50/50 via-slate-50 to-white rounded-2xl p-5 sm:p-6 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-inner">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className="text-xl font-black text-slate-900">{current.name}</h4>
            {getFlagBadge(current.flag)}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {current.desc}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-black">Oleaje</span>
            <span className="text-2xl font-black text-brand-600">{current.waves}</span>
          </div>
          <div className="text-center px-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-black">Agua</span>
            <span className="text-2xl font-black text-emerald-600">{current.temp}</span>
          </div>
          <button
            onClick={handleViewOnMap}
            className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Ver en Mapa</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
