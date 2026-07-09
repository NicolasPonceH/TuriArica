const places = [
  {
    id: 1, emoji: "🏖️", name: "Playa El Laucho", category: "Playa", lat: -18.4879, lng: -70.3267, color: "#0EA5E9", audioFile: "audios/laucho_audio.mp3",
    shortDesc: "La playa más popular y accesible de Arica.",
    fullDesc: "Playa El Laucho es el balneario por excelencia de Arica. Sus aguas de color turquesa son inusualmente tranquilas y de temperatura agradable, lo que la convierte en una piscina natural ideal para el baño seguro de niños y adultos. Cuenta con una excelente infraestructura inclusiva, incluyendo rampas que llegan casi hasta la orilla del mar, baños adaptados, duchas y arriendo de sombrillas. En su entorno encontrarás una vibrante oferta gastronómica para disfrutar de un hermoso atardecer frente al Pacífico.",
    directions: "Desde el centro, tomar Av. Comandante San Martín al sur por 2 km. Micros 12, 14, 10, 8 (letrero 'Centro/Mall' en ida).",
    hours: "Abierta todo el año · 24 horas",
    transport: { lineas: ["12", "14", "10", "8"], direccion: "sur", letrero: "Centro / Mall", parada: "Av. Comandante San Martín" }
  },
  {
    id: 2, emoji: "🏛️", name: "Museo de Sitio Colón 10", category: "Museo", lat: -18.4806, lng: -70.3216, color: "#8B5CF6", audioFile: "audios/Museo_audio.mp3",
    shortDesc: "Hogar de las momias Chinchorro, las más antiguas del mundo.",
    fullDesc: "Este asombroso museo está construido literalmente sobre un cementerio prehispánico. El Museo de Sitio Colón 10 resguarda in situ a las momias de la Cultura Chinchorro, reconocidas por la UNESCO como Patrimonio de la Humanidad. Estas momias tienen más de 7.000 años de antigüedad, superando en milenios a las momias egipcias. A través de un suelo de cristal y pasarelas totalmente accesibles, los visitantes pueden observar los cuerpos y ofrendas exactamente como fueron descubiertos, ofreciendo una ventana incomparable al pasado.",
    directions: "Calle Colón 10, a 3 cuadras de la Plaza Colón. Micros 1,2,3,5,7,10,11,16,113 (letrero 'Centro'). Bajas en calle Colón y caminas 3 cuadras.",
    hours: "Martes a Domingo · 09:00 - 18:00",
    transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "Calle Colón" }
  },
  {
    id: 3, emoji: "⛪", name: "Iglesia San Marcos", category: "Histórico", lat: -18.4789, lng: -70.3207, color: "#F59E0B", audioFile: "audios/Catedral_audio.mp3",
    shortDesc: "Diseñada por Gustave Eiffel, ícono de Arica.",
    fullDesc: "Declarada Monumento Nacional, la Iglesia San Marcos es una joya arquitectónica diseñada en 1876 por los talleres del famoso ingeniero francés Gustave Eiffel. Lo más sorprendente es que su estructura es completamente de fierro fundido, traída en barco desde Francia y ensamblada en Arica para resistir los terremotos de la zona. Su estilo gótico, sus coloridos vitrales y su asimétrica torre la convierten en una parada obligatoria en el corazón de la ciudad. El acceso principal cuenta con rampas para facilitar el ingreso.",
    directions: "Plaza Colón, centro histórico. Cualquier micro con letrero 'Centro' te deja en la plaza.",
    hours: "Lunes a Sábado 08-20h · Domingo 09-13h",
    transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "Plaza Colón" }
  },
  {
    id: 4, emoji: "🌋", name: "El Morro de Arica", category: "Histórico", lat: -18.4803, lng: -70.3236, color: "#EF4444", audioFile: "audios/Morro_audio.mp3",
    shortDesc: "Cerro con museo histórico y vistas panorámicas.",
    fullDesc: "El Morro de Arica es el símbolo indiscutido de la ciudad. Este imponente peñón costero de 139 metros de altura fue el escenario de una de las batallas más decisivas de la Guerra del Pacífico en 1880. Hoy en día, su cima funciona como un gran balcón natural que ofrece las mejores vistas panorámicas de la ciudad, el puerto y el Océano Pacífico. En la cumbre podrás visitar el Museo Histórico y de Armas, recorrer las trincheras originales y observar el Cristo de la Paz.",
    directions: "Acceso por Av. Colón o calle Rafael Sotomayor. Estacionamiento gratuito. En micro, toma 12,14,10,8 con letrero 'Centro/Mall' y baja en los pies del Morro.",
    hours: "Martes a Domingo · 08:00 - 18:00",
    transport: { lineas: ["12", "14", "10", "8"], direccion: "sur", letrero: "Centro / Mall", parada: "Pies del Morro" }
  },
  {
    id: 5, emoji: "🦆", name: "Humedal del Río Lluta", category: "Naturaleza", lat: -18.416128, lng: -70.322369, color: "#10B981", audioFile: "audios/Humedal_audio.mp3",
    shortDesc: "Santuario natural y refugio de aves migratorias.",
    fullDesc: "Un oasis de vida donde el desierto se encuentra con el mar. El Humedal de la desembocadura del Río Lluta es un Santuario de la Naturaleza de más de 300 hectáreas. Es un punto de descanso y alimentación crucial en la ruta migratoria de más de 160 especies de aves, incluyendo flamencos, patos jergón y gaviotas. Ofrece senderos planos y miradores de madera diseñados para observar la fauna sin perturbar el ecosistema, siendo un lugar perfecto para la fotografía y la conexión con la naturaleza.",
    directions: "Norte de Arica, por Ruta 5 o Av. Las Dunas. No hay micros directas. Solo taxi o auto particular.",
    hours: "Abierto todo el año · 08:00 - 18:30",
    transport: { lineas: ["taxi", "auto"], direccion: "norte", letrero: "No hay micros", parada: "Solo vehículo particular" }
  },
  {
    id: 6, emoji: "🕌", name: "Cuevas de Anzota", category: "Naturaleza", lat: -18.5498, lng: -70.3312, color: "#6366F1", audioFile: "audios/CuevasDeAnzota_audio.mp3",
    shortDesc: "Sistema de grutas en acantilados, lobos marinos.",
    fullDesc: "Las Cuevas de Anzota ofrecen uno de los paisajes más dramáticos y hermosos de la región. Talladas durante milenios por el fuerte oleaje del océano contra los acantilados de la Cordillera de la Costa, estas cavernas naturales fueron utilizadas hace miles de años por la cultura Chinchorro. Hoy, un sendero interpretativo te permite caminar dentro de las grutas, observar la rica fauna marina (como lobos marinos y aves guaneras) y sentir la imponente fuerza de la naturaleza.",
    directions: "12 km al sur por Ruta 1. No hay micros. Solo taxi o auto particular.",
    hours: "Abierto todo el año · mejor con marea baja",
    transport: { lineas: ["taxi", "auto"], direccion: "sur", letrero: "No hay micros", parada: "Solo vehículo particular" }
  },
  {
    id: 7, emoji: "🍽️", name: "Terminal Agropecuario ASOCAPEC", category: "Gastronomía", lat: -18.4964, lng: -70.2861, color: "#C2714F", audioFile: "audios/terminal_audio.mp3",
    shortDesc: "Corazón gastronómico: aceitunas, frutas, tradición.",
    fullDesc: "Visitar el 'Agro' es sumergirse en una explosión de colores, aromas y sabores auténticos del norte de Chile. Este inmenso mercado es el punto neurálgico donde los agricultores de los valles de Azapa y Lluta traen sus mejores productos frescos. Aquí podrás degustar las famosas aceitunas de Azapa, frutas tropicales como mangos y maracuyá, y disfrutar de cocinerías tradicionales que ofrecen platos típicos a excelentes precios. Sus amplios pasillos facilitan el recorrido.",
    directions: "Entrada norte, Panamericana Norte. Micros que digan 'Agro' en el letrero: 12, 14, 8, 16, 113 (líneas naranja y roja).",
    hours: "Todos los días 06:00 - 18:00",
    transport: { lineas: ["12", "14", "8", "16", "113"], direccion: "norte", letrero: "Agro", parada: "Terminal ASOCAPEC" }
  },
  {
    id: 8, emoji: "🏖️", name: "Playa Chinchorro", category: "Playa", lat: -18.4630, lng: -70.3052, color: "#38BDF8", audioFile: "audios/chinchorro_audio.mp3",
    shortDesc: "Extensa playa de aguas cálidas, ideal para familias y caminatas.",
    fullDesc: "Playa Chinchorro es una de las playas más extensas y concurridas de Arica. Destaca por sus aguas inusualmente cálidas y su oleaje moderado, lo que la hace perfecta para la natación y para disfrutar en familia. Su amplia costanera está llena de vida, rodeada de palmeras, parques infantiles, heladerías y restaurantes, creando un ambiente vibrante tanto de día como de noche.",
    directions: "Sector norte de Arica, Av. Raúl Pey Casado. Toma micro 12 o 14 (letrero 'Centro/Mall' en ida), baja en España con Buenos Aires, camina 1 cuadra hacia el oeste.",
    hours: "Abierta todo el año · 24 horas",
    transport: { lineas: ["12", "14"], direccion: "norte", letrero: "Centro / Mall", parada: "España con Buenos Aires (luego caminar 1 cuadra)" }
  },
  {
    id: 9, emoji: "🏄", name: "Playa Las Machas", category: "Playa", lat: -18.4455, lng: -70.3038, color: "#0284C7", audioFile: "audios/machas_audios.mp3",
    shortDesc: "Playa de fuerte oleaje, el paraíso local del surf y bodyboard.",
    fullDesc: "Ubicada a continuación de Playa Chinchorro hacia el norte, Las Machas es conocida por sus fuertes corrientes, por lo que no es apta para el baño. Sin embargo, es un verdadero paraíso para los amantes de los deportes acuáticos como el surf, bodyboard y kitesurf. Su extensa arena oscura es también el lugar preferido para pescar, pasear mascotas y contemplar los espectaculares atardeceres ariqueños.",
    directions: "Extremo norte del borde costero, por Av. Las Dunas. Toma micro 12 o 14 (letrero 'Centro/Mall'), baja en Eliat con Av. España, camina 1 cuadra hacia el oeste (hacia el Pipo).",
    hours: "Abierta todo el año · 24 horas (No apta para baño)",
    transport: { lineas: ["12", "14"], direccion: "norte", letrero: "Centro / Mall", parada: "Eliat con Av. España (luego caminar 1 cuadra)" }
  },
  {
    id: 10, emoji: "🤿", name: "Playa La Lisera", category: "Playa", lat: -18.4933, lng: -70.3261, color: "#14B8A6", audioFile: "audios/lisera_audio.mp3",
    shortDesc: "Playa con forma de herradura, arena blanca y aguas sin olas.",
    fullDesc: "Playa La Lisera se caracteriza por su singular forma de herradura cerrada, la cual la protege de las corrientes oceánicas y la convierte en una gran piscina natural de aguas sumamente tranquilas. Es el lugar perfecto para ir con niños pequeños o practicar snorkel seguro. Cuenta con hermosas áreas verdes, arena blanca y caleta de pescadores cercana, siendo uno de los balnearios más tradicionales al sur del Morro.",
    directions: "Al sur de Playa El Laucho, continuando por Av. Comandante San Martín. Las mismas micros que van a El Laucho (12,14,10,8) te dejan cerca.",
    hours: "Abierta todo el año · 24 horas",
    transport: { lineas: ["12", "14", "10", "8"], direccion: "sur", letrero: "Centro / Mall", parada: "Av. Comandante San Martín" }
  },
  {
    id: 11, emoji: "🌊", name: "Ex Isla Alacrán", category: "Histórico", lat: -18.4803, lng: -70.3324, color: "#475569", audioFile: "audios/alacran_audio.mp3",
    shortDesc: "Península histórica y sede de la famosa y peligrosa ola 'El Gringo'.",
    fullDesc: "Esta antigua isla fue unida artificialmente al continente en la década de 1960. La Ex Isla Alacrán es un monumento nacional que aún conserva restos del antiguo fuerte colonial San José. A nivel internacional, es famosa por la ola 'El Gringo' (o 'Flopos'), una ola tubular de nivel mundial que rompe peligrosamente sobre roca y que atrae a campeones mundiales de surf y bodyboard.",
    directions: "Frente al Morro de Arica, ingresando por el borde costero centro. Micros 12,14,8,10 (letrero 'Centro/Mall') te dejan en el borde costero, caminas hacia el Morro.",
    hours: "Abierta todo el año · 24 horas",
    transport: { lineas: ["12", "14", "8", "10"], direccion: "sur", letrero: "Centro / Mall", parada: "Borde Costero" }
  },
  {
    id: 12, emoji: "⚽", name: "Estadio Carlos Dittborn", category: "Deporte", lat: -18.4871, lng: -70.2974, color: "#22C55E", audioFile: "audios/dittborn_audio.mp3",
    shortDesc: "Histórico estadio, sede del Mundial de 1962 y hogar del club San Marcos.",
    fullDesc: "El Estadio Mundialista Carlos Dittborn es un orgullo deportivo de la ciudad. Fue construido y modernizado para ser sede de la Copa Mundial de la FIFA en 1962, gesta que se logró bajo el histórico lema 'Porque no tenemos nada, queremos hacerlo todo'. Hoy en día, es el corazón del fútbol local, siendo la casa oficial del equipo San Marcos de Arica ('Los Bravos del Morro').",
    directions: "Av. 18 de Septiembre 2000, sector este de la ciudad. Micros 16, 8, 113 (bajan cerca). También 12 y 14 dejan en Av. 18 de Septiembre a unas cuadras.",
    hours: "Horario variable según eventos y partidos oficiales.",
    transport: { lineas: ["16", "8", "113", "12", "14"], direccion: "este", letrero: "18 de Septiembre / Estadio", parada: "Av. 18 de Septiembre" }
  },
  {
    id: 13, emoji: "🐚", name: "Museo del Mar", category: "Museo", lat: -18.4791, lng: -70.3193, color: "#3B82F6", audioFile: "audios/museodelmar_audio.mp3",
    shortDesc: "Increíble colección de caracolas, fósiles y especies marinas.",
    fullDesc: "Ubicado en el pintoresco Pasaje Sangra, en pleno centro de la ciudad, el Museo del Mar de Arica exhibe una fascinante colección privada de más de 1.200 especies de caracolas marinas procedentes tanto de las costas de Chile como de diversas partes del mundo. Además de las conchas, el museo cuenta con acuarios y fósiles que enseñan a grandes y chicos sobre la increíble biodiversidad del Océano Pacífico.",
    directions: "Pasaje Sangra 315, a pasos de la calle peatonal 21 de Mayo. Cualquier micro con letrero 'Centro' te deja en 21 de Mayo, caminas al Pasaje Sangra.",
    hours: "Lunes a Sábado · 10:00 - 14:00 y 17:00 - 20:00",
    transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "21 de Mayo" }
  },
  {
    id: 14, emoji: "🛍️", name: "Paseo 21 de Mayo", category: "Paseo", lat: -18.4783, lng: -70.3188, color: "#EC4899", audioFile: "audios/21demayo_audio.mp3",
    shortDesc: "El corazón comercial y peatonal de Arica, ideal para pasear y comprar.",
    fullDesc: "La calle peatonal 21 de Mayo es el punto de encuentro por excelencia de la ciudad. A lo largo de sus cuadras sombreadas por modernos toldos, encontrarás una enorme variedad de tiendas, galerías comerciales, artesanías locales, cafeterías y restaurantes. Es el mejor lugar para comprar recuerdos, probar un helado, disfrutar de la música de los artistas callejeros o probar un pisco sour de maracuyá en alguna terraza.",
    directions: "Se extiende desde la calle Arturo Prat hasta los pies del Morro. Cualquier micro con letrero 'Centro' te deja cerca.",
    hours: "Comercio generalmente de 09:30 a 19:30",
    transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "21 de Mayo" }
  }
];

