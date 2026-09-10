import { useState } from 'react';
import { Waves, Sun, ShieldAlert, Wind, Compass, ChevronRight, Droplets, Info } from 'lucide-react';
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
    type: 'Ola Tubular de Clase Mundial',
    desc: 'Fondo rocoso y olas que albergan torneos internacionales de la WSL.'
  }
];

export default function CoastalSurfWidget() {
  const [selectedBeach, setSelectedBeach] = useState(0);

  const getFlagBadge = (flag) => {
    switch (flag) {
      case 'green':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white flex items-center gap-1 shadow-xs">🟢 Bandera Verde</span>;
      case 'red':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-red-500 text-white flex items-center gap-1 shadow-xs">🔴 Bandera Roja</span>;
      case 'black':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-950 text-amber-300 border border-amber-400/40 flex items-center gap-1 shadow-xs">⚠️ Solo Expertos</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500 text-white flex items-center gap-1 shadow-xs">🟡 Precaución</span>;
    }
  };

  const current = BEACHES[selectedBeach];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 my-10">
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-sky-900/50 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-wider mb-1">
              <Waves size={16} />
              <span>Reporte Costero en Vivo · Arica Chile</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Estado de Playas, Mareas y Surf
            </h3>
          </div>

          {/* Quick weather pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2 font-bold">
              <Sun size={16} className="text-amber-400" />
              <span>23°C · Eterna Primavera</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2 font-bold text-amber-300">
              <ShieldAlert size={16} className="text-amber-400" />
              <span>Índice UV 8 (Muy Alto)</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-2 font-bold text-sky-300">
              <Wind size={16} />
              <span>Viento: 14 km/h S</span>
            </div>
          </div>
        </div>

        {/* Beach Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6">
          {BEACHES.map((b, idx) => (
            <button
              key={b.name}
              onClick={() => setSelectedBeach(idx)}
              className={`text-left p-3.5 rounded-2xl transition-all border ${
                selectedBeach === idx
                  ? 'bg-white text-slate-900 border-white shadow-lg scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
              }`}
            >
              <p className={`text-xs font-extrabold truncate ${selectedBeach === idx ? 'text-slate-900' : 'text-white'}`}>
                {b.name}
              </p>
              <p className={`text-[11px] font-semibold truncate ${selectedBeach === idx ? 'text-sky-700' : 'text-slate-400'}`}>
                {b.type}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Beach Details Card */}
        <div className="mt-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-lg sm:text-xl font-black text-white">{current.name}</h4>
              {getFlagBadge(current.flag)}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {current.desc}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Oleaje</span>
              <span className="text-xl sm:text-2xl font-black text-sky-400">{current.waves}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Agua</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{current.temp}</span>
            </div>
            <a
              href="/#mapa"
              className="px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 hover:scale-105"
            >
              <span>Ver Playa</span>
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
