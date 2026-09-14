/**
 * Datos GeoJSON y Capas Especiales para TuriArica
 * - Focos de luz (activos, apagados, mantenimiento, desconocido)
 * - Zonas iluminadas (polígonos de iluminación urbana)
 * - Vías de evacuación ante tsunami
 * - Puntos de encuentro oficiales / de apoyo
 * - Zonas de riesgo de inundación por tsunami (DEMOSTRACIÓN)
 * - Servicios de emergencia (Hospitales, Bomberos, Comisarías, Farmacias)
 * 
 * NOTA LEGAL OBLIGATORIA:
 * Los datos de riesgo, vías y focos son de carácter ilustrativo y demostrativo.
 * Para situaciones de emergencia real, siga siempre las instrucciones oficiales de
 * SENAPRED, SHOA, la Municipalidad de Arica, Carabineros y las sirenas de evacuación.
 */

export const DEMO_TAG = "DATOS DE DEMOSTRACIÓN — REEMPLAZAR POR DATOS OFICIALES";

// 1. Zonas de Riesgo / Inundación por Tsunami (Cota de seguridad ~30 msnm aproximada costera)
export const ZONAS_RIESGO_TSUNAMI = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "riesgo-costa-chinchorro",
        nombre: "Zona Costera Chinchorro - Las Machas",
        nivel_peligro: "Alto",
        descripcion: "Zona baja costera expuesta a inundación rápida en caso de tsunami mayor.",
        cota_maxima: "15 msnm",
        fuente: "SHOA / SENAPRED (Adaptación de referencia)",
        fecha_actualizacion: "2026-03-01",
        aviso: DEMO_TAG
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3250, -18.4350],
            [-70.3080, -18.4350],
            [-70.3090, -18.4600],
            [-70.3220, -18.4620],
            [-70.3290, -18.4480],
            [-70.3250, -18.4350]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "riesgo-puerto-centro",
        nombre: "Borde Costero Puerto y Centro Cívico",
        nivel_peligro: "Extremo",
        descripcion: "Sector portuario y costanera central por debajo de cota 30 metros.",
        cota_maxima: "10 msnm",
        fuente: "SHOA / SENAPRED (Adaptación de referencia)",
        fecha_actualizacion: "2026-03-01",
        aviso: DEMO_TAG
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3320, -18.4680],
            [-70.3200, -18.4690],
            [-70.3180, -18.4840],
            [-70.3280, -18.4870],
            [-70.3340, -18.4750],
            [-70.3320, -18.4680]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "riesgo-la-lisera-arenillas",
        nombre: "Sector Playas La Lisera y El Laucho",
        nivel_peligro: "Alto",
        descripcion: "Balnearios y costanera sur en zona de inundación directa.",
        cota_maxima: "12 msnm",
        fuente: "SHOA / SENAPRED (Adaptación de referencia)",
        fecha_actualizacion: "2026-03-01",
        aviso: DEMO_TAG
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3320, -18.4900],
            [-70.3240, -18.4910],
            [-70.3230, -18.5120],
            [-70.3330, -18.5120],
            [-70.3340, -18.5000],
            [-70.3320, -18.4900]
          ]
        ]
      }
    }
  ]
};

// 2. Vías de Evacuación ante Tsunami
export const VIAS_EVACUACION = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "via-01-general-velasquez",
        nombre: "Vía de Evacuación Av. General Velásquez",
        oficial: true,
        direccion: "Hacia Cota 30 msnm (Cerro La Cruz)",
        estado: "activa", // activa (verde), bloqueada (rojo), en_revision (amarillo)
        fuente: "Dirección de Tránsito Municipal / SENAPRED",
        fecha_actualizacion: "2026-02-15"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-70.3210, -18.4780],
          [-70.3150, -18.4770],
          [-70.3080, -18.4760],
          [-70.3010, -18.4750]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "via-02-diego-portales",
        nombre: "Vía de Evacuación Av. Diego Portales",
        oficial: true,
        direccion: "Desde Playa Chinchorro hacia Rotonda Tucapel",
        estado: "activa",
        fuente: "Dirección de Tránsito Municipal / SENAPRED",
        fecha_actualizacion: "2026-02-15"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-70.3140, -18.4620],
          [-70.3050, -18.4650],
          [-70.2980, -18.4680],
          [-70.2900, -18.4700]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "via-03-san-marcos-morro",
        nombre: "Subida al Morro por Calle Sotomayor",
        oficial: true,
        direccion: "Hacia Explanada del Morro (Cota de Seguridad)",
        estado: "activa",
        fuente: "SENAPRED Arica",
        fecha_actualizacion: "2026-01-20"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-70.3200, -18.4790],
          [-70.3220, -18.4810],
          [-70.3235, -18.4830],
          [-70.3248, -18.4855]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "via-04-costanera-norte-obras",
        nombre: "Paso Peatonal Raúl Pey",
        oficial: false,
        direccion: "Hacia Av. Antártica",
        estado: "en_revision", // amarillo
        fuente: "MOP Obras Portuarias (Trabajos de mantención)",
        fecha_actualizacion: "2026-02-28"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-70.3180, -18.4500],
          [-70.3130, -18.4510],
          [-70.3080, -18.4520]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "via-05-antartica-temporal",
        nombre: "Acceso Muelle Prat",
        oficial: false,
        direccion: "Zona Portuaria Sur",
        estado: "bloqueada", // rojo
        fuente: "Capitanía de Puerto Arica",
        fecha_actualizacion: "2026-03-05"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-70.3260, -18.4740],
          [-70.3240, -18.4750]
        ]
      }
    }
  ]
};

