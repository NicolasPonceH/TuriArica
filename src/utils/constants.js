// API endpoints and app-wide constants

export const API = {
  GRAPHHOPPER: 'https://graphhopper.com/api/1/route',
  GRAPHHOPPER_KEY: import.meta.env.VITE_GRAPHHOPPER_API_KEY || '',
  MYMEMORY: 'https://api.mymemory.translated.net/get',
  MYMEMORY_EMAIL: 'turiarica@gmail.com',
};

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'turiarica2026';

export const MAP_CENTER = {
  longitude: -70.3126,
  latitude: -18.4783,
  zoom: 12.5,
  pitch: 45,
  bearing: -10,
};

export const FALLBACK_LOCATION = {
  lat: -18.4783,
  lng: -70.3126,
  name: 'Plaza Colón (Centro de Arica)',
};

export const SUPPORTED_LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇨🇱' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];
