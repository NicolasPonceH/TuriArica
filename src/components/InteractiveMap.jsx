import { useState, useMemo, useRef, useEffect } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function InteractiveMap({ places, activeCategory, routeCoords, routeColor, userLocation }) {
  const filteredPlaces = activeCategory === 'Todos' ? places : places.filter(p => p.category === activeCategory);
  
  const mapRef = useRef(null);
  const [popupInfo, setPopupInfo] = useState(null);

  useEffect(() => {
    if (routeCoords && routeCoords.length > 0 && mapRef.current) {
      // Calculate bounds for [lng, lat] coordinates
      const bounds = routeCoords.reduce(
        (acc, coord) => [
          [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])], // [minLng, minLat]
          [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])]  // [maxLng, maxLat]
        ],
        [[Infinity, Infinity], [-Infinity, -Infinity]]
      );
      
      mapRef.current.fitBounds(bounds, {
        padding: 80,
        duration: 2000
      });
    }
  }, [routeCoords]);

  const geojson = useMemo(() => {
    if (!routeCoords || routeCoords.length === 0) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeCoords // Must be [lng, lat]
      }
    };
  }, [routeCoords]);

  return (
    <div className="h-[80vh] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 relative z-10">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -70.3126,
          latitude: -18.4783,
          zoom: 12,
          pitch: 50, // Añade perspectiva 3D
          bearing: -10 // Rota ligeramente para más dinamismo
        }}
        mapStyle={{
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors, © CARTO'
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 20
            }
          ]
        }}
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['route-line']}
      >
        <NavigationControl position="bottom-right" />

        {filteredPlaces.map(place => (
          <Marker
            key={place.id}
            longitude={place.lng}
            latitude={place.lat}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(place);
            }}
          >
            <div 
              className="w-10 h-10 rounded-full border-[3px] border-white shadow-[0_4px_15px_rgba(0,0,0,0.4)] hover:scale-125 transition-transform cursor-pointer flex items-center justify-center relative group"
              style={{ backgroundColor: place.color }}
            >
              <div className="absolute -bottom-1.5 w-2 h-2 rounded-full border border-gray-300 shadow-sm bg-white" />
            </div>
          </Marker>
        ))}

        {userLocation && (
          <Marker longitude={userLocation[0]} latitude={userLocation[1]} anchor="bottom">
            <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </Marker>
        )}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="rounded-2xl shadow-xl overflow-hidden"
            offset={15}
          >
            <div className="px-4 py-3 text-center min-w-[150px]">
              <h4 className="font-extrabold text-gray-900 text-lg leading-tight mb-1">{popupInfo.name}</h4>
              <p className="text-xs font-bold text-accent-500 uppercase tracking-widest">{popupInfo.category}</p>
            </div>
          </Popup>
        )}

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
                'line-width': 14,
                'line-opacity': 0.7
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
                'line-width': 8
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