// ---------- AUDIO (MP3 + TTS respaldo) ----------
let speakingButton = null, currentAudio = null, isAutoRead = false, autoReadPaused = false, currentVoice = null, availableVoices = [];
function loadVoices() { availableVoices = window.speechSynthesis.getVoices(); if (availableVoices.length === 0) setTimeout(loadVoices, 100); else currentVoice = availableVoices.find(v => v.lang.startsWith('es') && (v.name.includes('Sabina') || v.name.includes('Monica') || v.name.includes('Paulina') || v.name.includes('Helena') || v.name.includes('Google español'))) || availableVoices.find(v => v.lang.startsWith('es')); }
window.speechSynthesis.onvoiceschanged = loadVoices; loadVoices();
function stopSpeaking() { window.speechSynthesis.cancel(); if (currentAudio) { currentAudio.pause(); currentAudio = null; } if (speakingButton) { speakingButton.classList.remove('speaking'); speakingButton.innerHTML = speakingButton.dataset.originalHtml || "🔊"; speakingButton = null; } }
function playPlaceAudio(place, btn) {
  if (speakingButton === btn) { stopSpeaking(); autoReadPaused = false; return; }
  stopSpeaking();
  if (btn) autoReadPaused = true;
  if (place.audioFile) {
    currentAudio = new Audio(place.audioFile);
    if (btn) {
      btn.dataset.originalHtml = btn.innerHTML; btn.innerHTML = "⏹ Detener"; btn.classList.add('speaking'); speakingButton = btn;
      currentAudio.onended = () => { stopSpeaking(); autoReadPaused = false; };
    }
    currentAudio.play().catch(() => speak(place.fullDesc, btn));
  } else speak(place.fullDesc, btn);
}
function speak(text, btn) {
  if (speakingButton === btn && btn !== null) { stopSpeaking(); autoReadPaused = false; return; }
  stopSpeaking();
  if (btn) autoReadPaused = true;
  const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'es-CL'; utterance.rate = 0.95;
  if (currentVoice) utterance.voice = currentVoice;
  if (btn) {
    btn.dataset.originalHtml = btn.innerHTML; btn.innerHTML = "⏹ Detener"; btn.classList.add('speaking'); speakingButton = btn;
    utterance.onend = () => { stopSpeaking(); autoReadPaused = false; };
  }
  window.speechSynthesis.speak(utterance);
}

