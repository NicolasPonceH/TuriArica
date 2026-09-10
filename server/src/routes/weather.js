import { Router } from 'express';

const router = Router();

// Cache en memoria para respetar la política de RedMeteo (actualizado cada 5 minutos)
let weatherCache = {
  data: null,
  lastFetch: 0
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function degreesToCardinal(deg) {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
  const val = Math.round(deg / 22.5);
  return directions[(val % 16 + 16) % 16];
}

export async function getLiveWeather() {
  const now = Date.now();
  if (weatherCache.data && (now - weatherCache.lastFetch < CACHE_TTL_MS)) {
    return weatherCache.data;
  }

  try {
    const res = await fetch('https://redmeteo.cl/jsonemas/RMCL0114.json', {
      headers: { 'User-Agent': 'TuriArica-Web/2.0 (redmeteo-client)' }
    });

    if (!res.ok) {
      throw new Error(`RedMeteo HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!Array.isArray(json) || json.length === 0) {
      throw new Error('Respuesta vacía de RedMeteo');
    }

    const d = json[0];
    const meta = d.metadatos || {};

    const temp = d.t && d.t.length > 0 ? d.t[0] : 22;
    const humidity = d.rh && d.rh.length > 0 ? d.rh[0] : 75;
    const windSpeedKmH = d.vv && d.vv.length > 0 ? Math.round(d.vv[0] * 36) / 10 : 12;
    const windDirDeg = d.vd && d.vd.length > 0 ? d.vd[0] : 180;
    const solarRad = d.sw && d.sw.length > 0 && d.sw[0] !== null ? Math.round(d.sw[0]) : null;
    const uv = d.uv && d.uv.length > 0 ? d.uv[0] : 5;
    const pressure = d.slp && d.slp.length > 0 ? Math.round(d.slp[0] * 10) / 10 : 1015;
    const precipToday = d.ppd && d.ppd.length > 0 ? d.ppd[0] : 0;

    const data = {
      station: {
        code: 'RMCL0114',
        name: meta.nombre || 'Arica - Capitanía de Puerto (SERVIMET)',
        lat: meta.latitud || -18.4769,
        lng: meta.longitud || -70.3219,
        alt: meta.altitud || 8,
        owner: meta.propietario || 'SERVIMET / RedMeteo',
        lastUpdate: meta.ultima_actualizacion || new Date().toISOString()
      },
      current: {
        temp: Number(temp.toFixed(1)),
        humidity: Math.round(humidity),
        windSpeedKmH,
        windDirection: degreesToCardinal(windDirDeg),
        windDirDeg,
        solarRadiation: solarRad,
        uvIndex: uv,
        pressureHpa: pressure,
        rainTodayMm: precipToday
      },
      citation: 'Red Meteorológica Aficionada de Chile. (2019). Sitio web RedMeteo. Red Ciudadana De Estaciones Meteorológicas. Consultado https://www.redmeteo.cl/',
      cachedAt: new Date().toISOString()
    };

    weatherCache = {
      data,
      lastFetch: now
    };

    return data;
  } catch (err) {
    console.warn('[REDMETEO ERROR]', err.message);
    // Si la estación de RedMeteo falla temporalmente, retornar último caché o valores de respaldo reales de Arica
    if (weatherCache.data) {
      return weatherCache.data;
    }

    return {
      station: {
        code: 'RMCL0114',
        name: 'Arica - Capitanía de Puerto (SERVIMET)',
        lat: -18.4769,
        lng: -70.3219,
        lastUpdate: new Date().toISOString()
      },
      current: {
        temp: 22.0,
        humidity: 76,
        windSpeedKmH: 12.5,
        windDirection: 'S',
        solarRadiation: 350,
        uvIndex: 7,
        pressureHpa: 1015.5,
        rainTodayMm: 0
      },
      citation: 'Red Meteorológica Aficionada de Chile (RedMeteo.cl)',
      isFallback: true
    };
  }
}

// Endpoint público para el frontend
router.get('/live', async (req, res) => {
  const weather = await getLiveWeather();
  res.json(weather);
});

export default router;