// 3. Puntos de Encuentro Oficiales (Zonas Seguras sobre Cota 30 msnm)
export const PUNTOS_ENCUENTRO = [
  {
    id: "pe-01-morro",
    nombre: "Punto Seguro Cima del Morro de Arica",
    lat: -18.4862,
    lng: -70.3255,
    cota: "139 msnm",
    oficial: true,
    capacidad: "5.000 personas",
    descripcion: "Cima del Morro histórica, punto de máxima seguridad con helipuerto y amplias explanadas.",
    direccion: "Camino al Morro s/n",
    fuente: "Municipalidad de Arica / SENAPRED",
    fecha_actualizacion: "2026-01-15"
  },
  {
    id: "pe-02-estadio-carlos-dittborn",
    nombre: "Estadio Carlos Dittborn (Zona Alta)",
    lat: -18.4735,
    lng: -70.2980,
    cota: "45 msnm",
    oficial: true,
    capacidad: "12.000 personas",
    descripcion: "Complejo deportivo municipal, punto seguro de reunión y albergue primario.",
    direccion: "Av. 18 de Septiembre 2000",
    fuente: "SENAPRED / DIDECO",
    fecha_actualizacion: "2026-01-15"
  },
  {
    id: "pe-03-rotonda-azapa",
    nombre: "Rotonda Manuel Castillo (Acceso Azapa)",
    lat: -18.4880,
    lng: -70.2920,
    cota: "55 msnm",
    oficial: true,
    capacidad: "3.500 personas",
    descripcion: "Punto de encuentro alto con conexión abierta hacia el Valle de Azapa.",
    direccion: "Av. Diego Portales con Azapa",
    fuente: "SENAPRED Región de Arica y Parinacota",
    fecha_actualizacion: "2026-02-01"
  },
  {
    id: "pe-04-parque-vicuna-mackenna-alto",
    nombre: "Cerro La Cruz (Plaza Mirador)",
    lat: -18.4815,
    lng: -70.3120,
    cota: "40 msnm",
    oficial: true,
    capacidad: "2.000 personas",
    descripcion: "Zona segura elevada a 5 minutos a pie desde el centro histórico.",
    direccion: "Mirador Cerro La Cruz",
    fuente: "Plan Comunal de Evacuación",
    fecha_actualizacion: "2026-02-01"
  },
  {
    id: "pe-05-villa-frontera",
    nombre: "Punto de Encuentro Villa Frontera (Norte)",
    lat: -18.4200,
    lng: -70.3050,
    cota: "35 msnm",
    oficial: true,
    capacidad: "1.500 personas",
    descripcion: "Zona segura para pobladores y turistas del sector norte y desembocadura Lluta.",
    direccion: "Ruta 5 Norte km 2070",
    fuente: "SENAPRED Arica",
    fecha_actualizacion: "2026-02-10"
  }
];

// 4. Red de Alumbrado Público y Focos de Luz
// Intensidades: 1 (baja/peatonal), 2 (media/avenida), 3 (alta/foco LED masivo)
export const FOCOS_DE_LUZ = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "foco-01",
        nombre: "Luminaria LED Paseo 21 de Mayo",
        estado: "activo", // activo, apagado, mantenimiento, desconocido
        intensidad: 3,
        tipo_lampara: "LED Solar 150W",
        radio_iluminacion: 45, // metros aproximados
        ultima_revision: "2026-02-20",
        fuente: "Dpto. Alumbrado Municipalidad de Arica",
        fecha_actualizacion: "2026-03-01"
      },
      geometry: { type: "Point", coordinates: [-70.3195, -18.4778] }
    },
    {
      type: "Feature",
      properties: {
        id: "foco-02",
        nombre: "Torre de Iluminación Plaza Colón",
        estado: "activo",
        intensidad: 3,
        tipo_lampara: "Reflector Haluro 400W",
        radio_iluminacion: 60,
        ultima_revision: "2026-02-25",
        fuente: "Dpto. Alumbrado Municipalidad de Arica",
        fecha_actualizacion: "2026-03-01"
      },
      geometry: { type: "Point", coordinates: [-70.3205, -18.4792] }
    },
    {
      type: "Feature",
      properties: {
        id: "foco-03",
        nombre: "Poste Peatonal Parque Vicuña Mackenna",
        estado: "activo",
        intensidad: 2,
        tipo_lampara: "LED Cálido 100W",
        radio_iluminacion: 35,
        ultima_revision: "2026-02-18",
        fuente: "Dpto. Alumbrado Municipalidad de Arica",
        fecha_actualizacion: "2026-03-01"
      },
      geometry: { type: "Point", coordinates: [-70.3218, -18.4805] }
    },
    {
      type: "Feature",
      properties: {
        id: "foco-04",
        nombre: "Luminaria Costanera Comandante San Martín",
        estado: "mantenimiento", // naranja
        intensidad: 2,
        tipo_lampara: "LED 120W",
        radio_iluminacion: 25,
        ultima_revision: "2026-03-05",
        fuente: "CGE Distribución / Mantención",
        fecha_actualizacion: "2026-03-06"
      },
      geometry: { type: "Point", coordinates: [-70.3235, -18.4830] }
    },
    {
      type: "Feature",
      properties: {
        id: "foco-05",
        nombre: "Foco Balneario El Laucho",
        estado: "activo",
        intensidad: 3,
        tipo_lampara: "LED Marino Antisalino 200W",
        radio_iluminacion: 55,
        ultima_revision: "2026-02-28",
        fuente: "Municipalidad de Arica",
        fecha_actualizacion: "2026-03-01"
      },
      geometry: { type: "Point", coordinates: [-70.3275, -18.4935] }
    },
    {
      type: "Feature",
      properties: {
        id: "foco-06",
        nombre: "Poste Curva La Lisera",
        estado: "apagado", // gris / rojo oscuro
        intensidad: 1,
        tipo_lampara: "Sodio 70W",
        radio_iluminacion: 0,
        ultima_revision: "2026-03-08",
        fuente: "Reporte Vecinal #4412",
        fecha_actualizacion: "2026-03-09"
      },
      geometry: { type: "Point", coordinates: [-70.3305, -18.5020] }
    },
    {
      type: "Feature",
      properties: {
        id: "foco-07",
        nombre: "Torre Borde Costero Chinchorro Sur",
        estado: "activo",
        intensidad: 3,
        tipo_lampara: "Focos LED 300W",
        radio_iluminacion: 65,
        ultima_revision: "2026-02-22",
        fuente: "Capitanía de Puerto / Municipalidad",
        fecha_actualizacion: "2026-03-01"
      },
      geometry: { type: "Point", coordinates: [-70.3160, -18.4550] }
    },
    {
      type: "Feature",
      properties: {
        id: "foco-08",
        nombre: "Luminaria Av. Diego Portales / Terminal",
        estado: "desconocido", // azul grisáceo
        intensidad: 2,
        tipo_lampara: "LED Estándar",
        radio_iluminacion: 20,
        ultima_revision: "2025-12-10",
        fuente: "Censo Lumínico Preliminar",
        fecha_actualizacion: "2026-01-05"
      },
      geometry: { type: "Point", coordinates: [-70.3080, -18.4630] }
    }
  ]
};