// ---------- SISTEMA DE ZONAS Y TRANSPORTE PERSONALIZADO ----------
const zonas = {
  centro: { latMin: -18.482, latMax: -18.476, lngMin: -70.322, lngMax: -70.314, nombre: "centro" },
  norte: { latMin: -18.470, latMax: -18.416, lngMin: -70.330, lngMax: -70.280, nombre: "norte" },
  sur: { latMin: -18.490, latMax: -18.550, lngMin: -70.340, lngMax: -70.320, nombre: "sur" },
  este: { latMin: -18.480, latMax: -18.470, lngMin: -70.310, lngMax: -70.280, nombre: "este" },
  oeste: { latMin: -18.485, latMax: -18.470, lngMin: -70.330, lngMax: -70.320, nombre: "oeste" }
};
function obtenerZona(lat, lng) { for (let [z, coords] of Object.entries(zonas)) if (lat >= coords.latMin && lat <= coords.latMax && lng >= coords.lngMin && lng <= coords.lngMax) return z; return "centro"; }
async function obtenerCalle(lat, lng) {
  try {
    let res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    let data = await res.json();
    if (data.address?.road) return data.address.road;
    if (data.display_name) return data.display_name.split(",")[0];
  } catch (e) { }
  return "tu ubicación";
}

// Recomendación personalizada según zona
function obtenerRecomendacionTransporte(place, zonaUsuario, calle) {
  const t = place.transport;
  if (!t) return `Para llegar a ${place.name}, consulta las micros disponibles.`;

  // Si no hay micros (taxi o auto)
  if (t.lineas[0] === "taxi" || t.lineas[0] === "auto") {
    return `📍 Desde <strong>${calle}</strong> (zona ${zonaUsuario} de Arica):<br><br>
            ❌ No hay micros que lleguen directamente a ${place.name}.<br>
            ✅ La única opción es tomar un <strong>taxi</strong> o ir en <strong>auto particular</strong>.`;
  }

  let mensaje = `📍 Desde <strong>${calle}</strong> (zona ${zonaUsuario} de Arica):<br><br>`;

  // Personalización según zona del usuario (ejemplo: norte, centro, sur)
  if (zonaUsuario === "norte" || calle.includes("11 de Septiembre") || calle.includes("Linderos") || calle.includes("Cancharrayada")) {
    mensaje += `✅ Estás en el sector norte. Dirígete a un paradero en <strong>Linderos o Cancharrayada</strong>.<br>`;
    mensaje += `🚌 Toma las micros <strong>${t.lineas.join(", ")}</strong>.<br>`;
    if (t.direccion === "sur" || place.name.includes("Playa") || place.name.includes("Morro") || place.name.includes("Isla")) {
      mensaje += `🔹 Busca el letrero <strong>"Centro" o "Mall"</strong> (dirección sur).<br>`;
    } else if (t.direccion === "norte" || place.name.includes("Agro")) {
      mensaje += `🔹 Busca el letrero <strong>"Agro"</strong> (dirección norte).<br>`;
    } else {
      mensaje += `🔹 Busca el letrero <strong>"${t.letrero}"</strong>.<br>`;
    }
    mensaje += `📍 Bájate en <strong>${t.parada}</strong>.`;
  }
  else if (zonaUsuario === "centro") {
    mensaje += `✅ Estás en el centro. Puedes tomar cualquier micro con letrero <strong>"Centro"</strong> o caminar si estás cerca.<br>`;
    mensaje += `🚌 Líneas útiles: ${t.lineas.join(", ")}.<br>`;
    mensaje += `📍 Bájate en <strong>${t.parada}</strong>.`;
  }
  else {
    // Genérico para otras zonas
    mensaje += `Toma las micros <strong>${t.lineas.join(", ")}</strong> con dirección <strong>${t.direccion}</strong>.<br>`;
    mensaje += `🔹 Busca el letrero <strong>"${t.letrero}"</strong>.<br>`;
    mensaje += `📍 Bájate en <strong>${t.parada}</strong>.`;
  }

  mensaje += `<br><br>💡 <strong>Consejo:</strong> Pregunta al conductor que te avise al llegar.`;
  return mensaje;
}

