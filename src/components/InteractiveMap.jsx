import { useState, useRef, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAP_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    },
    'route': {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    }
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    },
    {
      id: 'route-casing',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#020617',
        'line-width': 11,
        'line-opacity': 0.95
      }
    },
    {
      id: 'route-core',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#0284c7',
        'line-width': 7,
        'line-opacity': 1
      }
    },
    {
      id: 'route-dash',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: {
        'line-color': '#ffffff',
        'line-width': 2.5,
        'line-dasharray': [1, 2.5],
        'line-opacity': 0.95
      }
    }
  ]
};

function getMarkerIconSvg(iconName, category) {
  const stroke = 'stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  
  switch (iconName) {
    case 'Mountain': // El Morro de Arica (Histórico)
      return `<path ${stroke} d="m8 3 4 8 5-5 5 15H2L8 3z"></path>`;

    case 'Church': // Iglesia San Marcos (Histórico)
      return `
        <path ${stroke} d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"></path>
        <path ${stroke} d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"></path>
        <path ${stroke} d="M18 22V5l-6-3-6 3v17"></path>
        <path ${stroke} d="M12 7v5"></path>
        <path ${stroke} d="M10 9h4"></path>
      `;

    case 'Umbrella': // Playa El Laucho (Playa)
      return `
        <path ${stroke} d="M22 12a10.06 10.06 0 0 0-20 0Z"></path>
        <path ${stroke} d="M12 12v8a2 2 0 0 0 4 0"></path>
        <path ${stroke} d="M12 2v1"></path>
      `;

    case 'Waves': // Playa Chinchorro, Playa Las Machas (Playa)
      return `
        <path ${stroke} d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
        <path ${stroke} d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
        <path ${stroke} d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
      `;

    case 'Landmark': // Museo Colón 10 (Museo)
      return `
        <line ${stroke} x1="3" x2="21" y1="22" y2="22"></line>
        <line ${stroke} x1="6" x2="6" y1="18" y2="11"></line>
        <line ${stroke} x1="10" x2="10" y1="18" y2="11"></line>
        <line ${stroke} x1="14" x2="14" y1="18" y2="11"></line>
        <line ${stroke} x1="18" x2="18" y1="18" y2="11"></line>
        <polygon ${stroke} points="12 2 20 7 4 7"></polygon>
      `;

    case 'Bird': // Humedal Río Lluta (Naturaleza)
      return `
        <path ${stroke} d="M16 7h.01"></path>
        <path ${stroke} d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 18Z"></path>
        <path ${stroke} d="m20 7 2 .5-2 .5"></path>
        <path ${stroke} d="M10 18v3"></path>
        <path ${stroke} d="M14 17.75V21"></path>
        <path ${stroke} d="M7 18a6 6 0 0 0 3.84-10.61"></path>
      `;

    case 'Compass': // Cuevas de Anzota (Naturaleza), Ex Isla Alacrán (Histórico)
      return `
        <circle ${stroke} cx="12" cy="12" r="10"></circle>
        <polygon ${stroke} points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      `;

    case 'Anchor': // Museo del Mar (Museo)
      return `
        <circle ${stroke} cx="12" cy="5" r="3"></circle>
        <line ${stroke} x1="12" x2="12" y1="22" y2="8"></line>
        <path ${stroke} d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
      `;

    case 'Utensils': // Terminal Agropecuario (Gastronomía)
      return `
        <path ${stroke} d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"></path>
        <path ${stroke} d="M15 2v10"></path>
        <path ${stroke} d="M15 12v10"></path>
        <path ${stroke} d="M6 2v20"></path>
        <path ${stroke} d="M9 2v4a3 3 0 0 1-3 3"></path>
      `;

    case 'Trophy': // Estadio Carlos Dittborn (Deporte)
      return `
        <path ${stroke} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path ${stroke} d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path ${stroke} d="M4 22h16"></path>
        <path ${stroke} d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path ${stroke} d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path ${stroke} d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
      `;

    case 'ShoppingBag': // Paseo 21 de Mayo (Paseo)
      return `
        <path ${stroke} d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
        <path ${stroke} d="M3 6h18"></path>
        <path ${stroke} d="M16 10a4 4 0 0 1-8 0"></path>
      `;

    case 'Fish': // Playa La Lisera (Playa)
      return `
        <path ${stroke} d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"></path>
        <path ${stroke} d="M18 12v.5"></path>
        <path ${stroke} d="M16 17.93a9.77 9.77 0 0 1 0-11.86"></path>
        <path ${stroke} d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"></path>
        <path ${stroke} d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3"></path>
        <path ${stroke} d="M8 21c1.17-1.24 2.2-2.88 2.46-4.26"></path>
      `;

    case 'Leaf': // Naturaleza
      return `
        <path ${stroke} d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20Z"></path>
        <path ${stroke} d="m2 21 10-10"></path>
      `;

    case 'Tent': // Naturaleza / Aventura
      return `
        <path ${stroke} d="M19 20 10 4"></path>
        <path ${stroke} d="m5 20 9-16"></path>
        <path ${stroke} d="M3 20h18"></path>
        <path ${stroke} d="m12 15-3 5"></path>
        <path ${stroke} d="m12 15 3 5"></path>
      `;

    case 'Shell': // Museo
      return `
        <circle ${stroke} cx="12" cy="12" r="9"></circle>
        <path ${stroke} d="M12 3v18"></path>
        <path ${stroke} d="M12 12 3.5 8.5"></path>
        <path ${stroke} d="M12 12l8.5-3.5"></path>
      `;

    case 'Activity': // Playa / Deporte
      return `<path ${stroke} d="M22 12h-4l-3 9L9 3l-3 9H2"></path>`;

    default:
      if (category === 'Playa') return `<path ${stroke} d="M22 12a10.06 10.06 0 0 0-20 0Z"></path><path ${stroke} d="M12 12v8a2 2 0 0 0 4 0"></path>`;
      if (category === 'Histórico') return `<path ${stroke} d="m8 3 4 8 5-5 5 15H2L8 3z"></path>`;
      if (category === 'Museo') return `<line ${stroke} x1="3" x2="21" y1="22" y2="22"></line><polygon ${stroke} points="12 2 20 7 4 7"></polygon>`;
      if (category === 'Naturaleza') return `<path ${stroke} d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20Z"></path><path ${stroke} d="m2 21 10-10"></path>`;
      if (category === 'Gastronomía') return `<path ${stroke} d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"></path><path ${stroke} d="M6 2v20"></path>`;
      if (category === 'Deporte') return `<path ${stroke} d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path><path ${stroke} d="M4 22h16"></path>`;
      if (category === 'Paseo') return `<path ${stroke} d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path ${stroke} d="M3 6h18"></path>`;
      return `<circle ${stroke} cx="12" cy="12" r="8"></circle>`;
  }
}

