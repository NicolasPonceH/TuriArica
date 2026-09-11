import { Router } from 'express';

const router = Router();

// Endpoint oficial de Farmanet MINSAL (Datos Abiertos de Chile)
const MINSAL_FARMANET_URL = 'https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php';

// Cache en memoria para evitar saturar la API del MINSAL
let cachedPharmacies = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos

// Centros de Salud Oficiales de Arica (Hospital, SAR, SAPU, CESFAM)
export const HEALTH_CENTERS_ARICA = [
  {
    id: 'hosp-juan-noe',
    name: 'Hospital Regional Dr. Juan Noé Crevani',
    type: 'hospital',
    category: 'Salud',
    shortDesc: 'Principal centro hospitalario de la región con Urgencia 24h para adultos y niños.',
    address: '18 de Septiembre 1000, Arica',
    lat: -18.4831,
    lng: -70.3128,
    phone: '+56 58 220 4000',
    emergencyPhone: '131',
    is24h: true,
    schedule: 'Urgencias 24 Horas · Atención continua',
    scheduleRule: { type: '24h' },
    services: ['Urgencia Adulto', 'Urgencia Pediátrica', 'Maternidad', 'Traumatología', 'Laboratorio Clínico'],
    transport: {
      lineas: ['1', '2', '8', '12', '14'],
      parada: 'Hospital Dr. Juan Noé',
      letrero: 'Hospital / 18 de Septiembre'
    }
  },
  {
    id: 'sar-iris-veliz',
    name: 'SAR Iris Véliz Hume',
    type: 'sar',
    category: 'Salud',
    shortDesc: 'Servicio de Alta Resolutividad con atención continua de urgencias médicas.',
    address: 'Las Torres s/n con Ginebra, Arica',
    lat: -18.4725,
    lng: -70.2829,
    phone: '+56 58 238 6800',
    emergencyPhone: '+56 58 238 6800',
    is24h: true,
    schedule: 'Urgencias 24 Horas · Rayos X y Laboratorio',
    scheduleRule: { type: '24h' },
    services: ['Urgencias Médicas', 'Radiografías de Tórax/Óseas', 'Exámenes de Sangre Inmediatos', 'Nebulizaciones'],
    transport: {
      lineas: ['3', '7', '10', '16'],
      parada: 'Las Torres con Ginebra',
      letrero: 'Las Torres / San José'
    }
  },
  {
    id: 'sapu-marco-carvajal',
    name: 'SAPU Marco Carvajal Moreno (ex Bertín Soto)',
    type: 'sapu',
    category: 'Salud',
    shortDesc: 'Servicio de Atención Primaria de Urgencia vespertino y fines de semana.',
    address: 'Belén 1675, Arica',
    lat: -18.4902,
    lng: -70.2875,
    phone: '+56 58 238 6830',
    emergencyPhone: '+56 58 238 6830',
    is24h: false,
    schedule: 'Lun a Vie 17:00 - 00:00 · Sáb, Dom y Festivos 08:00 - 00:00',
    scheduleRule: {
      type: 'sapu',
      weekdayStart: '17:00',
      weekdayEnd: '24:00',
      weekendStart: '08:00',
      weekendEnd: '24:00'
    },
    services: ['Urgencias menores', 'Curaciones agudas', 'Inyectables', 'Estabilización básica'],
    transport: {
      lineas: ['4', '6', '12', '113'],
      parada: 'Belén con Yerbas Buenas',
      letrero: 'Cancha Rayada / Belén'
    }
  },
  {
    id: 'sapu-amador-neghme',
    name: 'SAPU Dr. Amador Neghme Rodríguez',
    type: 'sapu',
    category: 'Salud',
    shortDesc: 'Urgencias ambulatorias en sector norte de Arica.',
    address: 'Cancha Rayada s/n (Pob. Cardenal Silva Henríquez), Arica',
    lat: -18.4556,
    lng: -70.2915,
    phone: '+56 58 238 6850',
    emergencyPhone: '+56 58 238 6850',
    is24h: false,
    schedule: 'Lun a Vie 17:00 - 00:00 · Sáb, Dom y Festivos 08:00 - 00:00',
    scheduleRule: {
      type: 'sapu',
      weekdayStart: '17:00',
      weekdayEnd: '24:00',
      weekendStart: '08:00',
      weekendEnd: '24:00'
    },
    services: ['Atención médica de urgencia', 'Nebulizaciones', 'Control de presión arterial'],
    transport: {
      lineas: ['2', '12', '14'],
      parada: 'Av. Cancha Rayada',
      letrero: 'Cardenal Silva Henríquez'
    }
  },
  {
    id: 'cesfam-remigio-sapunar',
    name: 'CESFAM Dr. Remigio Sapunar Marín',
    type: 'cesfam',
    category: 'Salud',
    shortDesc: 'Centro de salud familiar integral con farmacia comunitaria y vacunatorio.',
    address: 'Sor Teresa de Los Andes 2335, Arica',
    lat: -18.4815,
    lng: -70.2974,
    phone: '+56 58 238 6820',
    emergencyPhone: '',
    is24h: false,
    schedule: 'Lun a Jue 08:00 - 17:00 · Vie 08:00 - 16:00',
    scheduleRule: {
      type: 'standard',
      monThuStart: '08:00',
      monThuEnd: '17:00',
      friStart: '08:00',
      friEnd: '16:00'
    },
    services: ['Medicina General', 'Vacunatorio', 'Farmacia APS', 'Salud Dental'],
    transport: {
      lineas: ['1', '5', '9', '113'],
      parada: 'Sor Teresa con Barros Luco',
      letrero: 'Población Magisterio'
    }
  },
  {
    id: 'cesfam-eugenio-petruccelli',
    name: 'CESFAM Eugenio Petruccelli Astudillo',
    type: 'cesfam',
    category: 'Salud',
    shortDesc: 'Centro de Salud Familiar para el sector Punta Norte de Arica.',
    address: 'Linderos 1318 (Punta Norte), Arica',
    lat: -18.4418,
    lng: -70.2856,
    phone: '+56 58 238 6870',
    emergencyPhone: '',
    is24h: false,
    schedule: 'Lun a Jue 08:00 - 17:00 · Vie 08:00 - 16:00',
    scheduleRule: {
      type: 'standard',
      monThuStart: '08:00',
      monThuEnd: '17:00',
      friStart: '08:00',
      friEnd: '16:00'
    },
    services: ['Medicina General', 'Control Niño Sano', 'Farmacia y Vacunas'],
    transport: {
      lineas: ['12', '14'],
      parada: 'Linderos con Los Laureles',
      letrero: 'Punta Norte'
    }
  },
  {
    id: 'cesfam-san-miguel-azapa',
    name: 'CESFAM San Miguel de Azapa',
    type: 'cesfam',
    category: 'Salud',
    shortDesc: 'Atención primaria y urgencias rurales para residentes y turistas del Valle de Azapa.',
    address: 'Km 12 Valle de Azapa, Arica',
    lat: -18.5204,
    lng: -70.1872,
    phone: '+56 58 238 6860',
    emergencyPhone: '+56 58 238 6860',
    is24h: false,
    schedule: 'Lun a Jue 08:00 - 17:00 · Vie 08:00 - 16:00 (Posta con turno de llamada)',
    scheduleRule: {
      type: 'standard',
      monThuStart: '08:00',
      monThuEnd: '17:00',
      friStart: '08:00',
      friEnd: '16:00'
    },
    services: ['Salud Rural', 'Medicina General', 'Vacunatorio', 'Urgencia rural'],
    transport: {
      lineas: ['Taxicolectivos Azapa'],
      parada: 'Poblado San Miguel de Azapa',
      letrero: 'Valle de Azapa'
    }
  }
];