async function mostrarInfoTransporte(placeId, userLat, userLng) {
  const place = places.find(p => p.id === placeId);
  if (!place) return;
  const calle = await obtenerCalle(userLat, userLng);
  const zona = obtenerZona(userLat, userLng);
  const recomendacion = obtenerRecomendacionTransporte(place, zona, calle);

  const modal = document.getElementById("placeModal");
  document.getElementById("modalTitle").innerHTML = `🚍 Transporte a ${place.name}`;
  document.getElementById("modalBadge").innerHTML = place.category;
  document.getElementById("userLocationBadge").innerHTML = `📍 Tu ubicación: ${calle}`;
  document.getElementById("modalTransportText").innerHTML = recomendacion;
  // Ocultar sección de info completa y mostrar la de transporte
  document.getElementById("modalFullInfo").style.display = "none";
  document.getElementById("modalTransportInfo").style.display = "block";
  modal.showModal();
}

// ---------- RUTAS Y MAPA ----------
let map, markersLayer = new L.LayerGroup(), activeRouteLayer = null, userMarker = null, borderLineLayer = null;
function haversineDistance(lat1, lon1, lat2, lon2) { const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180; const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2; return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1); }
function getUserLocation(callback) { if (!navigator.geolocation) return mostrarErrorGeo("No soporta geolocalización."); const panel = document.getElementById('ruta-info'); panel.innerHTML = `<div class="ruta-panel ruta-loading"><span class="ruta-spinner"></span><span>Solicitando permiso...</span></div>`; navigator.geolocation.getCurrentPosition(pos => callback(pos.coords.latitude, pos.coords.longitude), err => { let msg = "No se pudo obtener ubicación."; if (err.code === err.PERMISSION_DENIED) msg = "Permiso denegado."; mostrarErrorGeo(msg); }, { enableHighAccuracy: true, timeout: 10000 }); }
function mostrarErrorGeo(msg) { document.getElementById('ruta-info').innerHTML = `<div class="ruta-panel" style="border-left-color:#EF4444;"><strong>⚠️ Error</strong><br>${msg}</div>`; }
function placeUserMarker(lat, lng) { if (userMarker) map.removeLayer(userMarker); userMarker = L.circleMarker([lat, lng], { radius: 10, fillColor: "#0F172A", color: "white", weight: 3, fillOpacity: 1 }).addTo(map); userMarker.bindPopup("<strong>📍 Tú estás aquí</strong>").openPopup(); }
async function trazarRuta(place) {
  const panel = document.getElementById('ruta-info'); panel.innerHTML = `<div class="ruta-panel ruta-loading"><span class="ruta-spinner"></span><span>Calculando ruta hacia ${place.name}...</span></div>`;
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  getUserLocation(async (lat, lng) => {
    placeUserMarker(lat, lng);
    let coords = [], distKm = 0, minutosCarro = 0, minutosPie = 0, esRecta = false;
    const API_KEY = "6817f243-eee4-4604-a1fa-8a73d219cbe6";
    const url = `https://graphhopper.com/api/1/route?point=${lat},${lng}&point=${place.lat},${place.lng}&vehicle=car&locale=es&instructions=false&points_encoded=false&key=${API_KEY}`;
    try {
      const res = await fetch(url); if (!res.ok) throw new Error(); const data = await res.json(); if (!data.paths?.length) throw new Error();
      const route = data.paths[0]; coords = route.points.coordinates.map(c => [c[1], c[0]]); distKm = (route.distance / 1000).toFixed(1); minutosCarro = Math.round(route.time / 60000); minutosPie = Math.round((distKm / 5) * 60);
    } catch (e) { esRecta = true; coords = [[lat, lng], [place.lat, place.lng]]; distKm = haversineDistance(lat, lng, place.lat, place.lng); minutosCarro = Math.round(distKm * 2); minutosPie = Math.round((distKm / 5) * 60); }
    if (activeRouteLayer) map.removeLayer(activeRouteLayer); if (borderLineLayer) map.removeLayer(borderLineLayer);
    borderLineLayer = L.polyline(coords, { color: "#FFFFFF", weight: 14, opacity: 0.5, lineCap: 'round' }).addTo(map);
    activeRouteLayer = L.polyline(coords, { color: place.color, weight: 8, opacity: 0.95, lineCap: 'round' }).addTo(map);
    borderLineLayer.bringToBack(); activeRouteLayer.bringToFront(); if (esRecta) { activeRouteLayer.setStyle({ dashArray: "8,8" }); borderLineLayer.setStyle({ dashArray: "8,8" }); }
    const bounds = L.latLngBounds(coords); map.fitBounds(bounds, { padding: [50, 50] });
    const badgeClass = distKm < 1 ? 'badge-green' : distKm <= 10 ? 'badge-blue' : 'badge-gray';
    const aviso = esRecta ? '<p style="color:#C2714F;">⚠️ Ruta aproximada (sin conexión a rutas).</p>' : '';
    panel.innerHTML = `
            <div class="ruta-panel" style="border-left-color:${place.color}">
                <div class="ruta-header"><span class="ruta-emoji">${place.emoji}</span><div><h3 class="ruta-title">Ruta hacia ${place.name}</h3><span class="ruta-badge ${badgeClass}">📍 ${distKm} km</span></div><button class="ruta-close" onclick="limpiarRuta()">✕</button></div>
                ${aviso}
                <div class="ruta-stats"><div class="ruta-stat">🚗 Auto<br><strong>~${minutosCarro} min</strong></div><div class="ruta-stat">🚶 Pie<br><strong>~${minutosPie} min</strong></div></div>
                <div class="ruta-actions">
                    <button class="btn-audio-ruta" onclick="speak('Ruta hacia ${place.name}. Distancia ${distKm} kilómetros, aproximadamente ${minutosCarro} minutos en auto.', this)">🔊 Escuchar ruta</button>
                    <button class="btn-info-transport" onclick="mostrarInfoTransporte(${place.id}, ${lat}, ${lng})">🚍 Info locomoción</button>
                </div>
            </div>`;
  });
}
window.limpiarRuta = function () { if (activeRouteLayer) map.removeLayer(activeRouteLayer); if (borderLineLayer) map.removeLayer(borderLineLayer); if (userMarker) map.removeLayer(userMarker); activeRouteLayer = borderLineLayer = userMarker = null; document.getElementById('ruta-info').innerHTML = ''; map.setView([-18.4783, -70.3126], 13); };

