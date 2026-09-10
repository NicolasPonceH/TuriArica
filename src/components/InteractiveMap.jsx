import { useState, useMemo, useRef, useEffect } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  const mapRef = useRef(null);
  const [popupHover, setPopupHover] = useState(null);

  useEffect(() => {
    if (routeCoords && routeCoords.length > 0 && mapRef.current) {
      // Calculate bounds for [lng, lat] coordinates
      const bounds = routeCoords.reduce(
        (acc, coord) => [
          [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
          [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])]
        ],
        [[Infinity, Infinity], [-Infinity, -Infinity]]
      );
      
      mapRef.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 80, left: 80, right: 80 },
        duration: 2000
      });
    }
  }, [routeCoords]);

  // Center on selected place when chosen
  useEffect(() => {
    if (selectedPlace && mapRef.current && (!routeCoords || routeCoords.length === 0)) {
      mapRef.current.flyTo({
        center: [selectedPlace.lng, selectedPlace.lat],
        zoom: 14,
        duration: 1500
      });
    }
  }, [selectedPlace, routeCoords]);

  const geojson = useMemo(() => {
    if (!routeCoords || routeCoords.length === 0) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeCoords
      }
    };
  }, [routeCoords]);

  return (
    <div className="h-[80vh] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 relative z-10">
      {/* Floating Locomotion & Info Panel */}
      <div className="absolute top-4 left-4 z-20 max-w-sm w-[92%] sm:w-84 pointer-events-auto">
        <AnimatePresence mode="wait">
          {selectedPlace ? (
            <motion.div 
              key={selectedPlace.id}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 overflow-hidden"
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
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label="Cerrar panel"
                >
                  <LucideIcons.X size={18} />
                </button>
              </div>

              {/* Locomotion Section */}
              <div className="bg-brand-50/70 dark:bg-gray-800/80 rounded-xl p-3.5 border border-brand-100 dark:border-gray-700 mb-3 space-y-2">
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
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-2.5 mb-3 flex items-center justify-around text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Distancia</div>
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{routeInfo.distanceKm} km</div>
                  </div>
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">Tiempo Aprox.</div>
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">~{routeInfo.timeMin} min</div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
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

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -70.3126,
          latitude: -18.4783,
          zoom: 12.5,
          pitch: 45,
          bearing: -10
        }}
        mapStyle={{
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
            }
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />

        {/* Marcadores de Lugares */}
        {filteredPlaces.map(place => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <Marker
              key={place.id}
              longitude={place.lng}
              latitude={place.lat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedPlace(place);
              }}
            >
              <div 
                className={`relative group cursor-pointer transition-all duration-300 flex items-center justify-center ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
                }`}
                onMouseEnter={() => setPopupHover(place)}
                onMouseLeave={() => setPopupHover(null)}
              >
                <div 
                  className={`w-10 h-10 rounded-full border-[3px] shadow-[0_4px_18px_rgba(0,0,0,0.35)] flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'border-white ring-4 ring-accent-400 ring-offset-2 scale-110' 
                      : 'border-white group-hover:border-accent-200'
                  }`}
                  style={{ backgroundColor: place.color }}
                >
                  <LucideIcons.Bus size={16} className="text-white drop-shadow" />
                </div>
                <div className="absolute -bottom-1.5 w-2.5 h-2.5 rounded-full border border-gray-400 shadow-sm bg-white" />
              </div>
            </Marker>
          );
        })}

        {/* Ubicación del Usuario */}
        {userLocation && (
          <Marker longitude={userLocation[0]} latitude={userLocation[1]} anchor="center">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-ping absolute inset-0 opacity-75" />
              <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md relative z-10 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </Marker>
        )}

        {/* Hover Tooltip rápido */}
        {popupHover && !selectedPlace && (
          <Popup
            anchor="top"
            longitude={popupHover.lng}
            latitude={popupHover.lat}
            closeButton={false}
            className="rounded-xl shadow-lg pointer-events-none"
            offset={15}
          >
            <div className="px-3 py-1.5 text-center min-w-[120px]">
              <h4 className="font-bold text-gray-900 text-xs leading-tight">{popupHover.name}</h4>
              <p className="text-[10px] text-accent-600 font-semibold">Toca para ver micros y ruta</p>
            </div>
          </Popup>
        )}

        {/* Capas GeoJSON de la Ruta */}
        {geojson && (
          <Source id="route" type="geojson" data={geojson}>
            <Layer
              id="route-line-backdrop"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': '#ffffff',
                'line-width': 12,
                'line-opacity': 0.85
              }}
            />
            <Layer
              id="route-line"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': routeColor || '#0ea5e9',
                'line-width': 7
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}