export default function InteractiveMap({ 
  places, 
  activeCategory, 
  routeCoords, 
  routeColor, 
  userLocation,
  selectedPlace,
  setSelectedPlace,
  routeInfo,
  onRouteClick,
  onAudioClick,
  onClearRoute
}) {
  const filteredPlaces = activeCategory === 'Todos' ? places : places.filter(p => p.category === activeCategory);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [svgPath, setSvgPath] = useState('');

  // 1. Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [-70.3126, -18.4783],
      zoom: 13,
      pitch: 40,
      bearing: -10
    });

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    mapInstanceRef.current = map;
    window._debugMap = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Markers for Places with Respective Icons (Naturaleza, Histórico, Playa, etc.)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredPlaces.forEach(place => {
      const isSelected = selectedPlace?.id === place.id;
      const el = document.createElement('div');
      el.className = 'cursor-pointer group flex items-center justify-center relative transition-transform duration-300';
      el.style.width = '42px';
      el.style.height = '42px';

      const iconSvg = getMarkerIconSvg(place.icon, place.category);

      el.innerHTML = `
        <div style="
          width: 38px;
          height: 38px;
          background-color: ${place.color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: ${isSelected ? '0 0 25px rgba(14,165,233,0.9), 0 4px 15px rgba(0,0,0,0.35)' : '0 4px 15px rgba(0,0,0,0.3)'};
          transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            ${iconSvg}
          </svg>
        </div>
        <div style="
          position: absolute;
          bottom: -4px;
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          border: 1px solid #94a3b8;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        "></div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedPlace(place);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([place.lng, place.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [filteredPlaces, selectedPlace, setSelectedPlace]);

  // 3. User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userEl = document.createElement('div');
      userEl.innerHTML = `
        <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; background-color: #3b82f6; border-radius: 50%; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 20px; height: 20px; background-color: #2563eb; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(37,99,235,0.8);"></div>
        </div>
      `;
      const marker = new maplibregl.Marker({ element: userEl, anchor: 'center' })
        .setLngLat(userLocation)
        .addTo(map);
      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  // 4. Update Route Coordinates, SVG Overlay & MapLibre Source
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const projectRoute = () => {
      if (!routeCoords || routeCoords.length < 2) {
        setSvgPath('');
        return;
      }
      try {
        const points = routeCoords.map(coord => {
          const pt = map.project(coord);
          return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
        });
        setSvgPath(`M ${points.join(' L ')}`);
      } catch (e) {
        // Map projection may fail if destroyed
      }
    };

    projectRoute();

    map.on('render', projectRoute);
    map.on('move', projectRoute);
    map.on('zoom', projectRoute);
    map.on('resize', projectRoute);

    if (routeCoords && routeCoords.length > 0) {
      const src = map.getSource('route');
      if (src) {
        src.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoords
          }
        });
      }

      if (routeColor && map.getLayer('route-core')) {
        map.setPaintProperty('route-core', 'line-color', routeColor);
      }

      // Fit bounds for the entire route
      const bounds = routeCoords.reduce(
        (acc, coord) => [
          [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
          [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])]
        ],
        [[Infinity, Infinity], [-Infinity, -Infinity]]
      );

      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 640;
      map.fitBounds(bounds, {
        padding: { 
          top: 90, 
          bottom: 90, 
          left: isDesktop && !isMinimized ? 420 : 90, 
          right: 90 
        },
        maxZoom: 15.5,
        duration: 1400
      });
    } else {
      setSvgPath('');
      const src = map.getSource('route');
      if (src) {
        src.setData({
          type: 'FeatureCollection',
          features: []
        });
      }
    }

    return () => {
      map.off('render', projectRoute);
      map.off('move', projectRoute);
      map.off('zoom', projectRoute);
      map.off('resize', projectRoute);
    };
  }, [routeCoords, routeColor, isMinimized]);

  // 5. Center on Selected Place if no route active
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace || (routeCoords && routeCoords.length > 0)) return;

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 640;
    map.flyTo({
      center: [selectedPlace.lng, selectedPlace.lat],
      zoom: 14.5,
      offset: isDesktop && !isMinimized ? [-120, 0] : [0, 0],
      duration: 1200
    });
  }, [selectedPlace, routeCoords, isMinimized]);

  return (
    <div className="h-[72vh] sm:h-[80vh] min-h-[480px] w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 relative z-10">
      {/* Floating Locomotion & Info Panel */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-20 sm:max-w-sm sm:w-84 pointer-events-auto">
        <AnimatePresence mode="wait">
          {selectedPlace ? (
            isMinimized ? (
              <motion.div
                key="minimized"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-3 text-slate-900 ring-1 ring-black/5"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {selectedPlace.image && (
                    <img 
                      src={selectedPlace.image} 
                      alt="" 
                      className="w-6 h-6 rounded-md object-cover shrink-0 border border-slate-200 shadow-xs" 
                    />
                  )}
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {selectedPlace.name}
                  </span>
                  {routeInfo && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                      {routeInfo.distanceKm} km
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-brand-600 font-bold text-xs flex items-center gap-1 transition-colors"
                    title="Expandir información"
                  >
                    <LucideIcons.Maximize2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlace(null);
                      if (onClearRoute) onClearRoute();
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    title="Cerrar"
                  >
                    <LucideIcons.X size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="expanded"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 sm:p-5 overflow-hidden max-h-[62vh] sm:max-h-[75vh] flex flex-col text-slate-900 ring-1 ring-black/5"
              >
                {/* Header with Photo Thumbnail */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {selectedPlace.image && (
                      <img 
                        src={selectedPlace.image} 
                        alt={selectedPlace.name} 
                        className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-200 shrink-0" 
                      />
                    )}
                    <div className="overflow-hidden">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200/80 mb-0.5">
                        {selectedPlace.category}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate">
                        {selectedPlace.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => setIsMinimized(true)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label="Minimizar panel"
                      title="Minimizar para ver mapa completo"
                    >
                      <LucideIcons.Minimize2 size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedPlace(null);
                        if (onClearRoute) onClearRoute();
                      }}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label="Cerrar panel"
                    >
                      <LucideIcons.X size={16} />
                    </button>
                  </div>
                </div>

                {/* Locomotion Section */}
                <div className="bg-sky-50/90 rounded-xl p-3 sm:p-3.5 border border-sky-100 mb-2.5 sm:mb-3 space-y-2 overflow-y-auto max-h-[26vh] sm:max-h-[38vh]">
                  <div className="flex items-center gap-2 text-sky-800 font-extrabold text-xs uppercase tracking-wider">
                    <LucideIcons.Bus size={16} className="text-sky-600" />
                    <span>Locomoción Colectiva</span>
                  </div>

                  {/* Líneas de micro */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-slate-700 font-bold">Micros:</span>
                    {selectedPlace.transport?.lineas?.map((line, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-0.5 rounded-md text-xs font-black bg-accent-500 text-white shadow-xs"
                      >
                        {line}
                      </span>
                    )) || <span className="text-xs text-slate-400">Sin micro directa</span>}
                  </div>

                  {/* Letrero */}
                  {selectedPlace.transport?.letrero && (
                    <p className="text-xs text-slate-700 leading-snug">
                      <strong className="text-slate-900 font-bold">Letrero:</strong> {selectedPlace.transport.letrero}
                    </p>
                  )}

                  {/* Parada */}
                  {selectedPlace.transport?.parada && (
                    <p className="text-xs text-slate-700 leading-snug">
                      <strong className="text-slate-900 font-bold">Bajar en:</strong> {selectedPlace.transport.parada}
                    </p>
                  )}

                  {/* Indicaciones directas */}
                  <p className="text-xs text-slate-600 border-t border-sky-200/60 pt-2 italic leading-relaxed">
                    {selectedPlace.directions}
                  </p>
                </div>

                {/* Route distance & time info if active */}
                {routeInfo && (
                  <div className="bg-gradient-to-r from-sky-50 via-cyan-50 to-emerald-50 border-2 border-sky-300/80 rounded-xl p-2.5 mb-3 flex items-center justify-around text-center shadow-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Distancia</div>
                      <div className="text-sm font-black text-sky-700">{routeInfo.distanceKm} km</div>
                    </div>
                    <div className="h-6 w-px bg-sky-200" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Tiempo Aprox.</div>
                      <div className="text-sm font-black text-sky-700">~{routeInfo.timeMin} min</div>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => onRouteClick && onRouteClick(selectedPlace)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <LucideIcons.Navigation size={14} />
                    {routeCoords && routeCoords.length > 0 ? 'Recalcular Ruta' : 'Trazar Ruta'}
                  </button>

                  {onAudioClick && (
                    <button
                      onClick={() => onAudioClick(selectedPlace)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                      title="Escuchar audio"
                      aria-label="Escuchar audio"
                    >
                      <LucideIcons.Volume2 size={16} />
                    </button>
                  )}

                  {routeCoords && routeCoords.length > 0 && onClearRoute && (
                    <button
                      onClick={onClearRoute}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                      title="Quitar trazado de ruta"
                      aria-label="Quitar trazado de ruta"
                    >
                      <LucideIcons.Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-3.5 space-y-2 text-slate-900 ring-1 ring-black/5"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <LucideIcons.Bus className="text-accent-500" size={16} />
                <span>¿A dónde quieres ir en Arica?</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Toca cualquier marcador del mapa o selecciona un lugar abajo para ver qué micro tomar y trazar la ruta:
              </p>
              <select 
                onChange={(e) => {
                  const place = places.find(p => p.id === Number(e.target.value));
                  if (place) setSelectedPlace(place);
                }}
                defaultValue=""
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="" disabled>Selecciona un atractivo turístico...</option>
                {places.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pure Native MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* High-Precision Synchronized SVG Route Overlay (Zero WebGL clipping, custom neon glow & animated flow) */}
      {svgPath && (
        <>
          <style>{`
            @keyframes routeFlow {
              from { stroke-dashoffset: 40; }
              to { stroke-dashoffset: 0; }
            }
            .animate-route-flow {
              animation: routeFlow 1.2s linear infinite;
            }
          `}</style>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-[8]"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={routeColor || '#0284c7'} floodOpacity="0.85" />
              </filter>
            </defs>

            {/* Dark outline/casing for contrast on streets */}
            <path
              d={svgPath}
              fill="none"
              stroke="#090d16"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Vibrant Core Glow Route Line */}
            <path
              d={svgPath}
              fill="none"
              stroke={routeColor || '#0284c7'}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#routeGlow)"
            />

            {/* Flowing animated dash */}
            <path
              d={svgPath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 12"
              className="animate-route-flow"
            />
          </svg>
        </>
      )}
    </div>
  );
}