// ---------- RENDER TARJETAS ----------
const placesGrid = document.getElementById("placesGrid");
function renderPlaces(filter = "Todos") {
  placesGrid.innerHTML = '';
  const filtered = filter === "Todos" ? places : places.filter(p => p.category === filter);
  filtered.forEach(place => {
    const card = document.createElement("article"); card.className = "place-card";
    if (isAutoRead) card.addEventListener('mouseenter', () => speak(place.name, null));
    card.innerHTML = `
            <div class="card-header" style="background:linear-gradient(135deg,${place.color}88,${place.color})"><span class="card-badge">${place.category}</span><div class="card-icon">${place.emoji}</div></div>
            <div class="card-body"><h3 class="card-title">${place.name}</h3><p class="card-desc">${place.shortDesc}</p>
            <div class="card-actions"><button class="btn-icon btn-audio">🔊</button><button class="btn-icon btn-dir">📍</button><button class="btn-full btn-more">Ver más</button></div></div>`;
    card.querySelector('.btn-audio').addEventListener('click', () => playPlaceAudio(place, card.querySelector('.btn-audio')));
    card.querySelector('.btn-dir').addEventListener('click', () => { document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => trazarRuta(place), 600); });
    card.querySelector('.btn-more').addEventListener('click', () => openModal(place));
    placesGrid.appendChild(card);
  });
}
function openModal(place) {
  document.getElementById("modalTitle").innerHTML = `${place.emoji} ${place.name}`;
  document.getElementById("modalBadge").innerHTML = place.category;
  document.getElementById("modalDesc").innerHTML = place.fullDesc;
  document.getElementById("modalDirections").innerHTML = place.directions;
  document.getElementById("modalHours").innerHTML = place.hours;
  document.getElementById("modalFullInfo").style.display = "block";
  document.getElementById("modalTransportInfo").style.display = "none";
  document.getElementById("placeModal").showModal();
}
document.querySelectorAll('.filter-btn').forEach(btn => btn.addEventListener('click', () => { document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); renderPlaces(btn.getAttribute('data-category')); updateMapMarkers(btn.getAttribute('data-category')); }));
const modal = document.getElementById("placeModal"); document.querySelector(".close-modal").addEventListener("click", () => modal.close()); modal.addEventListener("click", e => { const rect = modal.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) modal.close(); });

