import { useState } from 'react';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import Hero3D from '../components/home/Hero3D';
import CategoryFilter from '../components/home/CategoryFilter';
import PlaceCard from '../components/home/PlaceCard';
import InteractiveMap from '../components/map/InteractiveMap';
import AccessibilityToolbar from '../components/shared/AccessibilityToolbar';
import AssistantModal from '../components/shared/AssistantModal';
import PlaceDetailModal from '../components/shared/PlaceDetailModal';
import PWAInstallPrompt from '../components/shared/PWAInstallPrompt';
import EventPopupModal from '../components/shared/EventPopupModal';
import { usePlaces } from '../contexts/PlacesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateHaversine } from '../utils/haversine';
import { API, FALLBACK_LOCATION } from '../utils/constants';

export default function HomePage() {
  const { places, getPlacesByCategory, getPlacesByType } = usePlaces();
  const { t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeType, setActiveType] = useState('todos');
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeColor, setRouteColor] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [modalPlace, setModalPlace] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  // Filter places by type first, then by category
  const filteredByType = activeType === 'todos' ? places : getPlacesByType(activeType);
  const filteredPlaces = activeCategory === 'Todos'
    ? filteredByType
    : filteredByType.filter(p => p.category === activeCategory);

  const handleAudioClick = (place) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    window.speechSynthesis.cancel();

    if (place.audioFile) {
      const audio = new Audio(`/${place.audioFile}`);
      audio.play().catch(() => {
        const utterance = new SpeechSynthesisUtterance(place.fullDesc);
        utterance.lang = 'es-CL';
        window.speechSynthesis.speak(utterance);
      });
      setCurrentAudio(audio);
    } else if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(place.fullDesc);
      utterance.lang = 'es-CL';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClearRoute = () => {
    setRouteCoords([]);
    setRouteColor('');
    setRouteInfo(null);
  };

  const handleRouteClick = (place) => {
    setSelectedPlace(place);

    const calculateForPosition = async (lat, lng) => {
      setUserLocation([lng, lat]);

      const url = `${API.GRAPHHOPPER}?point=${lat},${lng}&point=${place.lat},${place.lng}&vehicle=car&locale=es&instructions=false&points_encoded=false&key=${API.GRAPHHOPPER_KEY}`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.paths && data.paths.length > 0) {
          const coords = data.paths[0].points.coordinates.map(c => [c[0], c[1]]);
          setRouteCoords(coords);
          setRouteColor(place.color);
          setRouteInfo({
            distanceKm: (data.paths[0].distance / 1000).toFixed(1),
            timeMin: Math.max(1, Math.round(data.paths[0].time / 60000))
          });
          document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          throw new Error();
        }
      } catch {
        setRouteCoords([[lng, lat], [place.lng, place.lat]]);
        setRouteColor(place.color);
        const dist = calculateHaversine(lat, lng, place.lat, place.lng);
        setRouteInfo({
          distanceKm: dist.toFixed(1),
          timeMin: Math.max(1, Math.round((dist / 30) * 60))
        });
        document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (!navigator.geolocation) {
      calculateForPosition(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lng);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => calculateForPosition(pos.coords.latitude, pos.coords.longitude),
      () => calculateForPosition(FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lng),
      { timeout: 6000 }
    );
  };

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
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans selection:bg-brand-500/30 selection:text-brand-600 transition-colors duration-300">
      <Navigation />
      <Hero3D />

      <AccessibilityToolbar
        onAssistantClick={() => setShowAssistant(true)}
        onReadPageClick={handleReadPage}
      />

      <PWAInstallPrompt />

      {showAssistant && <AssistantModal onClose={() => setShowAssistant(false)} />}

      {/* Places Section */}
      <main className="max-w-6xl mx-auto px-6 py-24" id="lugares">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-900">{t('places.title')}</h2>
        </motion.div>

        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeType={activeType}
          setActiveType={setActiveType}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay lugares en esta categoría aún.</p>
          </div>
        )}
      </main>

      {/* Map Section */}
      <section id="mapa" className="bg-white py-24 relative overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">{t('map.title')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t('map.subtitle')}</p>
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

      <Footer />

      {/* Detail Modal */}
      <AnimatePresence>
        {modalPlace && (
          <PlaceDetailModal
            place={modalPlace}
            onClose={() => setModalPlace(null)}
            onAudioClick={handleAudioClick}
            onRouteClick={handleRouteClick}
          />
        )}
      </AnimatePresence>

      {/* Featured Event Popup Modal */}
      <EventPopupModal />
    </div>
  );
}