// Calcula la hora local chilena (America/Santiago)
function getChileanTime() {
  const now = new Date();
  const chileanString = now.toLocaleString('en-US', { timeZone: 'America/Santiago' });
  const localDate = new Date(chileanString);
  const dayOfWeek = localDate.getDay(); // 0 = Domingo, 1 = Lunes, ... 6 = Sábado
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  return { now, localDate, dayOfWeek, hours, minutes, currentMinutes };
}

// Determina dinámicamente si un centro de salud está abierto ahora
function calculateCenterStatus(center, timeInfo = getChileanTime()) {
  const { dayOfWeek, currentMinutes } = timeInfo;
  const rule = center.scheduleRule;

  if (center.is24h || rule?.type === '24h') {
    return {
      isOpen: true,
      statusLabel: 'Abierto 24 Horas',
      statusClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badgeText: 'Urgencia 24h'
    };
  }

  if (rule?.type === 'sapu') {
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const startMin = isWeekend ? 8 * 60 : 17 * 60;
    const endMin = 24 * 60; // Hasta medianoche

    const isOpen = currentMinutes >= startMin && currentMinutes < endMin;
    return {
      isOpen,
      statusLabel: isOpen ? 'Abierto Ahora (Urgencia)' : isWeekend ? 'Cerrado · Abre a las 08:00' : 'Cerrado · Abre a las 17:00',
      statusClass: isOpen
        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
        : 'text-amber-700 bg-amber-50 border-amber-200',
      badgeText: isOpen ? 'Urgencia Abierta' : 'Abre ' + (isWeekend ? '08:00' : '17:00')
    };
  }

  if (rule?.type === 'standard') {
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isFriday = dayOfWeek === 5;
    const startMin = 8 * 60;
    const endMin = isFriday ? 16 * 60 : 17 * 60;

    const isOpen = isWeekday && currentMinutes >= startMin && currentMinutes < endMin;
    return {
      isOpen,
      statusLabel: isOpen ? 'Abierto Ahora' : 'Cerrado · Horario hábil Lun-Vie 08:00',
      statusClass: isOpen
        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
        : 'text-slate-600 bg-slate-100 border-slate-200',
      badgeText: isOpen ? 'Atención Abierta' : 'Cerrado'
    };
  }

  return {
    isOpen: false,
    statusLabel: 'Consultar horario',
    statusClass: 'text-slate-600 bg-slate-100 border-slate-200',
    badgeText: 'Horario regular'
  };
}

