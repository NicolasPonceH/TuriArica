import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero3D from './components/Hero3D'
import PlaceCard from './components/PlaceCard'
import InteractiveMap from './components/InteractiveMap'
import AccessibilityToolbar from './components/AccessibilityToolbar'
import AssistantModal from './components/AssistantModal'
import { places } from './data/places'
import { motion, AnimatePresence } from 'framer-motion'
import * as LucideIcons from 'lucide-react'

// Utilidad simple de zona (simplificada del original)
function obtenerZona(lat, lng) {
  if (lat > -18.47) return "norte";
  if (lat < -18.49) return "sur";
  return "centro";
}

function calculateHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [categories, setCategories] = useState([])
  const [routeCoords, setRouteCoords] = useState([])
  const [routeColor, setRouteColor] = useState('')
  const [routeInfo, setRouteInfo] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [modalPlace, setModalPlace] = useState(null)
  const [showAssistant, setShowAssistant] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null)

  useEffect(() => {
    const unique = ['Todos', ...new Set(places.map(p => p.category))]
    setCategories(unique)
  }, [])

  const handleAudioClick = (place) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    window.speechSynthesis.cancel();

    if (place.audioFile) {
      const audio = new Audio(`/${place.audioFile}`);
      audio.play().catch(() => {
        // Fallback a TTS si falla el MP3
        const utterance = new SpeechSynthesisUtterance(place.fullDesc);
        utterance.lang = 'es-CL';
        window.speechSynthesis.speak(utterance);
      });
      setCurrentAudio(audio);
    } else if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(place.fullDesc)
      utterance.lang = 'es-CL'
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleClearRoute = () => {
    setRouteCoords([])
    setRouteColor('')
    setRouteInfo(null)
  }

  const handleRouteClick = (place) => {
    setSelectedPlace(place)

    const calculateForPosition = async (lat, lng) => {
      setUserLocation([lng, lat])

      const API_KEY = "6817f243-eee4-4604-a1fa-8a73d219cbe6"
      const url = `https://graphhopper.com/api/1/route?point=${lat},${lng}&point=${place.lat},${place.lng}&vehicle=car&locale=es&instructions=false&points_encoded=false&key=${API_KEY}`

      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (data.paths && data.paths.length > 0) {
          const coords = data.paths[0].points.coordinates.map(c => [c[0], c[1]])
          setRouteCoords(coords)
          setRouteColor(place.color)
          setRouteInfo({
            distanceKm: (data.paths[0].distance / 1000).toFixed(1),
            timeMin: Math.max(1, Math.round(data.paths[0].time / 60000))
          })
          document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' })
        } else {
          throw new Error()
        }
      } catch (e) {
        setRouteCoords([[lng, lat], [place.lng, place.lat]])
        setRouteColor(place.color)
        const dist = calculateHaversine(lat, lng, place.lat, place.lng)
        setRouteInfo({
          distanceKm: dist.toFixed(1),
          timeMin: Math.max(1, Math.round((dist / 30) * 60))
        })
        document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // Calcular de inmediato desde la ubicación actual o Plaza Colón (Centro de Arica)
    const initialLat = userLocation ? userLocation[1] : -18.4783;
    const initialLng = userLocation ? userLocation[0] : -70.3126;
    calculateForPosition(initialLat, initialLng);

    // En segundo plano, si el navegador tiene GPS activo, actualizar con la ubicación precisa
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          if (Math.abs(newLat - initialLat) > 0.0005 || Math.abs(newLng - initialLng) > 0.0005) {
            calculateForPosition(newLat, newLng);
          }
        },
        () => {
          // GPS denegado o timeout: se mantiene la ruta de Plaza Colón
        },
        { timeout: 3500, maximumAge: 60000 }
      );
    }
  }

  const handleReadPage = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let texto = "Arica, ciudad de la eterna primavera. ";
      texto += `Mostrando ${filteredPlaces.length} lugares. `;
      filteredPlaces.forEach((p, i) => {
        texto += `${i + 1}: ${p.name}. `;
      });
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-CL';
      window.speechSynthesis.speak(utterance);
    }
  }

  const filteredPlaces = activeCategory === 'Todos' ? places : places.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-brand-500/30 selection:text-brand-600 transition-colors duration-300">
      <Navigation />
      <Hero3D />

      <AccessibilityToolbar 
        onAssistantClick={() => setShowAssistant(true)} 
        onReadPageClick={handleReadPage} 
      />

      {showAssistant && <AssistantModal onClose={() => setShowAssistant(false)} />}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-24" id="lugares">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-gray-900">Lugares Turísticos</h2>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat 
                    ? 'bg-accent-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPlaces.map(place => (
              <PlaceCard 
                key={place.id} 
                place={place} 
                onAudioClick={handleAudioClick}
                onRouteClick={handleRouteClick}
                onMoreClick={setModalPlace}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <section id="mapa" className="bg-white py-14 sm:py-24 relative overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-3 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12 text-center"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-gray-900">Mapa Interactivo</h2>
            <p className="text-xs sm:text-base text-gray-500 max-w-2xl mx-auto">Visualiza todos los puntos turísticos y calcula la ruta ("trazos") desde tu ubicación actual al destino de tu preferencia.</p>
          </motion.div>

          <InteractiveMap 
            places={places} 
            activeCategory={activeCategory} 
            routeCoords={routeCoords}
            routeColor={routeColor}
            userLocation={userLocation}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            routeInfo={routeInfo}
            onRouteClick={handleRouteClick}
            onAudioClick={handleAudioClick}
            onClearRoute={handleClearRoute}
          />
        </div>
      </section>

      <footer className="bg-surface-900 py-10 sm:py-12 text-center border-t border-gray-200 px-4">
        <div className="flex items-center justify-center gap-2 font-bold text-xl sm:text-2xl text-gray-800 mb-3 sm:mb-4">
          <LucideIcons.Mountain className="text-accent-500" />
          <span>TuriArica</span>
        </div>
        <p className="text-sm text-gray-500 mb-4 sm:mb-6">Turismo accesible e inclusivo para todos. 🌸</p>
        <div className="text-xs sm:text-sm text-gray-400">
          Desarrollado con ❤️ para Arica, Chile · 2026
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {modalPlace && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalPlace(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500"
                onClick={() => setModalPlace(null)}
              >
                <LucideIcons.X size={20} />
              </button>
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-accent-50 text-accent-600 text-xs font-bold rounded-full mb-3 border border-accent-200">
                  {modalPlace.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">{modalPlace.name}</h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-5">{modalPlace.fullDesc}</p>
                
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                  <div className="flex gap-4 items-start">
                    <LucideIcons.MapPin className="text-accent-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Cómo llegar</h4>
                      <p className="text-gray-600">{modalPlace.directions}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <LucideIcons.Bus className="text-accent-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Locomoción (Transporte)</h4>
                      <p className="text-gray-600">
                        Micros: <span className="font-bold">{modalPlace.transport?.lineas?.join(", ") || "N/A"}</span> <br/>
                        Dirección: {modalPlace.transport?.letrero || ""} <br/>
                        Bajar en: {modalPlace.transport?.parada || ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <LucideIcons.Clock className="text-accent-500 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Horario</h4>
                      <p className="text-gray-600">{modalPlace.hours}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleAudioClick(modalPlace)}
                  className="flex-1 py-3 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LucideIcons.Volume2 size={20} />
                  Escuchar audio real
                </button>
                <button 
                  onClick={() => {
                    setModalPlace(null);
                    handleRouteClick(modalPlace);
                  }}
                  className="flex-1 py-3 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <LucideIcons.Navigation size={20} />
                  Trazar ruta en mapa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