// 5. Polígonos de Sectores Iluminados (Zonas Iluminadas)
export const ZONAS_ILUMINADAS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "zona-ilum-centro-historico",
        nombre: "Paseo Peatonal 21 de Mayo y Paseo Bolognesi",
        nivel_iluminacion: "alta", // alta, media, baja, desconocida
        horario_inicio: "19:30",
        horario_fin: "06:30",
        fuente: "Municipalidad de Arica - Seguridad Ciudadana",
        fecha_actualizacion: "2026-02-20"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3210, -18.4765],
            [-70.3175, -18.4768],
            [-70.3180, -18.4800],
            [-70.3215, -18.4795],
            [-70.3210, -18.4765]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zona-ilum-paseo-el-laucho",
        nombre: "Bulevar y Costanera El Laucho",
        nivel_iluminacion: "alta",
        horario_inicio: "19:00",
        horario_fin: "06:00",
        fuente: "Concesión Balneario El Laucho",
        fecha_actualizacion: "2026-02-15"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3285, -18.4910],
            [-70.3255, -18.4915],
            [-70.3265, -18.4960],
            [-70.3295, -18.4955],
            [-70.3285, -18.4910]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zona-ilum-costanera-chinchorro",
        nombre: "Ciclovía y Borde Playa Chinchorro",
        nivel_iluminacion: "media",
        horario_inicio: "19:45",
        horario_fin: "05:45",
        fuente: "Municipalidad de Arica",
        fecha_actualizacion: "2026-02-10"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3185, -18.4520],
            [-70.3140, -18.4525],
            [-70.3150, -18.4610],
            [-70.3195, -18.4600],
            [-70.3185, -18.4520]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "zona-ilum-morro-explanada",
        nombre: "Mirador Cima del Morro de Arica",
        nivel_iluminacion: "alta",
        horario_inicio: "19:00",
        horario_fin: "07:00",
        fuente: "Ejército de Chile / Sernatur",
        fecha_actualizacion: "2026-01-20"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-70.3270, -18.4845],
            [-70.3235, -18.4848],
            [-70.3245, -18.4880],
            [-70.3280, -18.4875],
            [-70.3270, -18.4845]
          ]
        ]
      }
    }
  ]
};

// 6. Servicios Críticos y de Emergencia (Salud, Comisarías, Bomberos, Farmacias de Turno)
export const SERVICIOS_EMERGENCIA = [
  {
    id: "emerg-01-hospital",
    nombre: "Hospital Regional de Arica Dr. Juan Noé Crevani",
    categoria: "Hospitales",
    tipo: "emergencia",
    telefono: "+56 58 220 4000 / 131 (SAMU)",
    direccion: "18 de Septiembre 1000, Arica",
    horario: "Urgencias 24 horas",
    lat: -18.4772,
    lng: -70.3060,
    oficial: true,
    fuente: "Servicio de Salud Arica (SSA)",
    fecha_actualizacion: "2026-01-10"
  },
  {
    id: "emerg-02-sar-iris-veliz",
    nombre: "SAR Dra. Iris Véliz Hume (Centro de Salud de Alta Resolutividad)",
    categoria: "Centros de Salud",
    tipo: "emergencia",
    telefono: "+56 58 238 6800",
    direccion: "Barros Luco 2345, Arica",
    horario: "Atención de urgencia 17:00 a 08:00 (Fines de semana 24h)",
    lat: -18.4680,
    lng: -70.2915,
    oficial: true,
    fuente: "DESAMU Arica",
    fecha_actualizacion: "2026-01-10"
  },
  {
    id: "emerg-03-carabineros-1ra",
    nombre: "1ª Comisaría de Carabineros Arica",
    categoria: "Comisarías",
    tipo: "emergencia",
    telefono: "133 / +56 58 258 4000",
    direccion: "Alberdi 850, Arica",
    horario: "24 horas",
    lat: -18.4760,
    lng: -70.3150,
    oficial: true,
    fuente: "Carabineros de Chile - XV Zona",
    fecha_actualizacion: "2026-01-10"
  },
  {
    id: "emerg-04-carabineros-3ra",
    nombre: "3ª Comisaría de Carabineros Arica (Norte)",
    categoria: "Comisarías",
    tipo: "emergencia",
    telefono: "133 / +56 58 258 4120",
    direccion: "Av. Santa María 2250, Arica",
    horario: "24 horas",
    lat: -18.4610,
    lng: -70.3010,
    oficial: true,
    fuente: "Carabineros de Chile - XV Zona",
    fecha_actualizacion: "2026-01-10"
  },
  {
    id: "emerg-05-bomberos-1ra",
    nombre: "Cuerpo de Bomberos de Arica - 1ª Compañía 'O'Higgins'",
    categoria: "Bomberos",
    tipo: "emergencia",
    telefono: "132 / +56 58 223 1111",
    direccion: "Sotomayor 345, Centro",
    horario: "Guardia activa 24 horas",
    lat: -18.4785,
    lng: -70.3185,
    oficial: true,
    fuente: "Junta Nacional de Cuerpos de Bomberos",
    fecha_actualizacion: "2026-01-10"
  },
  {
    id: "emerg-06-bomberos-3ra",
    nombre: "Cuerpo de Bomberos de Arica - 3ª Compañía",
    categoria: "Bomberos",
    tipo: "emergencia",
    telefono: "132 / +56 58 222 2222",
    direccion: "Av. Loa con Conrado Ríos",
    horario: "Guardia activa 24 horas",
    lat: -18.4710,
    lng: -70.3015,
    oficial: true,
    fuente: "Junta Nacional de Cuerpos de Bomberos",
    fecha_actualizacion: "2026-01-10"
  },
  {
    id: "emerg-07-farmacia-turno-centro",
    nombre: "Farmacia Ahumada (Turno Permanente)",
    categoria: "Farmacias",
    tipo: "servicio",
    telefono: "+56 600 222 4000",
    direccion: "Paseo 21 de Mayo 398, Centro",
    horario: "Turno oficial 24 horas",
    lat: -18.4777,
    lng: -70.3182,
    oficial: true,
    fuente: "SEREMI de Salud Arica y Parinacota",
    fecha_actualizacion: "2026-03-01"
  },
  {
    id: "emerg-08-farmacia-cruz-verde",
    nombre: "Farmacia Cruz Verde Rotonda",
    categoria: "Farmacias",
    tipo: "servicio",
    telefono: "+56 800 802 800",
    direccion: "Av. Diego Portales 1200",
    horario: "08:30 a 22:00",
    lat: -18.4650,
    lng: -70.3040,
    oficial: true,
    fuente: "SEREMI de Salud Arica y Parinacota",
    fecha_actualizacion: "2026-03-01"
  }
];