// Determina si una farmacia de turno está abierta ahora
function calculatePharmacyStatus(pharmacy, timeInfo = getChileanTime()) {
  const { currentMinutes } = timeInfo;
  
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || '0', 10);
  };

  const openMin = parseTimeToMinutes(pharmacy.openTime) ?? (9 * 60);
  let closeMin = parseTimeToMinutes(pharmacy.closeTime);

  // Si no hay cierre especificado o indica 00:00/09:00 del día siguiente, asumimos turno extendido/24h
  let isOpen = true;
  let label = 'De Turno Hoy';

  if (closeMin !== null) {
    if (closeMin <= openMin) {
      // Pasa de medianoche (ejemplo: abre 09:00 y cierra 08:59 del día siguiente)
      isOpen = currentMinutes >= openMin || currentMinutes <= closeMin;
    } else {
      isOpen = currentMinutes >= openMin && currentMinutes <= closeMin;
    }
  }

  const isTurno = Boolean(pharmacy.isTurno);
  return {
    isOpen,
    statusLabel: isTurno
      ? (isOpen ? `Abierta de Turno hasta las ${pharmacy.closeTime || '09:00'}` : `Turno cerrado a las ${pharmacy.closeTime}`)
      : (isOpen ? `Abierta hoy hasta las ${pharmacy.closeTime || '21:00'}` : `Cerrada · Abre a las ${pharmacy.openTime || '08:30'}`),
    statusClass: isOpen
      ? (isTurno ? 'text-emerald-800 bg-emerald-100/90 border-emerald-300 ring-1 ring-emerald-400' : 'text-emerald-700 bg-emerald-50 border-emerald-200')
      : 'text-slate-600 bg-slate-100 border-slate-200',
    badgeText: isTurno ? (isOpen ? 'De Turno Hoy' : 'Turno Cerrado') : (isOpen ? 'Abierta Ahora' : 'Cerrada')
  };
}

