// Default places data for TuriArica
// These are the built-in places. Admin-added places are stored in localStorage.

export const defaultPlaces = [
  {
    id: 1, icon: "Umbrella", name: "Playa El Laucho", category: "Playa", type: "turismo",
    lat: -18.4879, lng: -70.3267, color: "#0EA5E9", audioFile: "audios/laucho_audio.mp3",
    shortDesc: "La playa más popular y accesible de Arica.",
    fullDesc: "Playa El Laucho es el balneario por excelencia de Arica. Sus aguas de color turquesa son inusualmente tranquilas y de temperatura agradable, lo que la convierte en una piscina natural ideal para el baño seguro de niños y adultos. Cuenta con una excelente infraestructura inclusiva, incluyendo rampas que llegan casi hasta la orilla del mar, baños adaptados, duchas y arriendo de sombrillas. En su entorno encontrarás una vibrante oferta gastronómica para disfrutar de un hermoso atardecer frente al Pacífico.",
    directions: "Desde el centro, tomar Av. Comandante San Martín al sur por 2 km. Micros 12, 14, 10, 8 (letrero 'Centro/Mall' en ida).",
    hours: "Abierta todo el año · 24 horas",
    phone: "", website: "", priceRange: "", photos: [], is24h: true, isDefault: true,
    transport: { lineas: ["12", "14", "10", "8"], direccion: "sur", letrero: "Centro / Mall", parada: "Av. Comandante San Martín" }
  },
  {
    id: 2, icon: "Landmark", name: "Museo de Sitio Colón 10", category: "Museo", type: "turismo",
    lat: -18.4806, lng: -70.3216, color: "#8B5CF6", audioFile: "audios/Museo_audio.mp3",
    shortDesc: "Hogar de las momias Chinchorro, las más antiguas del mundo.",
    fullDesc: "Este asombroso museo está construido literalmente sobre un cementerio prehispánico. El Museo de Sitio Colón 10 resguarda in situ a las momias de la Cultura Chinchorro, reconocidas por la UNESCO como Patrimonio de la Humanidad. Estas momias tienen más de 7.000 años de antigüedad, superando en milenios a las momias egipcias. A través de un suelo de cristal y pasarelas totalmente accesibles, los visitantes pueden observar los cuerpos y ofrendas exactamente como fueron descubiertos, ofreciendo una ventana incomparable al pasado.",
    directions: "Calle Colón 10, a 3 cuadras de la Plaza Colón. Micros 1,2,3,5,7,10,11,16,113 (letrero 'Centro'). Bajas en calle Colón y caminas 3 cuadras.",
    hours: "Martes a Domingo · 09:00 - 18:00",
    phone: "", website: "", priceRange: "", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "Calle Colón" }
  },
  {
    id: 3, icon: "Church", name: "Iglesia San Marcos", category: "Histórico", type: "turismo",
    lat: -18.4789, lng: -70.3207, color: "#F59E0B", audioFile: "audios/Catedral_audio.mp3",
    shortDesc: "Diseñada por Gustave Eiffel, ícono de Arica.",
    fullDesc: "Declarada Monumento Nacional, la Iglesia San Marcos es una joya arquitectónica diseñada en 1876 por los talleres del famoso ingeniero francés Gustave Eiffel. Lo más sorprendente es que su estructura es completamente de fierro fundido, traída en barco desde Francia y ensamblada en Arica para resistir los terremotos de la zona. Su estilo gótico, sus coloridos vitrales y su asimétrica torre la convierten en una parada obligatoria en el corazón de la ciudad. El acceso principal cuenta con rampas para facilitar el ingreso.",
    directions: "Plaza Colón, centro histórico. Cualquier micro con letrero 'Centro' te deja en la plaza.",
    hours: "Lunes a Sábado 08-20h · Domingo 09-13h",
    phone: "", website: "", priceRange: "", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "Plaza Colón" }
  },
  {
    id: 4, icon: "Mountain", name: "El Morro de Arica", category: "Histórico", type: "turismo",
    lat: -18.4803, lng: -70.3236, color: "#EF4444", audioFile: "audios/Morro_audio.mp3",
    shortDesc: "Cerro con museo histórico y vistas panorámicas.",
    fullDesc: "El Morro de Arica es el símbolo indiscutido de la ciudad. Este imponente peñón costero de 139 metros de altura fue el escenario de una de las batallas más decisivas de la Guerra del Pacífico en 1880. Hoy en día, su cima funciona como un gran balcón natural que ofrece las mejores vistas panorámicas de la ciudad, el puerto y el Océano Pacífico. En la cumbre podrás visitar el Museo Histórico y de Armas, recorrer las trincheras originales y observar el Cristo de la Paz.",
    directions: "Acceso por Av. Colón o calle Rafael Sotomayor. Estacionamiento gratuito. En micro, toma 12,14,10,8 con letrero 'Centro/Mall' y baja en los pies del Morro.",
    hours: "Martes a Domingo · 08:00 - 18:00",
    phone: "", website: "", priceRange: "", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["12", "14", "10", "8"], direccion: "sur", letrero: "Centro / Mall", parada: "Pies del Morro" }
  },
  {
    id: 5, icon: "TreePine", name: "Humedal del Río Lluta", category: "Naturaleza", type: "turismo",
    lat: -18.416128, lng: -70.322369, color: "#10B981", audioFile: "audios/Humedal_audio.mp3",
    shortDesc: "Santuario natural y refugio de aves migratorias.",
    fullDesc: "Un oasis de vida donde el desierto se encuentra con el mar. El Humedal de la desembocadura del Río Lluta es un Santuario de la Naturaleza de más de 300 hectáreas. Es un punto de descanso y alimentación crucial en la ruta migratoria de más de 160 especies de aves, incluyendo flamencos, patos jergón y gaviotas. Ofrece senderos planos y miradores de madera diseñados para observar la fauna sin perturbar el ecosistema, siendo un lugar perfecto para la fotografía y la conexión con la naturaleza.",
    directions: "Norte de Arica, por Ruta 5 o Av. Las Dunas. No hay micros directas. Solo taxi o auto particular.",
    hours: "Abierto todo el año · 08:00 - 18:30",
    phone: "", website: "", priceRange: "", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["taxi", "auto"], direccion: "norte", letrero: "No hay micros", parada: "Solo vehículo particular" }
  },
  {
    id: 6, icon: "TreePine", name: "Cuevas de Anzota", category: "Naturaleza", type: "turismo",
    lat: -18.5498, lng: -70.3312, color: "#6366F1", audioFile: "audios/CuevasDeAnzota_audio.mp3",
    shortDesc: "Sistema de grutas en acantilados, lobos marinos.",
    fullDesc: "Las Cuevas de Anzota ofrecen uno de los paisajes más dramáticos y hermosos de la región. Talladas durante milenios por el fuerte oleaje del océano contra los acantilados de la Cordillera de la Costa, estas cavernas naturales fueron utilizadas hace miles de años por la cultura Chinchorro. Hoy, un sendero interpretativo te permite caminar dentro de las grutas, observar la rica fauna marina (como lobos marinos y aves guaneras) y sentir la imponente fuerza de la naturaleza.",
    directions: "12 km al sur por Ruta 1. No hay micros. Solo taxi o auto particular.",
    hours: "Abierto todo el año · mejor con marea baja",
    phone: "", website: "", priceRange: "", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["taxi", "auto"], direccion: "sur", letrero: "No hay micros", parada: "Solo vehículo particular" }
  },
  {
    id: 7, icon: "Utensils", name: "Terminal Agropecuario ASOCAPEC", category: "Gastronomía", type: "gastronomia",
    lat: -18.4964, lng: -70.2861, color: "#C2714F", audioFile: "audios/terminal_audio.mp3",
    shortDesc: "Corazón gastronómico: aceitunas, frutas, tradición.",
    fullDesc: "Visitar el 'Agro' es sumergirse en una explosión de colores, aromas y sabores auténticos del norte de Chile. Este inmenso mercado es el punto neurálgico donde los agricultores de los valles de Azapa y Lluta traen sus mejores productos frescos. Aquí podrás degustar las famosas aceitunas de Azapa, frutas tropicales como mangos y maracuyá, y disfrutar de cocinerías tradicionales que ofrecen platos típicos a excelentes precios. Sus amplios pasillos facilitan el recorrido.",
    directions: "Entrada norte, Panamericana Norte. Micros que digan 'Agro' en el letrero: 12, 14, 8, 16, 113 (líneas naranja y roja).",
    hours: "Todos los días 06:00 - 18:00",
    phone: "", website: "", priceRange: "$", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["12", "14", "8", "16", "113"], direccion: "norte", letrero: "Agro", parada: "Terminal ASOCAPEC" }
  },
  {
    id: 8, icon: "Umbrella", name: "Playa Chinchorro", category: "Playa", type: "turismo",
    lat: -18.4630, lng: -70.3052, color: "#38BDF8", audioFile: "audios/chinchorro_audio.mp3",
    shortDesc: "Extensa playa de aguas cálidas, ideal para familias y caminatas.",
    fullDesc: "Playa Chinchorro es una de las playas más extensas y concurridas de Arica. Destaca por sus aguas inusualmente cálidas y su oleaje moderado, lo que la hace perfecta para la natación y para disfrutar en familia. Su amplia costanera está llena de vida, rodeada de palmeras, parques infantiles, heladerías y restaurantes, creando un ambiente vibrante tanto de día como de noche.",
    directions: "Sector norte de Arica, Av. Raúl Pey Casado. Toma micro 12 o 14 (letrero 'Centro/Mall' en ida), baja en España con Buenos Aires, camina 1 cuadra hacia el oeste.",
    hours: "Abierta todo el año · 24 horas",
    phone: "", website: "", priceRange: "", photos: [], is24h: true, isDefault: true,
    transport: { lineas: ["12", "14"], direccion: "norte", letrero: "Centro / Mall", parada: "España con Buenos Aires (luego caminar 1 cuadra)" }
  },
  {
    id: 9, icon: "Umbrella", name: "Playa Las Machas", category: "Playa", type: "turismo",
    lat: -18.4455, lng: -70.3038, color: "#0284C7", audioFile: "audios/machas_audios.mp3",
    shortDesc: "Playa de fuerte oleaje, el paraíso local del surf y bodyboard.",
    fullDesc: "Ubicada a continuación de Playa Chinchorro hacia el norte, Las Machas es conocida por sus fuertes corrientes, por lo que no es apta para el baño. Sin embargo, es un verdadero paraíso para los amantes de los deportes acuáticos como el surf, bodyboard y kitesurf. Su extensa arena oscura es también el lugar preferido para pescar, pasear mascotas y contemplar los espectaculares atardeceres ariqueños.",
    directions: "Extremo norte del borde costero, por Av. Las Dunas. Toma micro 12 o 14 (letrero 'Centro/Mall'), baja en Eliat con Av. España, camina 1 cuadra hacia el oeste (hacia el Pipo).",
    hours: "Abierta todo el año · 24 horas (No apta para baño)",
    phone: "", website: "", priceRange: "", photos: [], is24h: true, isDefault: true,
    transport: { lineas: ["12", "14"], direccion: "norte", letrero: "Centro / Mall", parada: "Eliat con Av. España (luego caminar 1 cuadra)" }
  },
  {
    id: 10, icon: "Umbrella", name: "Playa La Lisera", category: "Playa", type: "turismo",
    lat: -18.4933, lng: -70.3261, color: "#14B8A6", audioFile: "audios/lisera_audio.mp3",
    shortDesc: "Playa con forma de herradura, arena blanca y aguas sin olas.",
    fullDesc: "Playa La Lisera se caracteriza por su singular forma de herradura cerrada, la cual la protege de las corrientes oceánicas y la convierte en una gran piscina natural de aguas sumamente tranquilas. Es el lugar perfecto para ir con niños pequeños o practicar snorkel seguro. Cuenta con hermosas áreas verdes, arena blanca y caleta de pescadores cercana, siendo uno de los balnearios más tradicionales al sur del Morro.",
    directions: "Al sur de Playa El Laucho, continuando por Av. Comandante San Martín. Las mismas micros que van a El Laucho (12,14,10,8) te dejan cerca.",
    hours: "Abierta todo el año · 24 horas",
    phone: "", website: "", priceRange: "", photos: [], is24h: true, isDefault: true,
    transport: { lineas: ["12", "14", "10", "8"], direccion: "sur", letrero: "Centro / Mall", parada: "Av. Comandante San Martín" }
  },
  {
    id: 11, icon: "Map", name: "Ex Isla Alacrán", category: "Histórico", type: "turismo",
    lat: -18.4803, lng: -70.3324, color: "#475569", audioFile: "audios/alacran_audio.mp3",
    shortDesc: "Península histórica y sede de la famosa y peligrosa ola 'El Gringo'.",
    fullDesc: "Esta antigua isla fue unida artificialmente al continente en la década de 1960. La Ex Isla Alacrán es un monumento nacional que aún conserva restos del antiguo fuerte colonial San José. A nivel internacional, es famosa por la ola 'El Gringo' (o 'Flopos'), una ola tubular de nivel mundial que rompe peligrosamente sobre roca y que atrae a campeones mundiales de surf y bodyboard.",
    directions: "Frente al Morro de Arica, ingresando por el borde costero centro. Micros 12,14,8,10 (letrero 'Centro/Mall') te dejan en el borde costero, caminas hacia el Morro.",
    hours: "Abierta todo el año · 24 horas",
    phone: "", website: "", priceRange: "", photos: [], is24h: true, isDefault: true,
    transport: { lineas: ["12", "14", "8", "10"], direccion: "sur", letrero: "Centro / Mall", parada: "Borde Costero" }
  },
  {
    id: 12, icon: "Trophy", name: "Estadio Carlos Dittborn", category: "Deporte", type: "turismo",
    lat: -18.4871, lng: -70.2974, color: "#22C55E", audioFile: "audios/dittborn_audio.mp3",
    shortDesc: "Histórico estadio, sede del Mundial de 1962 y hogar del club San Marcos.",
    fullDesc: "El Estadio Mundialista Carlos Dittborn es un orgullo deportivo de la ciudad. Fue construido y modernizado para ser sede de la Copa Mundial de la FIFA en 1962, gesta que se logró bajo el histórico lema 'Porque no tenemos nada, queremos hacerlo todo'. Hoy en día, es el corazón del fútbol local, siendo la casa oficial del equipo San Marcos de Arica ('Los Bravos del Morro').",
    directions: "Av. 18 de Septiembre 2000, sector este de la ciudad. Micros 16, 8, 113 (bajan cerca). También 12 y 14 dejan en Av. 18 de Septiembre a unas cuadras.",
    hours: "Horario variable según eventos y partidos oficiales.",
    phone: "", website: "", priceRange: "", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["16", "8", "113", "12", "14"], direccion: "este", letrero: "18 de Septiembre / Estadio", parada: "Av. 18 de Septiembre" }
  },
  {
    id: 13, icon: "Landmark", name: "Museo del Mar", category: "Museo", type: "turismo",
    lat: -18.4791, lng: -70.3193, color: "#3B82F6", audioFile: "audios/museodelmar_audio.mp3",
    shortDesc: "Increíble colección de caracolas, fósiles y especies marinas.",
    fullDesc: "Ubicado en el pintoresco Pasaje Sangra, en pleno centro de la ciudad, el Museo del Mar de Arica exhibe una fascinante colección privada de más de 1.200 especies de caracolas marinas procedentes tanto de las costas de Chile como de diversas partes del mundo. Además de las conchas, el museo cuenta con acuarios y fósiles que enseñan a grandes y chicos sobre la increíble biodiversidad del Océano Pacífico.",
    directions: "Pasaje Sangra 315, a pasos de la calle peatonal 21 de Mayo. Cualquier micro con letrero 'Centro' te deja en 21 de Mayo, caminas al Pasaje Sangra.",
    hours: "Lunes a Sábado · 10:00 - 14:00 y 17:00 - 20:00",
    phone: "", website: "", priceRange: "", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "21 de Mayo" }
  },
  {
    id: 14, icon: "ShoppingBag", name: "Paseo 21 de Mayo", category: "Paseo", type: "turismo",
    lat: -18.4783, lng: -70.3188, color: "#EC4899", audioFile: "audios/21demayo_audio.mp3",
    shortDesc: "El corazón comercial y peatonal de Arica, ideal para pasear y comprar.",
    fullDesc: "La calle peatonal 21 de Mayo es el punto de encuentro por excelencia de la ciudad. A lo largo de sus cuadras sombreadas por modernos toldos, encontrarás una enorme variedad de tiendas, galerías comerciales, artesanías locales, cafeterías y restaurantes. Es el mejor lugar para comprar recuerdos, probar un helado, disfrutar de la música de los artistas callejeros o probar un pisco sour de maracuyá en alguna terraza.",
    directions: "Se extiende desde la calle Arturo Prat hasta los pies del Morro. Cualquier micro con letrero 'Centro' te deja cerca.",
    hours: "Comercio generalmente de 09:30 a 19:30",
    phone: "", website: "", priceRange: "", photos: [], is24h: false, isDefault: true,
    transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "21 de Mayo" }
  }
];