// Helper para sanitizar strings y prevenir ataques XSS al renderizar texto dinámico
export function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================
// 6. LÍNEAS DE TRANSPORTE PÚBLICO (MICROS & COLECTIVOS DE ARICA)
// ============================================================
export const LINEAS_TRANSPORTE_PUBLICO = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "linea-micro-12",
        nombre: "Línea 12 (Saucache - Chinchorro)",
        tipo: "micro",
        numero: "12",
        color: "#0284c7",
        tarifa: "$500 adulto / $160 estudiante",
        horario: "06:00 a 23:00",
        frecuencia: "Cada 8-10 min",
        paradas: [
          { id: "p1", nombre: "Terminal Asoagro", lat: -18.5020, lng: -70.2950 },
          { id: "p2", nombre: "Campus Saucache UTA", lat: -18.4900, lng: -70.2980 },
          { id: "p3", nombre: "Rotonda Tucapel", lat: -18.4680, lng: -70.3010 },
          { id: "p4", nombre: "Costanera Las Machas", lat: -18.4480, lng: -70.3150 }
        ]
      },
      geometry: {
        type: "LineString",
        coordinates: [[-70.295241,-18.500587],[-70.295546,-18.500333],[-70.295615,-18.50027],[-70.295935,-18.499976],[-70.296237,-18.499698],[-70.296391,-18.499559],[-70.296464,-18.499497],[-70.296536,-18.499442],[-70.296597,-18.4994],[-70.296662,-18.49936],[-70.296718,-18.499327],[-70.296367,-18.498733],[-70.296131,-18.498335],[-70.296106,-18.498292],[-70.296091,-18.498267],[-70.295797,-18.497769],[-70.295567,-18.49738],[-70.295357,-18.497025],[-70.295162,-18.496695],[-70.295149,-18.496658],[-70.295145,-18.496619],[-70.295147,-18.496583],[-70.295156,-18.496549],[-70.295195,-18.496445],[-70.295249,-18.496301],[-70.295533,-18.495543],[-70.295702,-18.495093],[-70.29583,-18.494751],[-70.295851,-18.494679],[-70.295866,-18.494623],[-70.295874,-18.494562],[-70.295878,-18.494503],[-70.295877,-18.49445],[-70.295865,-18.494354],[-70.295852,-18.494261],[-70.295833,-18.494186],[-70.295808,-18.494122],[-70.295784,-18.494074],[-70.295744,-18.494011],[-70.295411,-18.493497],[-70.295341,-18.493389],[-70.295432,-18.493377],[-70.295688,-18.493346],[-70.295816,-18.493329],[-70.295937,-18.493309],[-70.296041,-18.493289],[-70.296157,-18.493259],[-70.296273,-18.493225],[-70.296408,-18.493179],[-70.296532,-18.493133],[-70.296641,-18.493083],[-70.296733,-18.493034],[-70.296863,-18.492956],[-70.296904,-18.492935],[-70.296943,-18.492907],[-70.297456,-18.492556],[-70.297502,-18.492526],[-70.298344,-18.491937],[-70.298308,-18.491884],[-70.29805,-18.491509],[-70.297818,-18.491171],[-70.297462,-18.490653],[-70.29731,-18.490432],[-70.297755,-18.490155],[-70.297998,-18.489998],[-70.298232,-18.489847],[-70.297938,-18.489414],[-70.298552,-18.489231],[-70.29861,-18.489214],[-70.298541,-18.489122],[-70.298254,-18.488717],[-70.297274,-18.487294],[-70.297132,-18.487119],[-70.297001,-18.486994],[-70.296967,-18.486962],[-70.296905,-18.486871],[-70.296855,-18.486786],[-70.296817,-18.486716],[-70.296774,-18.486626],[-70.296754,-18.486559],[-70.296741,-18.486498],[-70.296737,-18.486412],[-70.296732,-18.486301],[-70.296788,-18.486142],[-70.296787,-18.48606],[-70.296776,-18.485865],[-70.296745,-18.485294],[-70.296709,-18.484609],[-70.296706,-18.48455],[-70.296674,-18.483892],[-70.296669,-18.483801],[-70.296648,-18.483366],[-70.296632,-18.483032],[-70.296618,-18.482751],[-70.296611,-18.482583],[-70.296609,-18.482525],[-70.296603,-18.482467],[-70.296593,-18.482397],[-70.296583,-18.482325],[-70.296549,-18.482176],[-70.296539,-18.482119],[-70.296504,-18.482056],[-70.296463,-18.481997],[-70.296415,-18.481942],[-70.296361,-18.481892],[-70.296302,-18.481848],[-70.296238,-18.48181],[-70.29617,-18.48178],[-70.296147,-18.481776],[-70.296093,-18.481762],[-70.296043,-18.48174],[-70.296013,-18.481721],[-70.295985,-18.4817],[-70.29596,-18.481676],[-70.295938,-18.48165],[-70.295918,-18.481621],[-70.295902,-18.481591],[-70.29589,-18.48156],[-70.29588,-18.481527],[-70.295875,-18.481494],[-70.295873,-18.481459],[-70.295875,-18.481425],[-70.29588,-18.4814],[-70.295888,-18.481367],[-70.295901,-18.481335],[-70.295916,-18.481305],[-70.295936,-18.481276],[-70.295958,-18.481249],[-70.295983,-18.481225],[-70.296011,-18.481203],[-70.29604,-18.481185],[-70.296072,-18.481169],[-70.296106,-18.481157],[-70.29614,-18.481148],[-70.296182,-18.481142],[-70.296227,-18.4811],[-70.296255,-18.481076],[-70.296286,-18.48104],[-70.296323,-18.480994],[-70.296555,-18.480702],[-70.296945,-18.480206],[-70.297012,-18.480131],[-70.297054,-18.480087],[-70.29709,-18.480054],[-70.297177,-18.479974],[-70.297406,-18.47969],[-70.297641,-18.479396],[-70.297877,-18.479103],[-70.298131,-18.478787],[-70.298182,-18.478724],[-70.298413,-18.478435],[-70.298657,-18.47813],[-70.298897,-18.477831],[-70.299116,-18.477558],[-70.299381,-18.477227],[-70.299434,-18.477129],[-70.29948,-18.477047],[-70.299701,-18.476783],[-70.300014,-18.476396],[-70.300159,-18.476226],[-70.300385,-18.475966],[-70.300447,-18.475883],[-70.300496,-18.475821],[-70.300536,-18.475778],[-70.300606,-18.475706],[-70.300732,-18.47561],[-70.300818,-18.475546],[-70.301654,-18.474904],[-70.302215,-18.474445],[-70.30229,-18.474378],[-70.302347,-18.474328],[-70.302647,-18.474064],[-70.302747,-18.473976],[-70.302706,-18.473929],[-70.302552,-18.473752],[-70.302531,-18.473728],[-70.302286,-18.473447],[-70.302233,-18.473386],[-70.30198,-18.473095],[-70.30173,-18.472808],[-70.301681,-18.472752],[-70.301481,-18.472521],[-70.301439,-18.472473],[-70.301227,-18.472229],[-70.301152,-18.472143],[-70.300873,-18.471823],[-70.300787,-18.471724],[-70.300588,-18.471495],[-70.300526,-18.471425],[-70.300342,-18.471213],[-70.30031,-18.471176],[-70.300021,-18.470844],[-70.300318,-18.470611],[-70.30056,-18.470418],[-70.301129,-18.469964],[-70.300939,-18.469747],[-70.30002,-18.468694],[-70.300965,-18.467959],[-70.301698,-18.467389],[-70.301352,-18.467004],[-70.300704,-18.466283],[-70.300764,-18.466236],[-70.300822,-18.466191],[-70.300079,-18.465323],[-70.299949,-18.465174],[-70.299119,-18.464214],[-70.29838,-18.463356],[-70.297921,-18.462833],[-70.297667,-18.462545],[-70.297447,-18.462289],[-70.296921,-18.461733],[-70.296725,-18.461519],[-70.296699,-18.461489],[-70.296459,-18.461222],[-70.296106,-18.460794],[-70.296063,-18.460742],[-70.295997,-18.46065],[-70.29565,-18.460234],[-70.295459,-18.45997],[-70.295375,-18.459836],[-70.295307,-18.459722],[-70.295231,-18.459594],[-70.295182,-18.4595],[-70.295138,-18.459404],[-70.2951,-18.459306],[-70.295067,-18.459206],[-70.295036,-18.459087],[-70.295013,-18.458967],[-70.294998,-18.458845],[-70.294979,-18.458568],[-70.294978,-18.458432],[-70.294978,-18.458313],[-70.294979,-18.457754],[-70.294981,-18.455816],[-70.294969,-18.455458],[-70.294972,-18.455364],[-70.294966,-18.455166],[-70.294978,-18.454467],[-70.294983,-18.454036],[-70.294986,-18.453809],[-70.294994,-18.453222],[-70.294995,-18.453148],[-70.294994,-18.45313],[-70.294998,-18.453099],[-70.295008,-18.453069],[-70.295024,-18.453042],[-70.295046,-18.453016],[-70.295073,-18.452994],[-70.2951,-18.452979],[-70.295198,-18.452961],[-70.296541,-18.452633],[-70.296606,-18.452618],[-70.296764,-18.45258],[-70.298399,-18.452183],[-70.2987,-18.452112],[-70.298786,-18.45209],[-70.299553,-18.451897],[-70.299813,-18.45184],[-70.299935,-18.451813],[-70.300016,-18.451795],[-70.300123,-18.451768],[-70.300354,-18.451709],[-70.300985,-18.451539],[-70.301279,-18.451438],[-70.301542,-18.451276],[-70.301754,-18.451119],[-70.301813,-18.451073],[-70.301843,-18.451013],[-70.301909,-18.450872],[-70.301916,-18.450801],[-70.301944,-18.450534],[-70.302057,-18.449344],[-70.30217,-18.448168],[-70.302303,-18.447148],[-70.302416,-18.446197],[-70.302457,-18.446162]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "linea-micro-07",
        nombre: "Línea 7 (Cerro La Cruz - Puerto)",
        tipo: "micro",
        numero: "7",
        color: "#f97316",
        tarifa: "$500 adulto",
        horario: "06:30 a 22:30",
        frecuencia: "Cada 12 min",
        paradas: [
          { id: "p1", nombre: "Mirador Cerro La Cruz", lat: -18.4850, lng: -70.3080 },
          { id: "p2", nombre: "Av. Santa María", lat: -18.4790, lng: -70.3140 },
          { id: "p3", nombre: "Paseo 21 de Mayo (Centro)", lat: -18.4770, lng: -70.3180 },
          { id: "p4", nombre: "Puerto de Arica", lat: -18.4760, lng: -70.3240 }
        ]
      },
      geometry: {
        type: "LineString",
        coordinates: [[-70.307966,-18.484824],[-70.309617,-18.484533],[-70.309638,-18.484528],[-70.309657,-18.484516],[-70.309669,-18.484501],[-70.309675,-18.484483],[-70.309675,-18.484467],[-70.309668,-18.484447],[-70.309439,-18.483832],[-70.30942,-18.48378],[-70.309911,-18.483674],[-70.309936,-18.48367],[-70.310298,-18.483611],[-70.31033,-18.483599],[-70.310362,-18.483587],[-70.310623,-18.483362],[-70.310966,-18.483063],[-70.311,-18.483034],[-70.311668,-18.482493],[-70.311629,-18.482451],[-70.310861,-18.481621],[-70.31083,-18.481588],[-70.311667,-18.480956],[-70.311729,-18.480906],[-70.312445,-18.480354],[-70.312475,-18.480331],[-70.31283,-18.480061],[-70.313154,-18.479814],[-70.313201,-18.479778],[-70.313232,-18.479755],[-70.313455,-18.479594],[-70.3139,-18.479247],[-70.313924,-18.479228],[-70.31397,-18.479192],[-70.314087,-18.479103],[-70.314292,-18.478947],[-70.314614,-18.478702],[-70.314661,-18.478667],[-70.313982,-18.477931],[-70.313937,-18.477882],[-70.31386,-18.477799],[-70.313404,-18.477305],[-70.313359,-18.477257],[-70.313399,-18.477221],[-70.313842,-18.476824],[-70.313878,-18.476792],[-70.31466,-18.476093],[-70.3147,-18.476057],[-70.31522,-18.475592],[-70.315259,-18.475558],[-70.315309,-18.475513],[-70.31558,-18.475271],[-70.315693,-18.475169],[-70.315749,-18.475119],[-70.315811,-18.475064],[-70.315819,-18.475047],[-70.315827,-18.475034],[-70.315832,-18.475028],[-70.315837,-18.475023],[-70.315844,-18.475017],[-70.315854,-18.47501],[-70.315869,-18.475001],[-70.315883,-18.474996],[-70.315908,-18.474993],[-70.31592,-18.474993],[-70.316245,-18.474843],[-70.316584,-18.474488],[-70.316721,-18.474348],[-70.316808,-18.474264],[-70.316897,-18.474344],[-70.317096,-18.474533],[-70.317307,-18.474731],[-70.317426,-18.474843],[-70.317646,-18.475049],[-70.317994,-18.475368],[-70.318705,-18.476017],[-70.318274,-18.47653],[-70.318241,-18.47657],[-70.31792,-18.476937],[-70.31756,-18.477349],[-70.318188,-18.477844],[-70.318282,-18.477917],[-70.318494,-18.478082],[-70.318889,-18.47839],[-70.319736,-18.479052],[-70.32008,-18.479352],[-70.320119,-18.479382],[-70.320667,-18.478705],[-70.320682,-18.478684],[-70.320712,-18.478644],[-70.320744,-18.478601],[-70.320898,-18.478397],[-70.321041,-18.478207],[-70.321243,-18.478004],[-70.321693,-18.477528],[-70.321809,-18.47741],[-70.321908,-18.477308],[-70.322037,-18.477181],[-70.322081,-18.477224],[-70.322297,-18.477439],[-70.322576,-18.477663],[-70.322602,-18.477686],[-70.323079,-18.478026],[-70.323291,-18.478162],[-70.323415,-18.478224],[-70.324149,-18.478552],[-70.32479,-18.478824],[-70.324826,-18.478753],[-70.32485,-18.478715],[-70.324898,-18.478637],[-70.324964,-18.478501],[-70.324984,-18.478428],[-70.325004,-18.478327],[-70.325034,-18.478143],[-70.325072,-18.477964],[-70.325102,-18.477823],[-70.325136,-18.477351]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "linea-colectivo-01",
        nombre: "Colectivo Línea 1 (Azapa - Centro)",
        tipo: "colectivo",
        numero: "1",
        color: "#10b981",
        tarifa: "$800 general",
        horario: "06:00 a 00:00",
        frecuencia: "Salida continua",
        paradas: [
          { id: "p1", nombre: "Acceso Valle de Azapa (Km 1)", lat: -18.5100, lng: -70.2850 },
          { id: "p2", nombre: "Rotonda Manuel Castillo", lat: -18.4950, lng: -70.2970 },
          { id: "p3", nombre: "Paseo 21 de Mayo", lat: -18.4780, lng: -70.3170 }
        ]
      },
      geometry: {
        type: "LineString",
        coordinates: [[-70.280981,-18.510753],[-70.280009,-18.509961],[-70.279957,-18.50993],[-70.27888,-18.509863],[-70.279323,-18.509366],[-70.279064,-18.50932],[-70.278828,-18.509275],[-70.278669,-18.509239],[-70.278577,-18.50915],[-70.278844,-18.508918],[-70.279255,-18.50856],[-70.280312,-18.507639],[-70.28055,-18.507421],[-70.280714,-18.507268],[-70.28087,-18.507113],[-70.281046,-18.506929],[-70.281167,-18.506796],[-70.28128,-18.506666],[-70.281398,-18.506525],[-70.281511,-18.506383],[-70.28162,-18.506241],[-70.281745,-18.506069],[-70.281849,-18.505918],[-70.281964,-18.505744],[-70.282074,-18.505566],[-70.282163,-18.505415],[-70.282241,-18.505277],[-70.282804,-18.504225],[-70.28322,-18.503444],[-70.285183,-18.49976],[-70.285228,-18.499676],[-70.285248,-18.499638],[-70.285776,-18.498649],[-70.285802,-18.498601],[-70.28681,-18.496718],[-70.287,-18.496349],[-70.287211,-18.495958],[-70.287263,-18.49586],[-70.287831,-18.494802],[-70.287977,-18.494529],[-70.288323,-18.493885],[-70.28838,-18.493781],[-70.288389,-18.493761],[-70.288484,-18.493585],[-70.288578,-18.493411],[-70.28864,-18.49329],[-70.288693,-18.493176],[-70.288748,-18.493045],[-70.288767,-18.492984],[-70.28879,-18.492902],[-70.288805,-18.492832],[-70.288827,-18.492716],[-70.288842,-18.492614],[-70.288851,-18.49251],[-70.288855,-18.492399],[-70.288853,-18.492279],[-70.288848,-18.492171],[-70.288823,-18.491955],[-70.288811,-18.491896],[-70.288805,-18.491836],[-70.288805,-18.491775],[-70.288812,-18.491715],[-70.288826,-18.491656],[-70.288846,-18.491599],[-70.288872,-18.491544],[-70.288904,-18.491492],[-70.288941,-18.491443],[-70.288983,-18.491398],[-70.28903,-18.491357],[-70.289082,-18.491321],[-70.289136,-18.491291],[-70.289194,-18.491266],[-70.289254,-18.491246],[-70.289321,-18.491232],[-70.289403,-18.491224],[-70.289485,-18.491227],[-70.289566,-18.49124],[-70.289645,-18.491263],[-70.28972,-18.491296],[-70.289789,-18.491338],[-70.289852,-18.491388],[-70.289907,-18.491446],[-70.289954,-18.49151],[-70.289991,-18.49158],[-70.290008,-18.491621],[-70.290022,-18.491664],[-70.290096,-18.491793],[-70.290153,-18.491891],[-70.290197,-18.491959],[-70.290246,-18.492024],[-70.290299,-18.492085],[-70.290354,-18.492142],[-70.290414,-18.492197],[-70.290476,-18.492248],[-70.290542,-18.492295],[-70.290629,-18.492349],[-70.290721,-18.492397],[-70.290808,-18.492432],[-70.292628,-18.493033],[-70.292687,-18.493053],[-70.293499,-18.493327],[-70.293942,-18.493426],[-70.294254,-18.493464],[-70.294393,-18.493469],[-70.294517,-18.49347],[-70.294667,-18.493465],[-70.294779,-18.493458],[-70.294939,-18.493441],[-70.295255,-18.4934],[-70.295341,-18.493389],[-70.295411,-18.493497],[-70.295744,-18.494011],[-70.295784,-18.494074],[-70.295808,-18.494122],[-70.295833,-18.494186],[-70.295852,-18.494261],[-70.295865,-18.494354],[-70.295989,-18.494276],[-70.296211,-18.494136],[-70.296348,-18.494065],[-70.296456,-18.49407],[-70.296551,-18.49408],[-70.296626,-18.494132],[-70.296738,-18.494266],[-70.297131,-18.494778],[-70.297166,-18.494905],[-70.29713,-18.495097],[-70.296627,-18.4954],[-70.296494,-18.495223],[-70.296953,-18.494923],[-70.296947,-18.494927],[-70.296494,-18.495223],[-70.296627,-18.4954],[-70.29713,-18.495097],[-70.297166,-18.494905],[-70.297598,-18.494593],[-70.297943,-18.494362],[-70.298016,-18.494324],[-70.297726,-18.493963],[-70.29734,-18.49348],[-70.297309,-18.493442],[-70.296997,-18.493052],[-70.296974,-18.493024],[-70.296904,-18.492935],[-70.296943,-18.492907],[-70.297456,-18.492556],[-70.297502,-18.492526],[-70.298344,-18.491937],[-70.298391,-18.491898],[-70.298937,-18.491481],[-70.299397,-18.491064],[-70.299678,-18.490795],[-70.299847,-18.49064],[-70.299953,-18.490564],[-70.300065,-18.4905],[-70.300118,-18.490468],[-70.300174,-18.490439],[-70.300222,-18.490418],[-70.300272,-18.4904],[-70.300349,-18.490388],[-70.300479,-18.490368],[-70.300688,-18.490369],[-70.301007,-18.490392],[-70.301194,-18.490392],[-70.301404,-18.490369],[-70.301595,-18.490342],[-70.301768,-18.490303],[-70.302104,-18.490232],[-70.30221,-18.490212],[-70.302404,-18.490172],[-70.302627,-18.490109],[-70.302818,-18.490034],[-70.303034,-18.489914],[-70.303122,-18.489856],[-70.303196,-18.489792],[-70.303408,-18.489628],[-70.303542,-18.489609],[-70.303956,-18.489286],[-70.304457,-18.488928],[-70.304529,-18.488866],[-70.304595,-18.488797],[-70.304652,-18.488726],[-70.304702,-18.488649],[-70.304915,-18.488286],[-70.30498,-18.488192],[-70.305054,-18.488102],[-70.305135,-18.488019],[-70.305221,-18.487943],[-70.305313,-18.487874],[-70.30541,-18.487812],[-70.30586,-18.487559],[-70.306181,-18.487265],[-70.306279,-18.487178],[-70.30631,-18.487148],[-70.306912,-18.48656],[-70.307755,-18.485739],[-70.307905,-18.485605],[-70.307962,-18.485559],[-70.30804,-18.485512],[-70.308128,-18.485471],[-70.308209,-18.485433],[-70.308416,-18.485365],[-70.309321,-18.485045],[-70.310105,-18.484718],[-70.310649,-18.484493],[-70.310971,-18.484338],[-70.311199,-18.484206],[-70.311508,-18.484063],[-70.31198,-18.483875],[-70.312489,-18.483634],[-70.312704,-18.483532],[-70.312894,-18.483466],[-70.31375,-18.483115],[-70.314027,-18.482994],[-70.314083,-18.482962],[-70.314138,-18.482926],[-70.314164,-18.482908],[-70.314477,-18.482638],[-70.314531,-18.482591],[-70.314567,-18.48256],[-70.315112,-18.483156],[-70.315142,-18.483189],[-70.315175,-18.483225],[-70.31553,-18.483591],[-70.315877,-18.483953],[-70.316051,-18.484156],[-70.316069,-18.484174],[-70.316103,-18.484215],[-70.316526,-18.484186],[-70.316583,-18.484182],[-70.316621,-18.484174],[-70.316662,-18.484162],[-70.316849,-18.483761],[-70.316885,-18.483704],[-70.316921,-18.483654],[-70.317392,-18.483025],[-70.317425,-18.48298],[-70.317962,-18.482274],[-70.317993,-18.482234],[-70.318613,-18.481426],[-70.318643,-18.481386],[-70.319258,-18.480492],[-70.3193,-18.480443],[-70.318885,-18.479884],[-70.318858,-18.47985],[-70.318832,-18.479819],[-70.318672,-18.47962],[-70.318228,-18.479068],[-70.317694,-18.478438],[-70.31706,-18.477932]]
      }
    }
  ]
};