// Helper para obtener las farmacias de turno desde el MINSAL
export async function getAricaDutyPharmacies() {
  const now = Date.now();
  if (cachedPharmacies && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedPharmacies;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(MINSAL_FARMANET_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'TuriArica-App/2.0'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Farmanet MINSAL HTTP status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Formato de datos no es array');
    }

    // Filtrar para la comuna de Arica (fk_region 1 y fk_comuna 1 o comuna_nombre 'ARICA')
    const aricaList = data.filter(item => {
      const comuna = (item.comuna_nombre || '').toUpperCase();
      return comuna.includes('ARICA') || item.fk_comuna === '1' || (item.fk_region === '1' && comuna === 'ARICA');
    });

    const timeInfo = getChileanTime();

    const formatted = aricaList.map((f, idx) => {
      const lat = parseFloat(f.local_lat) || -18.4770;
      const lng = parseFloat(f.local_lng) || -70.2920;
      const pharmacyObj = {
        id: `farmacia-${f.local_id || idx}`,
        localId: f.local_id,
        name: f.local_nombre?.trim() || 'Farmacia de Turno',
        address: f.local_direccion?.trim() || 'Arica',
        neighborhood: f.localidad_nombre?.trim() || 'Arica Centro',
        openTime: f.funcionamiento_hora_apertura || '09:00',
        closeTime: f.funcionamiento_hora_cierre || '21:00',
        day: f.funcionamiento_dia || '',
        date: f.fecha || new Date().toISOString().split('T')[0],
        phone: f.local_telefono || '+56 58 200 0000',
        lat,
        lng,
        category: 'Farmacia',
        type: 'salud'
      };

      const status = calculatePharmacyStatus(pharmacyObj, timeInfo);
      return {
        ...pharmacyObj,
        ...status
      };
    });

    if (formatted.length > 0) {
      cachedPharmacies = formatted;
      lastFetchTime = now;
      return formatted;
    }
  } catch (error) {
    console.warn('[HEALTH] Fallo al consultar MINSAL Farmanet:', error.message);
  }

  // Si falló la red o no hay registros, retornar fallback verificado de Arica
  const timeInfo = getChileanTime();
  const fallback = [
    {
      id: 'farmacia-fallback-1',
      localId: '9901',
      name: 'Cruz Verde (Paseo 21 de Mayo)',
      address: '21 de Mayo 402, Arica Centro',
      neighborhood: 'Arica Centro Histórico',
      openTime: '08:30',
      closeTime: '22:00',
      day: 'todos los días',
      date: new Date().toISOString().split('T')[0],
      phone: '+56 800 500 005',
      lat: -18.4782,
      lng: -70.3204,
      category: 'Farmacia',
      type: 'salud',
      isOpen: true,
      statusLabel: 'Abierta hoy hasta las 22:00',
      statusClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badgeText: 'Farmacia Activa'
    }
  ];
  return fallback;
}