// ---------- MAPA ----------
function initMap() { map = L.map('map', { center: [-18.4783, -70.3126], zoom: 13, zoomControl: false }); L.control.zoom({ position: 'topleft' }).addTo(map); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map); markersLayer.addTo(map); updateMapMarkers("Todos"); renderMapLegend(); }
function updateMapMarkers(filter) { markersLayer.clearLayers(); const filtered = filter === "Todos" ? places : places.filter(p => p.category === filter); filtered.forEach(place => { const marker = L.circleMarker([place.lat, place.lng], { radius: 14, fillColor: place.color, color: "#FFF", weight: 3, fillOpacity: 0.9 }); const popupDiv = document.createElement('div'); popupDiv.innerHTML = `<h3>${place.emoji} <strong>${place.name}</strong></h3><span style="background:#eee;border-radius:12px;padding:2px 8px;">${place.category}</span><p>${place.shortDesc}</p><div style="display:flex;gap:6px;"><button class="btn-audio-map">🔊 Escuchar</button><button class="btn-route-map">📍 Cómo llegar</button></div>`; marker.bindPopup(popupDiv); marker.on('popupopen', () => { popupDiv.querySelector('.btn-audio-map').onclick = () => playPlaceAudio(place, popupDiv.querySelector('.btn-audio-map')); popupDiv.querySelector('.btn-route-map').onclick = () => { marker.closePopup(); trazarRuta(place); }; }); markersLayer.addLayer(marker); }); }
function renderMapLegend() { const legend = document.querySelector('.map-legend'); legend.innerHTML = ''; const unique = [...new Map(places.map(p => [p.category, p])).values()]; unique.forEach(cat => { legend.innerHTML += `<div class="legend-item"><span class="legend-color" style="background-color:${cat.color};"></span><span>${cat.category}</span></div>`; }); }

// ---------- ACCESIBILIDAD ----------
let fontSize = 18; document.getElementById("btnTextInc").addEventListener("click", () => { if (fontSize < 24) { fontSize += 2; document.documentElement.style.fontSize = fontSize + "px"; } }); document.getElementById("btnTextDec").addEventListener("click", () => { if (fontSize > 14) { fontSize -= 2; document.documentElement.style.fontSize = fontSize + "px"; } }); document.getElementById("btnContrast").addEventListener("click", () => document.body.classList.toggle("high-contrast"));
document.getElementById("btnAutoRead").addEventListener("click", () => {
  isAutoRead = !isAutoRead;
  const btn = document.getElementById("btnAutoRead");
  if (isAutoRead) {
    btn.classList.add("active");
    btn.style.background = "var(--color-sky-blue)";
    btn.style.color = "white";
    document.addEventListener("mouseover", autoReadHover);
  } else {
    btn.classList.remove("active");
    btn.style.background = "";
    btn.style.color = "";
    stopSpeaking();
    document.removeEventListener("mouseover", autoReadHover);
  }
  renderPlaces(document.querySelector('.filter-btn.active').getAttribute('data-category'));
});

let lastReadElement = null;