// ============================================================
// PERSISTENCIA DINÁMICA & SINCRONIZACIÓN EN TIEMPO REAL
// Permite que las modificaciones hechas en el panel de administrador
// se reflejen inmediatamente en el mapa público.
// ============================================================
const STORAGE_KEYS = {
  ROUTES: 'turiarica_custom_routes',
  ZONES: 'turiarica_custom_zones',
  MEETING_POINTS: 'turiarica_custom_meeting_points',
  LIGHTS: 'turiarica_custom_lights',
  TRANSIT_LINES: 'turiarica_custom_transit_lines'
};

export const GEODATA_UPDATED_EVENT = 'turiarica_geodata_updated';

function notifyGeoDataChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GEODATA_UPDATED_EVENT));
  }
}

export function getLiveRoutesGeoJSON() {
  if (typeof window === 'undefined') return VIAS_EVACUACION;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ROUTES);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { type: "FeatureCollection", features: parsed };
      if (parsed && parsed.type === "FeatureCollection") return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored routes:', e);
  }
  return VIAS_EVACUACION;
}

export function saveLiveRoutes(features) {
  if (typeof window === 'undefined') return;
  try {
    const list = Array.isArray(features) ? features : (features?.features || []);
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(list));
    notifyGeoDataChange();
  } catch (e) {
    console.error('Error saving routes:', e);
  }
}