// Catálogo de farmacias permanentes y cadenas de Arica
export const ARICA_PERMANENT_PHARMACIES = [
  {
    id: 'farm-cruz-verde-21mayo',
    name: 'Farmacia Cruz Verde (Paseo 21 de Mayo)',
    brand: 'Cruz Verde',
    address: '21 de Mayo 402, Arica Centro',
    neighborhood: 'Centro Histórico',
    phone: '+56 800 500 005',
    lat: -18.4782,
    lng: -70.3204,
    openTime: '08:30',
    closeTime: '21:30',
    schedule: 'Lun a Sáb 08:30 - 21:30 · Dom 09:30 - 20:30',
    category: 'Farmacia',
    type: 'salud'
  },
  {
    id: 'farm-salcobrand-21mayo',
    name: 'Farmacia Salcobrand (Paseo 21 de Mayo)',
    brand: 'Salcobrand',
    address: '21 de Mayo 398, Arica Centro',
    neighborhood: 'Centro Histórico',
    phone: '+56 600 360 6000',
    lat: -18.4784,
    lng: -70.3207,
    openTime: '08:30',
    closeTime: '21:00',
    schedule: 'Lun a Sáb 08:30 - 21:00 · Dom 10:00 - 19:00',
    category: 'Farmacia',
    type: 'salud'
  },
  {
    id: 'farm-ahumada-21mayo',
    name: 'Farmacia Ahumada (Paseo 21 de Mayo)',
    brand: 'Ahumada',
    address: '21 de Mayo 432, Arica Centro',
    neighborhood: 'Centro Histórico',
    phone: '+56 600 222 4000',
    lat: -18.4781,
    lng: -70.3202,
    openTime: '08:30',
    closeTime: '21:30',
    schedule: 'Lun a Sáb 08:30 - 21:30 · Dom 09:30 - 20:00',
    category: 'Farmacia',
    type: 'salud'
  },
  {
    id: 'farm-popular-municipal',
    name: 'Farmacia Popular Municipal de Arica',
    brand: 'Municipalidad de Arica',
    address: 'Av. 18 de Septiembre 1221, Arica',
    neighborhood: 'Sector Hospital Regional',
    phone: '+56 58 238 6890',
    lat: -18.4839,
    lng: -70.3115,
    openTime: '09:00',
    closeTime: '17:00',
    schedule: 'Lun a Vie 09:00 - 17:00 · Medicamentos a bajo costo',
    category: 'Farmacia',
    type: 'salud'
  },
  {
    id: 'farm-cruz-verde-mall',
    name: 'Farmacia Cruz Verde (Mallplaza Arica)',
    brand: 'Cruz Verde',
    address: 'Av. Diego Portales 640, Mallplaza Arica',
    neighborhood: 'Costanera Norte',
    phone: '+56 800 500 005',
    lat: -18.4682,
    lng: -70.3061,
    openTime: '10:00',
    closeTime: '21:00',
    schedule: 'Lunes a Domingo 10:00 - 21:00',
    category: 'Farmacia',
    type: 'salud'
  },
  {
    id: 'farm-redfarma-santamaria',
    name: 'Farmacia Redfarma (Santa María)',
    brand: 'Redfarma',
    address: 'Av. Santa María 2110, Arica',
    neighborhood: 'Sector Santa María',
    phone: '+56 58 222 3344',
    lat: -18.4795,
    lng: -70.3015,
    openTime: '09:00',
    closeTime: '21:00',
    schedule: 'Lunes a Sábado 09:00 - 21:00',
    category: 'Farmacia',
    type: 'salud'
  },
  {
    id: 'farm-prat-centro',
    name: 'Farmacia Prat (Independiente)',
    brand: 'Prat',
    address: 'Arturo Prat 360, Arica Centro',
    neighborhood: 'Centro Comercial',
    phone: '+56 58 225 1200',
    lat: -18.4772,
    lng: -70.3188,
    openTime: '09:00',
    closeTime: '20:30',
    schedule: 'Lunes a Sábado 09:00 - 20:30',
    category: 'Farmacia',
    type: 'salud'
  }
];

