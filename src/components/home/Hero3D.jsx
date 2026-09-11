import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_VIDEO = "https://res.cloudinary.com/dirgawanf/video/upload/q_auto/v1789146026/202609111345_jzwgh2.mp4";
const HERO_POSTER = "https://res.cloudinary.com/dirgawanf/video/upload/so_0,q_auto,w_1920/v1789146026/202609111345_jzwgh2.jpg";

function VideoBackground() {
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    // Se corta exactamente 1 segundo antes de terminar y vuelve al inicio en bucle infinito
    if (video.currentTime >= video.duration - 1) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
          }
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay oscuro muy sutil para que resalten los colores reales del video pero el texto blanco se lea */}
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-900/90"></div>
    </div>
  );
}

export default function Hero3D() {
  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <VideoBackground />

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block py-1 px-4 rounded-full bg-accent-500/90 text-white text-sm font-bold mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-accent-400">
            Descubre la Eterna Primavera 🌸
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            Arica, de forma <span className="text-brand-400 drop-shadow-md">inclusiva</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Explora los atractivos turísticos de la ciudad con un mapa interactivo diseñado para todos. Accesibilidad total y sin barreras.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#mapa" className="px-8 py-4 rounded-full bg-accent-500 hover:bg-accent-600 text-white font-bold transition-all shadow-[0_4px_20px_rgba(249,115,22,0.6)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.8)] border border-transparent hover:scale-105">
              Explorar el Mapa
            </a>
            <a href="#lugares" className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all shadow-md backdrop-blur-md border border-white/30 hover:scale-105">
              Ver Lugares
            </a>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-90"
      >
        <div className="w-[30px] h-[50px] border-2 border-white/60 rounded-full flex justify-center p-2 bg-black/20 backdrop-blur-sm shadow-sm">
          <div className="w-1 h-3 bg-white rounded-full shadow-sm" />
        </div>
      </motion.div>
    </section>
  );
}