export function getLiveZonesGeoJSON() {
  if (typeof window === 'undefined') return ZONAS_RIESGO_TSUNAMI;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ZONES);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { type: "FeatureCollection", features: parsed };
      if (parsed && parsed.type === "FeatureCollection") return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored zones:', e);
  }
  return ZONAS_RIESGO_TSUNAMI;
}

export function saveLiveZones(features) {
  if (typeof window === 'undefined') return;
  try {
    const list = Array.isArray(features) ? features : (features?.features || []);
    localStorage.setItem(STORAGE_KEYS.ZONES, JSON.stringify(list));
    notifyGeoDataChange();
  } catch (e) {
    console.error('Error saving zones:', e);
  }
}

export function getLiveMeetingPoints() {
  if (typeof window === 'undefined') return PUNTOS_ENCUENTRO;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEETING_POINTS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored meeting points:', e);
  }
  return PUNTOS_ENCUENTRO;
}

export function saveLiveMeetingPoints(points) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEETING_POINTS, JSON.stringify(points));
    notifyGeoDataChange();
  } catch (e) {
    console.error('Error saving meeting points:', e);
  }
}

export function getLiveLightsGeoJSON() {
  if (typeof window === 'undefined') return FOCOS_DE_LUZ;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LIGHTS);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { type: "FeatureCollection", features: parsed };
      if (parsed && parsed.type === "FeatureCollection") return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored lights:', e);
  }
  return FOCOS_DE_LUZ;
}

