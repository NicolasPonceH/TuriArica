import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  Hospital,
  HeartPulse,
  Phone,
  Navigation,
  Clock,
  MapPin,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink,
  Search
} from 'lucide-react';
import { SERVER_URL } from '../../utils/constants';
import { useLanguage } from '../../contexts/LanguageContext';

// Icono vectorial nítido de Cruz Roja Médica
function RedCrossIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 2.5C9 2.22386 9.22386 2 9.5 2H14.5C14.7761 2 15 2.22386 15 2.5V9H21.5C21.7761 9 22 9.22386 22 9.5V14.5C22 14.7761 21.7761 15 21.5 15H15V21.5C15 21.7761 14.7761 22 14.5 22H9.5C9.22386 22 9 21.7761 9 21.5V15H2.5C2.22386 15 2 14.7761 2 14.5V9.5C2 9.22386 2.22386 9 2.5 9H9V2.5Z"
        fill="#EF4444"
        stroke="#DC2626"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Icono de Cruz Verde de Farmacia
function GreenCrossIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
        fill="#10B981"
        stroke="#059669"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HealthServicesWidget({ onSelectDestination }) {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('farmacias'); // 'farmacias' | 'urgencias' | 'cesfam' | 'telefonos'
  const [pharmacySearch, setPharmacySearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchHealthData() {
      try {
        const res = await fetch(`${SERVER_URL}/api/health/summary`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (isMounted && result.success) {
          setData(result);
        }
      } catch (err) {
        console.warn('Fallo al cargar datos de salud:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchHealthData();
    // Refrescar cada 10 minutos
    const interval = setInterval(fetchHealthData, 10 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const dutyPharmacy = data?.dutyPharmacy || data?.pharmaciesOnDuty?.[0] || {
    id: 'farmacia-default',
    name: 'CALIDAD TOTAL',
    address: 'AVENIDA TUCAPEL 2324',
    neighborhood: 'Arica - Periferia',
    openTime: '09:00',
    closeTime: '21:00',
    phone: '+56 58 200 0000',
    lat: -18.4770,
    lng: -70.2920,
    isOpen: true,
    statusLabel: 'Abierta de Turno hasta las 21:00'
  };

  const allPharmacies = data?.allPharmacies || [dutyPharmacy];

  const filteredPharmacies = allPharmacies.filter(p => {
    if (!pharmacySearch) return true;
    const query = pharmacySearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.address && p.address.toLowerCase().includes(query)) ||
      (p.neighborhood && p.neighborhood.toLowerCase().includes(query))
    );
  });

  const handleRouteToPlace = (item) => {
    if (!onSelectDestination) return;
    const dest = {
      id: item.id || `health-${Date.now()}`,
      name: item.name,
      category: item.category || (item.type === 'hospital' || item.type === 'sar' ? 'Salud' : 'Farmacia'),
      lat: item.lat,
      lng: item.lng,
      shortDesc: item.address,
      fullDesc: item.shortDesc || item.statusLabel || item.address,
      phone: item.phone,
      hours: item.schedule || `${item.openTime} - ${item.closeTime}`,
      transport: item.transport,
      color: item.category === 'Farmacia' ? '#16A34A' : '#DC2626'
    };
    onSelectDestination(dest);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Encabezado del Módulo con Cruz Roja de Salud */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2 shadow-xs">
            <RedCrossIcon className="w-3.5 h-3.5" />
            <span>{t('health.badge') || 'Servicios de Salud Oficiales'}</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t('health.title') || 'Salud y Farmacias de Turno'}
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {t('health.subtitle') || 'Disponibilidad en tiempo real con datos de Farmanet MINSAL y centros de urgencia de Arica.'}
          </p>
        </div>

        {data?.currentTimeChile && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs self-start md:self-auto">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Hora oficial Chile: <strong className="text-slate-800">{data.currentTimeChile}</strong></span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TARJETA DESTACADA: Farmacia de Turno Hoy con Imagen WebP Optimizada */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between border border-emerald-500/30 group"
        >
          {/* Imagen de fondo WebP optimizada de la Farmacia con iluminación nocturna */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="/images/pharmacy.webp"
              alt="Fachada moderna de farmacia con cruz luminosa"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center opacity-30 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700"
            />
            {/* Gradiente oscuro superior y lateral para contraste tipográfico perfecto */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-emerald-950/85 to-slate-950/75" />
          </div>

          <div className="relative z-10 p-6 sm:p-7">
            {/* Badges superiores con Cruz Roja y Estado */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-xs">
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center p-0.5">
                  <RedCrossIcon className="w-3 h-3" />
                </div>
                <span>{t('health.dutyPharmacy') || 'Farmacia de Turno Hoy'}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                {dutyPharmacy.isOpen ? 'Abierta Ahora' : 'De Turno Hoy'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {dutyPharmacy.name}
            </h3>

            <div className="flex items-start gap-2 text-emerald-100/90 text-sm mb-4">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-emerald-300" />
              <span>{dutyPharmacy.address}</span>
            </div>

            {/* Cápsula de horario y zona */}
            <div className="grid grid-cols-2 gap-2 text-xs py-3 px-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 mb-6">
              <div>
                <span className="text-emerald-300 block text-[11px] font-medium">Horario de Turno</span>
                <span className="font-bold text-white text-xs sm:text-sm">
                  {dutyPharmacy.openTime ? `${dutyPharmacy.openTime} a ${dutyPharmacy.closeTime}` : '24 Horas'}
                </span>
              </div>
              <div>
                <span className="text-emerald-300 block text-[11px] font-medium">Comuna / Sector</span>
                <span className="font-bold text-white text-xs sm:text-sm">{dutyPharmacy.neighborhood || 'Arica'}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción inferiores */}
          <div className="relative z-10 p-6 sm:p-7 pt-0">
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/15">
              <button
                onClick={() => handleRouteToPlace(dutyPharmacy)}
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs sm:text-sm active:scale-98 transition shadow-lg cursor-pointer border border-emerald-300/30"
              >
                <Navigation className="w-4 h-4" />
                {t('health.seeRoute') || 'Cómo llegar'}
              </button>

              {dutyPharmacy.phone && (
                <a
                  href={`tel:${dutyPharmacy.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs sm:text-sm active:scale-98 transition cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  {t('health.callEmergency') || 'Llamar'}
                </a>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-emerald-200/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>{t('health.sourceMinsal') || 'Ministerio de Salud (Farmanet)'}</span>
              </div>
              <span className="text-emerald-300 font-semibold">Región de Arica</span>
            </div>
          </div>
        </motion.div>

        {/* PANEL CON PESTAÑAS: FARMACIAS DE ARICA, URGENCIAS, CESFAM Y TELÉFONOS */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Pestañas con selector interactivo */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 self-start text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('farmacias')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'farmacias'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              <span>Farmacias ({allPharmacies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('urgencias')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'urgencias'
                  ? 'bg-white text-rose-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <RedCrossIcon className="w-3.5 h-3.5" />
              <span>Urgencias 24h & SAPU</span>
            </button>

            <button
              onClick={() => setActiveTab('cesfam')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'cesfam'
                  ? 'bg-white text-sky-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-sky-600" />
              <span>CESFAM</span>
            </button>

            <button
              onClick={() => setActiveTab('telefonos')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'telefonos'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-slate-700" />
              <span>Fonos SOS</span>
            </button>
          </div>

          {/* Contenido dinámico con scroll controlado */}
          <div className="min-h-[360px] max-h-[460px] overflow-y-auto bg-white/85 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
            <AnimatePresence mode="wait">
              {/* TAB 1: TODAS LAS FARMACIAS DE ARICA */}
              {activeTab === 'farmacias' && (
                <motion.div
                  key="tab-farmacias"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {/* Buscador de farmacias */}
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar farmacia (Cruz Verde, Ahumada, Salcobrand, 21 de Mayo)..."
                      value={pharmacySearch}
                      onChange={(e) => setPharmacySearch(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                  </div>

                  {filteredPharmacies.map((farm) => (
                    <div
                      key={farm.id}
                      className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        farm.isTurno
                          ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {farm.isTurno ? (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              De Turno Hoy
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${farm.statusClass}`}>
                              {farm.badgeText || (farm.isOpen ? 'Abierta' : 'Cerrada')}
                            </span>
                          )}

                          {farm.brand && (
                            <span className="text-xs text-slate-400 font-medium">
                              {farm.brand}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <GreenCrossIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{farm.name}</span>
                        </h4>

                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{farm.address} {farm.neighborhood ? `(${farm.neighborhood})` : ''}</span>
                        </p>

                        <p className="text-[11px] text-slate-600 font-medium mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{farm.schedule || `Horario: ${farm.openTime} a ${farm.closeTime}`}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {farm.phone && (
                          <a
                            href={`tel:${farm.phone.replace(/[^0-9+]/g, '')}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Llamar a farmacia"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => handleRouteToPlace(farm)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-emerald-200"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Ruta
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredPharmacies.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No se encontraron farmacias con ese término de búsqueda.
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: URGENCIAS 24H Y SAPU */}
              {activeTab === 'urgencias' && (
                <motion.div
                  key="tab-urgencias"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {(data?.allCenters?.filter(c => c.is24h || c.type === 'sapu') || []).map(center => (
                    <div
                      key={center.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${center.statusClass}`}>
                            {center.badgeText || (center.isOpen ? 'Abierto' : 'Cerrado')}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {center.type === 'hospital' ? 'Hospital Regional' : center.type === 'sar' ? 'SAR (Alta Resolutividad)' : 'SAPU'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <RedCrossIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{center.name}</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{center.address}</p>
                        <p className="text-[11px] text-slate-600 font-medium mt-1">
                          ⏱ {center.schedule}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {center.phone && (
                          <a
                            href={`tel:${center.phone.replace(/[^0-9+]/g, '')}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Llamar"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleRouteToPlace(center)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-rose-200"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Ruta
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* TAB 3: CESFAMS */}
              {activeTab === 'cesfam' && (
                <motion.div
                  key="tab-cesfam"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {(data?.allCenters?.filter(c => c.type === 'cesfam') || []).map(center => (
                    <div
                      key={center.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${center.statusClass}`}>
                            {center.badgeText || (center.isOpen ? 'Abierto' : 'Cerrado')}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Atención Primaria</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <HeartPulse className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{center.name}</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{center.address}</p>
                        <p className="text-[11px] text-slate-600 font-medium mt-1">
                          ⏱ {center.schedule}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {center.phone && (
                          <a
                            href={`tel:${center.phone.replace(/[^0-9+]/g, '')}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Llamar"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleRouteToPlace(center)}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-sky-200"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Ruta
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* TAB 4: TELÉFONOS DE EMERGENCIA */}
              {activeTab === 'telefonos' && (
                <motion.div
                  key="tab-telefonos"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {(data?.emergencyNumbers || [
                    { label: 'Ambulancia SAMU', number: '131', desc: 'Emergencias vitales' },
                    { label: 'Urgencia Hospital Juan Noé', number: '+56 58 220 4000', desc: 'Atención 24 Horas' },
                    { label: 'SAR Iris Véliz (Las Torres)', number: '+56 58 238 6800', desc: 'Urgencias 24 Horas' },
                    { label: 'Carabineros de Chile', number: '133', desc: 'Seguridad y auxilio' },
                    { label: 'Bomberos de Arica', number: '132', desc: 'Rescate y accidentes' }
                  ]).map((item, idx) => (
                    <a
                      key={idx}
                      href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                      className="p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-rose-300 hover:bg-rose-50/40 transition flex items-center justify-between group shadow-2xs cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-semibold text-slate-700 block">{item.label}</span>
                        <span className="text-lg font-black text-rose-600 tracking-tight group-hover:scale-105 transition transform origin-left inline-block">
                          {item.number}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{item.desc}</span>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
                        <Phone className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
