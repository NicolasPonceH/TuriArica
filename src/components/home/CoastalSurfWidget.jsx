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
    desc: 'Piscina natural con aguas calmas y rampas de accesibilidad universal.'
  },
  {
    name: 'Playa Chinchorro',
    status: 'Apta para Baño',
    flag: 'green',
    waves: '0.8 m',
    temp: '20°C',
    type: 'Aguas Cálidas',
    desc: 'Amplia costanera con oleaje moderado y restaurantes frente al mar.'
  },
  {
    name: 'Playa Las Machas',
    status: 'No Apta para Baño',
    flag: 'red',
    waves: '1.6 m',
    temp: '18°C',
    type: 'Surf & Bodyboard',
    desc: 'Corrientes fuertes, arena extensa y paraíso del surf nortino.'
  },
  {
    name: 'Ex Isla Alacrán (El Gringo)',
    status: 'Solo Surfistas Expertos',
    flag: 'black',
    waves: '2.2 m',
    temp: '17°C',
    type: 'Ola Tubular Mundial',
    desc: 'Fondo rocoso y olas que albergan torneos internacionales de la WSL.'
  }
];

export default function CoastalSurfWidget({ onSelectBeach }) {
  const [selectedBeach, setSelectedBeach] = useState(0);

  const getFlagBadge = (flag) => {
    switch (flag) {
      case 'green':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Bandera Verde · Apta para Baño</span>
          </span>
        );
      case 'red':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Bandera Roja · Peligro Marejadas</span>
          </span>
        );
      case 'black':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Solo Surfistas Expertos</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-xs">
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
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-wider mb-1">
            <Waves size={16} />
            <span>Condición Costera y Marítima en Tiempo Real</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Playas, Mareas y Surf en Arica
          </h3>
        </div>

        {/* Live weather pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 flex items-center gap-2 font-bold text-white shadow-xs">
            <Sun size={16} className="text-amber-400" />
            <span>23°C · Eterna Primavera</span>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 flex items-center gap-2 font-bold text-amber-300 shadow-xs">
            <ShieldAlert size={16} className="text-amber-400" />
            <span>Índice UV 8 (Muy Alto)</span>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 flex items-center gap-2 font-bold text-sky-300 shadow-xs">
            <Wind size={16} />
            <span>Viento: 14 km/h S</span>
          </div>
        </div>
      </div>

      {/* Beach Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6">
        {BEACHES.map((b, idx) => {
          const isSelected = selectedBeach === idx;
          return (
            <button
              key={b.name}
              onClick={() => setSelectedBeach(idx)}
              className={`text-left p-3.5 rounded-2xl transition-all border ${
                isSelected
                  ? 'bg-slate-800 text-white border-sky-400/80 shadow-md shadow-sky-950/40 ring-2 ring-sky-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-800/60 text-slate-300 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {b.name}
                </span>
                <span className={`w-2 h-2 rounded-full ${b.flag === 'green' ? 'bg-emerald-400' : b.flag === 'red' ? 'bg-red-400' : 'bg-amber-400'}`} />
              </div>
              <p className="text-[11px] font-semibold text-slate-400 truncate">
                {b.type}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Beach Details Card */}
      <div className="mt-5 bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-inner">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className="text-lg sm:text-xl font-black text-white">{current.name}</h4>
            {getFlagBadge(current.flag)}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {current.desc}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Oleaje</span>
            <span className="text-xl sm:text-2xl font-black text-sky-400">{current.waves}</span>
          </div>
          <div className="text-center px-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Agua</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{current.temp}</span>
          </div>
          <button
            onClick={handleViewOnMap}
            className="px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Ver en Mapa</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