// Limpia emojis para lectura: reemplaza los conocidos y elimina el resto
function limpiarEmojis(text) {
  text = text.replace(/🔊/g, 'altavoz');
  text = text.replace(/📍/g, 'ubicación');
  text = text.replace(/📢/g, 'altavoz');
  // Eliminar todos los demás emojis (Unicode emoji ranges)
  text = text.replace(/[\u{1F600}-\u{1F64F}]/gu, '');  // emoticons
  text = text.replace(/[\u{1F300}-\u{1F5FF}]/gu, '');  // symbols & pictographs
  text = text.replace(/[\u{1F680}-\u{1F6FF}]/gu, '');  // transport & map
  text = text.replace(/[\u{1F900}-\u{1F9FF}]/gu, '');  // supplemental
  text = text.replace(/[\u{1FA00}-\u{1FA6F}]/gu, '');  // chess symbols
  text = text.replace(/[\u{1FA70}-\u{1FAFF}]/gu, '');  // symbols extended
  text = text.replace(/[\u{2600}-\u{26FF}]/gu, '');    // misc symbols
  text = text.replace(/[\u{2700}-\u{27BF}]/gu, '');    // dingbats
  text = text.replace(/[\u{FE00}-\u{FE0F}]/gu, '');    // variation selectors
  text = text.replace(/[\u{200D}]/gu, '');              // zero width joiner
  text = text.replace(/\s{2,}/g, ' ');                  // limpiar espacios dobles
  return text.trim();
}

function autoReadHover(e) {
  if (!isAutoRead || autoReadPaused) return;
  const el = e.target.closest('h1, h2, h3, h4, p, a, button, span, li, label, .card-title, .card-desc, .card-badge, .subtitle, .main-title, .legend-item, .footer-logo, .tagline, .credits, .filter-btn, .btn, .acc-btn, .nav-links a, .msg, .bot-msg, .user-msg');
  if (!el || el === lastReadElement) return;
  const rawText = el.innerText?.trim();
  if (!rawText || rawText.length < 2) return;
  const text = limpiarEmojis(rawText);
  if (!text || text.length < 1) return;
  lastReadElement = el;
  stopSpeaking();
  speak(text, null);
}
document.getElementById("btnReadAll").addEventListener("click", leerPaginaCompleta);

// ---------- TOOLBAR PLEGABLE ----------
const accToggle = document.getElementById("btnAccToggle");
const accToolbar = document.querySelector(".acc-toolbar");
accToggle.addEventListener("click", () => {
  const isOpen = accToolbar.classList.toggle("open");
  accToggle.setAttribute("aria-expanded", isOpen);
  accToggle.setAttribute("aria-label", isOpen ? "Cerrar herramientas de accesibilidad" : "Abrir herramientas de accesibilidad");
});

document.addEventListener("DOMContentLoaded", () => { renderPlaces(); initMap(); });
// ---------- LÓGICA DEL ASISTENTE ----------
const assistantModal = document.getElementById("assistantModal");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");

document.getElementById("btnAssistant").addEventListener("click", () => assistantModal.showModal());

function addMessage(text, isBot = true) {
  const msg = document.createElement("div");
  msg.className = `msg ${isBot ? 'bot-msg' : 'user-msg'}`;
  msg.innerHTML = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  if (isBot) speak(text.replace(/<[^>]*>/g, ''), null); // El bot habla
}

