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

  // 2. Render Markers for Places
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

      el.innerHTML = `
        <div style="
          width: 38px;
          height: 38px;
          background-color: ${place.color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: ${isSelected ? '0 0 25px rgba(14,165,233,0.9), 0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.3)'};
          transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6v6"></path>
            <path d="M15 6v6"></path>
            <path d="M2 12h19.6"></path>
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
            <circle cx="7" cy="18" r="2"></circle>
            <path d="M9 18h5"></path>
            <circle cx="16" cy="18" r="2"></circle>
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
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
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
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-3"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: selectedPlace.color }} />
                  <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
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
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-brand-600 font-bold text-xs flex items-center gap-1"
                    title="Expandir información"
                  >
                    <LucideIcons.Maximize2 size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlace(null);
                      if (onClearRoute) onClearRoute();
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
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
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3.5 sm:p-5 overflow-hidden max-h-[62vh] sm:max-h-[75vh] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300 mb-1">
                      {selectedPlace.category}
                    </span>
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-lg leading-snug">
                      {selectedPlace.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setIsMinimized(true)}
                      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
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
                      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      aria-label="Cerrar panel"
                    >
                      <LucideIcons.X size={16} />
                    </button>
                  </div>
                </div>

                {/* Locomotion Section */}
                <div className="bg-brand-50/70 dark:bg-gray-800/80 rounded-xl p-3 sm:p-3.5 border border-brand-100 dark:border-gray-700 mb-2.5 sm:mb-3 space-y-1.5 sm:space-y-2 overflow-y-auto max-h-[26vh] sm:max-h-[38vh]">
                  <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 font-bold text-xs uppercase tracking-wider">
                    <LucideIcons.Bus size={16} />
                    <span>Locomoción Colectiva</span>
                  </div>

                  {/* Líneas de micro */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Micros:</span>
                    {selectedPlace.transport?.lineas?.map((line, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-0.5 rounded-md text-xs font-black bg-accent-500 text-white shadow-sm"
                      >
                        {line}
                      </span>
                    )) || <span className="text-xs text-gray-400">Sin micro directa</span>}
                  </div>

                  {/* Letrero */}
                  {selectedPlace.transport?.letrero && (
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Letrero:</strong> {selectedPlace.transport.letrero}
                    </p>
                  )}

                  {/* Parada */}
                  {selectedPlace.transport?.parada && (
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      <strong className="text-gray-900 dark:text-white">Bajar en:</strong> {selectedPlace.transport.parada}
                    </p>
                  )}

                  {/* Indicaciones directas */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 border-t border-brand-100/50 dark:border-gray-700/50 pt-2 italic">
                    {selectedPlace.directions}
                  </p>
                </div>

                {/* Route distance & time info if active */}
                {routeInfo && (
                  <div className="bg-gradient-to-r from-cyan-500/10 via-brand-500/10 to-teal-500/10 border-2 border-brand-500/40 rounded-xl p-2.5 mb-3 flex items-center justify-around text-center shadow-sm">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Distancia</div>
                      <div className="text-sm font-black text-brand-600 dark:text-brand-400">{routeInfo.distanceKm} km</div>
                    </div>
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Tiempo Aprox.</div>
                      <div className="text-sm font-black text-brand-600 dark:text-brand-400">~{routeInfo.timeMin} min</div>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => onRouteClick && onRouteClick(selectedPlace)}
                    className="flex-1 py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <LucideIcons.Navigation size={14} />
                    {routeCoords && routeCoords.length > 0 ? 'Recalcular Ruta' : 'Trazar Ruta'}
                  </button>

                  {onAudioClick && (
                    <button
                      onClick={() => onAudioClick(selectedPlace)}
                      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      title="Escuchar audio"
                      aria-label="Escuchar audio"
                    >
                      <LucideIcons.Volume2 size={16} />
                    </button>
                  )}

                  {routeCoords && routeCoords.length > 0 && onClearRoute && (
                    <button
                      onClick={onClearRoute}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 transition-colors"
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
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3.5 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                <LucideIcons.Bus className="text-accent-500" size={16} />
                <span>¿A dónde quieres ir en Arica?</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                Toca cualquier marcador del mapa o selecciona un lugar abajo para ver qué micro tomar y trazar la ruta:
              </p>
              <select 
                onChange={(e) => {
                  const place = places.find(p => p.id === Number(e.target.value));
                  if (place) setSelectedPlace(place);
                }}
                defaultValue=""
                className="w-full text-xs font-medium bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
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