export function saveLiveLights(features) {
  if (typeof window === 'undefined') return;
  try {
    const list = Array.isArray(features) ? features : (features?.features || []);
    localStorage.setItem(STORAGE_KEYS.LIGHTS, JSON.stringify(list));
    notifyGeoDataChange();
  } catch (e) {
    console.error('Error saving lights:', e);
  }
}

export function getLiveTransitLinesGeoJSON() {
  if (typeof window === 'undefined') return LINEAS_TRANSPORTE_PUBLICO;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSIT_LINES);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { type: "FeatureCollection", features: parsed };
      if (parsed && parsed.type === "FeatureCollection") return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored transit lines:', e);
  }
  return LINEAS_TRANSPORTE_PUBLICO;
}

export function saveLiveTransitLines(features) {
  if (typeof window === 'undefined') return;
  try {
    const list = Array.isArray(features) ? features : (features?.features || []);
    localStorage.setItem(STORAGE_KEYS.TRANSIT_LINES, JSON.stringify(list));
    notifyGeoDataChange();
  } catch (e) {
    console.error('Error saving transit lines:', e);
  }
}

export function resetAllGeoDataToDefault() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ROUTES);
  localStorage.removeItem(STORAGE_KEYS.ZONES);
  localStorage.removeItem(STORAGE_KEYS.MEETING_POINTS);
  localStorage.removeItem(STORAGE_KEYS.LIGHTS);
  localStorage.removeItem(STORAGE_KEYS.TRANSIT_LINES);
  notifyGeoDataChange();
}