// ---------- LÓGICA DEL ASISTENTE ACTUALIZADA ----------
function procesarPregunta() {
  const pregunta = userInput.value.toLowerCase();
  if (!pregunta.trim()) return;

  addMessage(userInput.value, false);
  userInput.value = "";

  setTimeout(() => {
    let respuesta = "No estoy seguro de qué lugar recomendarte para eso, pero puedes intentar preguntando por 'playas', 'museos', 'historia' o 'naturaleza'.";

    // 1. Naturaleza y Humedal
    if (pregunta.includes("humedal") || pregunta.includes("naturaleza") || pregunta.includes("aves") || pregunta.includes("lluta") || pregunta.includes("pasto")) {
      respuesta = "Si te gusta la naturaleza, el <strong>Humedal del Río Lluta</strong> es un santuario increíble para ver aves migratorias.";
    }
    // 2. Deportes y Surf/Body
    else if (pregunta.includes("body surf") || pregunta.includes("body") || pregunta.includes("surf") || pregunta.includes("olas")) {
      respuesta = "Para deportes radicales, la <strong>Ex Isla Alacrán</strong> es famosa por la ola 'El Gringo'. También puedes ir a <strong>Playa Las Machas</strong>.";
    }
    // 3. Arquitectura y Eiffel
    else if (pregunta.includes("eiffel") || pregunta.includes("fierro") || pregunta.includes("iglesia")) {
      respuesta = "¡Dato curioso! La <strong>Iglesia San Marcos</strong> fue diseñada por Gustave Eiffel y es totalmente de fierro fundido.";
    }
    // 4. Museos y Conchas
    else if (pregunta.includes("conchas") || pregunta.includes("caracolas") || pregunta.includes("marino") || pregunta.includes("museo del mar") || pregunta.includes("conchitas")) {
      respuesta = "En el <strong>Museo del Mar</strong> encontrarás una colección asombrosa de más de 1.200 caracolas de todo el mundo.";
    }
    // 5. Gastronomía y Comida
    else if (pregunta.includes("comida") || pregunta.includes("hambre") || pregunta.includes("comer") || pregunta.includes("aceitunas")) {
      respuesta = "Para comer rico y comprar aceitunas de Azapa, el <strong>Terminal Agropecuario ASOCAPEC</strong> es el lugar ideal.";
    }
    // 6. Historia y Batalla
    else if (pregunta.includes("batalla") || pregunta.includes("guerra") || pregunta.includes("historia") || pregunta.includes("morro")) {
      respuesta = "El <strong>Morro de Arica</strong> fue el escenario de una gran batalla histórica. ¡Desde arriba la vista es insuperable!";
    }
    // 7. Ex Isla / Isla Alacrán
    else if (pregunta.includes("ex isla") || pregunta.includes("isla alacran") || pregunta.includes("alacran") || pregunta.includes("isla") || pregunta.includes("olas grandes")) {
      respuesta = "La <strong>Ex Isla Alacrán</strong> es genial para pasear y ver a los surfistas. Es un monumento nacional unido a la costa.";
    }
    // 8. Playas generales
    else if (pregunta.includes("playa") || pregunta.includes("nadar") || pregunta.includes("piscina") || pregunta.includes("relajada") || pregunta.includes("tranquila")) {
      respuesta = "¡Arica tiene playas para todos! <strong>El Laucho</strong> y <strong>La Lisera</strong> son como piscinas naturales, ideales para relajarse.";
    }
    // 9. Saludos
    else if (pregunta.includes("hola") || pregunta.includes("buenos días") || pregunta.includes("quien eres")) {
      respuesta = "¡Hola! Soy tu asistente de TuriArica. Pregúntame sobre playas, museos o historia de la ciudad.";
    }
    // 2. Museo del Mar (Conchas/Caracolas)
    else if (pregunta.includes("mar") || pregunta.includes("concha") || pregunta.includes("caracola")) {
      respuesta = "El <strong>Museo del Mar</strong> tiene una colección increíble de más de 1.200 caracolas de todo el mundo. Es una parada obligatoria en el Pasaje Sangra.";
    }
    // 1. Museo de Sitio Colón 10 (Momias)
    else if (pregunta.includes("colon 10") || pregunta.includes("momias") || pregunta.includes("momia")) {
      respuesta = "El <strong>Museo de Sitio Colón 10</strong> es impresionante. Está construido sobre un cementerio antiguo y puedes ver las momias Chinchorro a través de un suelo de cristal.";
    }
    // 3. Museo arriba del Morro (Histórico y de Armas)
    else if (pregunta.includes("arriba del morro") || pregunta.includes("museo") || pregunta.includes("armas")) {
      respuesta = "En la cima se encuentra el <strong>Museo Histórico y de Armas de Arica</strong>. Ahí conocerás todo sobre la batalla y verás objetos reales de la época.";
    }
    else if (pregunta.includes("cuevas") || pregunta.includes("anzota") || pregunta.includes("grutas") || pregunta.includes("lobos marinos") || pregunta.includes("acantilados")) {
      respuesta = "Las <strong>Cuevas de Anzota</strong> son un paisaje increíble a 12 km al sur de Arica. Podrás caminar dentro de grutas naturales y ver lobos marinos. Solo se llega en taxi o auto particular.";
    }
    addMessage(respuesta);
  }, 600);
}
// ESTO ES LO QUE FALTABA: Los "escuchadores" para que el botón funcione
document.getElementById("btnSend").addEventListener("click", procesarPregunta);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") procesarPregunta();
});
// ---------- RECONOCIMIENTO DE VOZ PARA EL CHAT ----------
const btnVoice = document.getElementById("btnVoice");

// Revisamos si el navegador soporta el reconocimiento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition && btnVoice) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'es-CL'; // Español de Chile
  recognition.continuous = false; // Se detiene al terminar la frase

  btnVoice.addEventListener("click", () => {
    stopSpeaking(); // Detenemos cualquier audio antes de escuchar
    recognition.start();
  });

  recognition.onstart = () => {
    btnVoice.classList.add("listening");
    userInput.placeholder = "Escuchando...";
  };

  recognition.onend = () => {
    btnVoice.classList.remove("listening");
    userInput.placeholder = "Ej: Quiero ir a la playa...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;

    // Enviamos automáticamente la pregunta procesada
    procesarPregunta();
  };

  recognition.onerror = () => {
    btnVoice.classList.remove("listening");
    alert("No pude escucharte bien, ¿podrías intentarlo de nuevo?");
  };

} else if (btnVoice) {
  // Si el navegador no lo soporta
  btnVoice.style.display = "none";
  console.log("El reconocimiento de voz no es compatible con este navegador.");
}
function leerPaginaCompleta() {
  const btn = document.getElementById("btnReadAll");

  // Si ya está leyendo esta misma sección, lo detenemos (Toggle)
  if (speakingButton === btn) {
    stopSpeaking();
    return;
  }

  // No llamamos a stopSpeaking() aquí arriba para no romper el toggle
  let texto = "";
  const heroTitle = document.querySelector('.main-title')?.innerText;
  const heroSub = document.querySelector('.subtitle')?.innerText;

  if (heroTitle) texto += heroTitle + ". ";
  if (heroSub) texto += heroSub + ". ";

  const cards = document.querySelectorAll('.place-card');
  texto += `Se muestran ${cards.length} lugares. `;
  cards.forEach((card, i) => {
    const nombre = card.querySelector('.card-title')?.innerText;
    const desc = card.querySelector('.card-desc')?.innerText;
    if (nombre) texto += `${i + 1}: ${nombre}. `;
    if (desc) texto += desc + ". ";
  });

  const legend = document.querySelectorAll('.legend-item');
  if (legend.length) {
    texto += "Categorías en el mapa: ";
    legend.forEach(item => {
      texto += item.innerText + ", ";
    });
    texto += ". ";
  }

  const ruta = document.querySelector('#ruta-info .ruta-panel:not(.ruta-loading)');
  if (ruta) texto += "Información de ruta: " + ruta.innerText + ". ";

  texto += "Puedes explorar cada lugar con los botones de audio y de ruta.";

  // IMPORTANTE: Pasamos 'btn' como segundo argumento para que se ponga rojo
  speak(texto, btn);
}