// Obtiene todas las farmacias de Arica combinando la de turno MINSAL y las permanentes
export async function getAllAricaPharmacies() {
  const timeInfo = getChileanTime();
  const dutyList = await getAricaDutyPharmacies();
  const mainDuty = dutyList[0];

  // Formatear permanentes con su estado en vivo
  const permanentList = ARICA_PERMANENT_PHARMACIES.map(farm => {
    const status = calculatePharmacyStatus(farm, timeInfo);
    // Verificar si esta farmacia permanente coincide con la de turno hoy
    const isThisTurno = mainDuty && (
      (farm.address && mainDuty.address && farm.address.toLowerCase().includes(mainDuty.address.toLowerCase().slice(0, 8))) ||
      (farm.name && mainDuty.name && farm.name.toLowerCase().includes(mainDuty.name.toLowerCase()))
    );

    return {
      ...farm,
      isTurno: Boolean(isThisTurno),
      ...status,
      badgeText: isThisTurno ? 'De Turno Hoy' : status.badgeText
    };
  });

  // Si la de turno de Farmanet no está en las permanentes, colocarla al inicio
  const isDutyAlreadyIncluded = permanentList.some(p => p.isTurno);
  let consolidated = [];

  if (mainDuty && !isDutyAlreadyIncluded) {
    consolidated.push({
      ...mainDuty,
      isTurno: true,
      badgeText: 'De Turno Hoy',
      statusClass: 'text-emerald-700 bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400/40'
    });
  }

  consolidated = [...consolidated, ...permanentList];

  // Ordenar: primero las de turno, luego abiertas, luego cerradas
  consolidated.sort((a, b) => {
    if (a.isTurno && !b.isTurno) return -1;
    if (!a.isTurno && b.isTurno) return 1;
    if (a.isOpen && !b.isOpen) return -1;
    if (!a.isOpen && b.isOpen) return 1;
    return 0;
  });

  return {
    dutyPharmacy: mainDuty,
    allPharmacies: consolidated
  };
}

// -------------------------------------------------------------
// ENDPOINTS
// -------------------------------------------------------------

// 1. GET /api/health/duty-pharmacies -> Farmacias de turno y directorio completo
router.get('/duty-pharmacies', async (req, res) => {
  try {
    const { dutyPharmacy, allPharmacies } = await getAllAricaPharmacies();
    res.json({
      success: true,
      source: 'Ministerio de Salud de Chile (Farmanet) & Red Arica',
      date: new Date().toISOString().split('T')[0],
      count: allPharmacies.length,
      dutyPharmacy,
      pharmacies: allPharmacies
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET /api/health/centers -> Catálogo de centros de salud con estado en tiempo real
router.get('/centers', (req, res) => {
  try {
    const timeInfo = getChileanTime();
    const centersWithStatus = HEALTH_CENTERS_ARICA.map(center => {
      const status = calculateCenterStatus(center, timeInfo);
      return {
        ...center,
        ...status
      };
    });

    res.json({
      success: true,
      timestamp: timeInfo.localDate.toISOString(),
      count: centersWithStatus.length,
      centers: centersWithStatus
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/health/summary -> Resumen rápido para widget y asistente
router.get('/summary', async (req, res) => {
  try {
    const timeInfo = getChileanTime();
    const { dutyPharmacy, allPharmacies } = await getAllAricaPharmacies();
    const centers = HEALTH_CENTERS_ARICA.map(center => ({
      ...center,
      ...calculateCenterStatus(center, timeInfo)
    }));

    // Urgencias 24h
    const emergencies24h = centers.filter(c => c.is24h);

    res.json({
      success: true,
      date: timeInfo.localDate.toISOString().split('T')[0],
      currentTimeChile: timeInfo.localDate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      dutyPharmacy,
      pharmaciesOnDuty: allPharmacies.filter(p => p.isTurno),
      allPharmacies,
      emergencies24h,
      allCenters: centers,
      emergencyNumbers: [
        { label: 'Ambulancia SAMU', number: '131', desc: 'Emergencias vitales en toda la región' },
        { label: 'Urgencia Hospital Juan Noé', number: '+56 58 220 4000', desc: 'Atención 24 Horas' },
        { label: 'SAR Iris Véliz (Las Torres)', number: '+56 58 238 6800', desc: 'Urgencias 24 Horas' },
        { label: 'Carabineros de Chile', number: '133', desc: 'Seguridad y auxilio policial' },
        { label: 'Bomberos de Arica', number: '132', desc: 'Rescate y accidentes' }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
