import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure storage directories exist
const dbDir = path.resolve(__dirname, '../database');
const uploadPhotosDir = path.resolve(__dirname, '../uploads/photos');
const uploadVideosDir = path.resolve(__dirname, '../uploads/videos');

[dbDir, uploadPhotosDir, uploadVideosDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const dbPath = path.join(dbDir, 'turiarica.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for performance
try {
  db.exec('PRAGMA journal_mode = WAL;');
} catch (e) {
  // Ignored if not supported in memory
}

// 1. Create Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT DEFAULT 'turismo',
    icon TEXT,
    color TEXT,
    short_desc TEXT,
    full_desc TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    hours TEXT,
    directions TEXT,
    phone TEXT,
    website TEXT,
    price_range TEXT,
    is_24h INTEGER DEFAULT 0,
    audio_file TEXT,
    transport_json TEXT,
    photos_json TEXT,
    videos_json TEXT,
    ai_tags_json TEXT,
    is_default INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'evento',
    start_date TEXT,
    end_date TEXT,
    is_active INTEGER DEFAULT 1,
    is_popup INTEGER DEFAULT 1,
    banner_url TEXT,
    action_url TEXT,
    priority INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// 2. Initial Seeding Function
export function seedDatabase(adminUser = 'admin', adminPass = 'turiarica2026') {
  // A. Admin Seed
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get().count;
  if (adminCount === 0) {
    const hash = bcrypt.hashSync(adminPass, 10);
    db.prepare('INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)')
      .run(adminUser, hash, 'superadmin');
    console.log(`[DB] Usuario administrador inicial creado: ${adminUser}`);
  }

  // B. Events Seed
  const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
  if (eventCount === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (title, message, type, start_date, end_date, is_active, is_popup, banner_url, action_url, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEvent.run(
      'Carnaval Andino con la Fuerza del Sol 2026',
      '¡El evento cultural y de danzas más grande del norte de Chile! Vive 3 días de emoción, comparsas y tradición andina a los pies del Morro de Arica. Más de 16.000 bailarines y músicos.',
      'festival',
      '2026-01-23',
      '2026-02-15',
      1,
      1,
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
      'https://aricafuerzadelsol.cl',
      1
    );

    insertEvent.run(
      'Aviso Preventivo: Oleaje y Bandera Amarilla en Playas',
      'Capitanía de Puerto de Arica informa aviso preventivo de marejadas moderadas en el sector costero. Se recomienda máxima precaución a bañistas en playas El Laucho y Chinchorro.',
      'alerta',
      '2026-03-01',
      '2026-03-31',
      1,
      0,
      '',
      '',
      2
    );
    console.log('[DB] Eventos y notificaciones de prueba inicializados.');
  }

  // C. Places Seed
  const placeCount = db.prepare('SELECT COUNT(*) as count FROM places').get().count;
  if (placeCount === 0) {
    const initialPlaces = [
      {
        name: "Playa El Laucho", category: "Playa", type: "turismo", icon: "Umbrella", color: "#0EA5E9",
        shortDesc: "La playa más popular y accesible de Arica.",
        fullDesc: "Playa El Laucho es el balneario por excelencia de Arica. Sus aguas de color turquesa son inusualmente tranquilas y de temperatura agradable, lo que la convierte en una piscina natural ideal para el baño seguro de niños y adultos. Cuenta con una excelente infraestructura inclusiva, incluyendo rampas que llegan casi hasta la orilla del mar, baños adaptados, duchas y arriendo de sombrillas.",
        lat: -18.4879, lng: -70.3267, hours: "Abierta todo el año · 24 horas", directions: "Desde el centro, tomar Av. Comandante San Martín al sur por 2 km. Micros 12, 14, 10, 8.",
        phone: "+56 58 220 6000", website: "https://www.arica.cl", priceRange: "", is24h: 1, audioFile: "audios/laucho_audio.mp3",
        transport: { lineas: ["12", "14", "10", "8"], direccion: "sur", letrero: "Centro / Mall", parada: "Av. Comandante San Martín" },
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop"],
        videos: [],
        aiTags: ["playa", "turismo", "inclusivo", "familiar", "mar", "laucho"]
      },
      {
        name: "Museo de Sitio Colón 10", category: "Museo", type: "turismo", icon: "Landmark", color: "#8B5CF6",
        shortDesc: "Hogar de las momias Chinchorro, las más antiguas del mundo.",
        fullDesc: "Este asombroso museo está construido literalmente sobre un cementerio prehispánico. El Museo de Sitio Colón 10 resguarda in situ a las momias de la Cultura Chinchorro, reconocidas por la UNESCO como Patrimonio de la Humanidad. Tienen más de 7.000 años de antigüedad.",
        lat: -18.4806, lng: -70.3216, hours: "Martes a Domingo · 09:00 - 18:00", directions: "Calle Colón 10, a 3 cuadras de la Plaza Colón. Micros 1,2,3,5,7,10,11,16,113.",
        phone: "+56 58 220 5410", website: "https://uta.cl/museos", priceRange: "$", is24h: 0, audioFile: "audios/Museo_audio.mp3",
        transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "Calle Colón" },
        photos: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop"],
        videos: [],
        aiTags: ["museo", "cultura", "patrimonio", "chinchorro", "momias", "historia"]
      },
      {
        name: "Iglesia San Marcos", category: "Histórico", type: "turismo", icon: "Church", color: "#F59E0B",
        shortDesc: "Diseñada por Gustave Eiffel, ícono de Arica.",
        fullDesc: "Declarada Monumento Nacional, la Iglesia San Marcos es una joya arquitectónica diseñada en 1876 por los talleres del famoso ingeniero francés Gustave Eiffel. Lo más sorprendente es que su estructura es completamente de fierro fundido.",
        lat: -18.4789, lng: -70.3207, hours: "Lunes a Sábado 08-20h · Domingo 09-13h", directions: "Plaza Colón, centro histórico. Cualquier micro con letrero 'Centro'.",
        phone: "", website: "", priceRange: "", is24h: 0, audioFile: "audios/Catedral_audio.mp3",
        transport: { lineas: ["1", "2", "3", "5", "7", "10", "11", "16", "113"], direccion: "centro", letrero: "Centro", parada: "Plaza Colón" },
        photos: ["https://images.unsplash.com/photo-1548625361-195fe210b484?w=800&auto=format&fit=crop"],
        videos: [],
        aiTags: ["eiffel", "catedral", "iglesia", "san marcos", "monumento", "centro"]
      },
      {
        name: "El Morro de Arica", category: "Histórico", type: "turismo", icon: "Mountain", color: "#EF4444",
        shortDesc: "Cerro con museo histórico y vistas panorámicas.",
        fullDesc: "El Morro de Arica es el símbolo indiscutido de la ciudad. Este imponente peñón costero de 139 metros de altura fue el escenario de una de las batallas más decisivas de la Guerra del Pacífico en 1880. Ofrece una vista panorámica de 360 grados.",
        lat: -18.4803, lng: -70.3236, hours: "Martes a Domingo · 08:00 - 18:00", directions: "Acceso por Av. Colón o calle Rafael Sotomayor. Micros 12,14,10,8.",
        phone: "+56 58 225 1550", website: "", priceRange: "$", is24h: 0, audioFile: "audios/Morro_audio.mp3",
        transport: { lineas: ["12", "14", "10", "8"], direccion: "sur", letrero: "Centro / Mall", parada: "Pies del Morro" },
        photos: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop"],
        videos: [],
        aiTags: ["morro", "mirador", "guerra del pacifico", "museo", "panorama", "emblema"]
      },
      {
        name: "Cuevas de Anzota", category: "Naturaleza", type: "turismo", icon: "TreePine", color: "#6366F1",
        shortDesc: "Sistema de grutas en acantilados, lobos marinos.",
        fullDesc: "Las Cuevas de Anzota ofrecen uno de los paisajes más dramáticos y hermosos de la región. Talladas durante milenios por el fuerte oleaje del océano contra los acantilados de la Cordillera de la Costa.",
        lat: -18.5498, lng: -70.3312, hours: "Abierto todo el año · mejor con marea baja", directions: "12 km al sur por Ruta 1. Solo taxi o vehículo particular.",
        phone: "", website: "https://cuevasdeanzota.cl", priceRange: "", is24h: 0, audioFile: "audios/CuevasDeAnzota_audio.mp3",
        transport: { lineas: ["taxi", "auto"], direccion: "sur", letrero: "No hay micros", parada: "Vehículo particular" },
        photos: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop"],
        videos: [],
        aiTags: ["anzota", "cuevas", "fauna", "senderismo", "acantilados", "lobos marinos"]
      },
      {
        name: "Terminal Agropecuario ASOCAPEC", category: "Gastronomía", type: "gastronomia", icon: "Utensils", color: "#C2714F",
        shortDesc: "Corazón gastronómico: aceitunas, frutas, tradición.",
        fullDesc: "Visitar el 'Agro' es sumergirse en una explosión de colores, aromas y sabores auténticos del norte de Chile. Aquí podrás degustar las famosas aceitunas de Azapa, frutas tropicales como mangos y maracuyá.",
        lat: -18.4964, lng: -70.2861, hours: "Todos los días 06:00 - 18:00", directions: "Entrada norte, Panamericana Norte. Micros 12, 14, 8, 16, 113 con letrero 'Agro'.",
        phone: "", website: "", priceRange: "$", is24h: 0, audioFile: "audios/terminal_audio.mp3",
        transport: { lineas: ["12", "14", "8", "16", "113"], direccion: "norte", letrero: "Agro", parada: "Terminal ASOCAPEC" },
        photos: ["https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop"],
        videos: [],
        aiTags: ["agro", "comida", "aceitunas", "frutas", "mercado", "azapa", "almuerzo"]
      },
      {
        name: "Playa Chinchorro", category: "Playa", type: "turismo", icon: "Umbrella", color: "#38BDF8",
        shortDesc: "Extensa playa de aguas cálidas, ideal para familias y caminatas.",
        fullDesc: "Playa Chinchorro es una de las playas más extensas y concurridas de Arica. Destaca por sus aguas inusualmente cálidas y su oleaje moderado. Su costanera cuenta con restaurantes y cafeterías.",
        lat: -18.4630, lng: -70.3052, hours: "Abierta todo el año · 24 horas", directions: "Sector norte de Arica, Av. Raúl Pey Casado. Micro 12 o 14.",
        phone: "", website: "", priceRange: "", is24h: 1, audioFile: "audios/chinchorro_audio.mp3",
        transport: { lineas: ["12", "14"], direccion: "norte", letrero: "Centro / Mall", parada: "España con Buenos Aires" },
        photos: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop"],
        videos: [],
        aiTags: ["chinchorro", "playa", "costanera", "atardecer", "familiar"]
      }
    ];

    const insertPlace = db.prepare(`
      INSERT INTO places (
        name, category, type, icon, color, short_desc, full_desc, lat, lng,
        hours, directions, phone, website, price_range, is_24h, audio_file,
        transport_json, photos_json, videos_json, ai_tags_json, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    for (const p of initialPlaces) {
      insertPlace.run(
        p.name, p.category, p.type, p.icon, p.color, p.shortDesc, p.fullDesc,
        p.lat, p.lng, p.hours, p.directions, p.phone, p.website, p.priceRange,
        p.is24h, p.audioFile || '',
        JSON.stringify(p.transport || {}),
        JSON.stringify(p.photos || []),
        JSON.stringify(p.videos || []),
        JSON.stringify(p.aiTags || [])
      );
    }
    console.log(`[DB] ${initialPlaces.length} lugares iniciales de Arica insertados en la base de datos.`);
  }
}

// 3. Helper Database Operations

export const dbOperations = {
  // --- Admin Ops ---
  findAdminByUsername(username) {
    return db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  },
  findAdminById(id) {
    return db.prepare('SELECT id, username, role, created_at FROM admins WHERE id = ?').get(id);
  },
  updateAdminPassword(id, newHash) {
    return db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(newHash, id);
  },

  // --- Places Ops ---
  getAllPlaces() {
    const rows = db.prepare('SELECT * FROM places ORDER BY id ASC').all();
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      type: r.type,
      icon: r.icon,
      color: r.color,
      shortDesc: r.short_desc,
      fullDesc: r.full_desc,
      lat: r.lat,
      lng: r.lng,
      hours: r.hours,
      directions: r.directions,
      phone: r.phone,
      website: r.website,
      priceRange: r.price_range,
      is24h: Boolean(r.is_24h),
      audioFile: r.audio_file,
      transport: JSON.parse(r.transport_json || '{}'),
      photos: JSON.parse(r.photos_json || '[]'),
      videos: JSON.parse(r.videos_json || '[]'),
      aiTags: JSON.parse(r.ai_tags_json || '[]'),
      isDefault: Boolean(r.is_default),
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  },

  getPlaceById(id) {
    const r = db.prepare('SELECT * FROM places WHERE id = ?').get(id);
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      category: r.category,
      type: r.type,
      icon: r.icon,
      color: r.color,
      shortDesc: r.short_desc,
      fullDesc: r.full_desc,
      lat: r.lat,
      lng: r.lng,
      hours: r.hours,
      directions: r.directions,
      phone: r.phone,
      website: r.website,
      priceRange: r.price_range,
      is24h: Boolean(r.is_24h),
      audioFile: r.audio_file,
      transport: JSON.parse(r.transport_json || '{}'),
      photos: JSON.parse(r.photos_json || '[]'),
      videos: JSON.parse(r.videos_json || '[]'),
      aiTags: JSON.parse(r.ai_tags_json || '[]'),
      isDefault: Boolean(r.is_default),
      createdAt: r.created_at,
      updatedAt: r.updated_at
    };
  },

  createPlace(data) {
    const stmt = db.prepare(`
      INSERT INTO places (
        name, category, type, icon, color, short_desc, full_desc, lat, lng,
        hours, directions, phone, website, price_range, is_24h, audio_file,
        transport_json, photos_json, videos_json, ai_tags_json, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const res = stmt.run(
      data.name,
      data.category,
      data.type || 'turismo',
      data.icon || 'MapPin',
      data.color || '#0ea5e9',
      data.shortDesc || '',
      data.fullDesc || '',
      Number(data.lat),
      Number(data.lng),
      data.hours || '',
      data.directions || '',
      data.phone || '',
      data.website || '',
      data.priceRange || '',
      data.is24h ? 1 : 0,
      data.audioFile || '',
      JSON.stringify(data.transport || {}),
      JSON.stringify(data.photos || []),
      JSON.stringify(data.videos || []),
      JSON.stringify(data.aiTags || [])
    );

    return this.getPlaceById(res.lastInsertRowid);
  },

  updatePlace(id, data) {
    const stmt = db.prepare(`
      UPDATE places SET
        name = ?, category = ?, type = ?, icon = ?, color = ?,
        short_desc = ?, full_desc = ?, lat = ?, lng = ?,
        hours = ?, directions = ?, phone = ?, website = ?, price_range = ?,
        is_24h = ?, audio_file = ?, transport_json = ?, photos_json = ?,
        videos_json = ?, ai_tags_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      data.name,
      data.category,
      data.type || 'turismo',
      data.icon || 'MapPin',
      data.color || '#0ea5e9',
      data.shortDesc || '',
      data.fullDesc || '',
      Number(data.lat),
      Number(data.lng),
      data.hours || '',
      data.directions || '',
      data.phone || '',
      data.website || '',
      data.priceRange || '',
      data.is24h ? 1 : 0,
      data.audioFile || '',
      JSON.stringify(data.transport || {}),
      JSON.stringify(data.photos || []),
      JSON.stringify(data.videos || []),
      JSON.stringify(data.aiTags || []),
      id
    );

    return this.getPlaceById(id);
  },

  deletePlace(id) {
    return db.prepare('DELETE FROM places WHERE id = ?').run(id);
  },

  // --- Events Ops ---
  getAllEvents() {
    return db.prepare('SELECT * FROM events ORDER BY priority ASC, created_at DESC').all().map(e => ({
      id: e.id,
      title: e.title,
      message: e.message,
      type: e.type,
      startDate: e.start_date,
      endDate: e.end_date,
      isActive: Boolean(e.is_active),
      isPopup: Boolean(e.is_popup),
      bannerUrl: e.banner_url,
      actionUrl: e.action_url,
      priority: e.priority,
      createdAt: e.created_at
    }));
  },

  getActiveEvents() {
    return db.prepare('SELECT * FROM events WHERE is_active = 1 ORDER BY priority ASC, created_at DESC').all().map(e => ({
      id: e.id,
      title: e.title,
      message: e.message,
      type: e.type,
      startDate: e.start_date,
      endDate: e.end_date,
      isActive: true,
      isPopup: Boolean(e.is_popup),
      bannerUrl: e.banner_url,
      actionUrl: e.action_url,
      priority: e.priority,
      createdAt: e.created_at
    }));
  },

  createEvent(data) {
    const stmt = db.prepare(`
      INSERT INTO events (title, message, type, start_date, end_date, is_active, is_popup, banner_url, action_url, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const res = stmt.run(
      data.title,
      data.message,
      data.type || 'evento',
      data.startDate || '',
      data.endDate || '',
      data.isActive !== undefined ? (data.isActive ? 1 : 0) : 1,
      data.isPopup !== undefined ? (data.isPopup ? 1 : 0) : 0,
      data.bannerUrl || '',
      data.actionUrl || '',
      data.priority || 1
    );

    const inserted = db.prepare('SELECT * FROM events WHERE id = ?').get(res.lastInsertRowid);
    return {
      id: inserted.id,
      title: inserted.title,
      message: inserted.message,
      type: inserted.type,
      startDate: inserted.start_date,
      endDate: inserted.end_date,
      isActive: Boolean(inserted.is_active),
      isPopup: Boolean(inserted.is_popup),
      bannerUrl: inserted.banner_url,
      actionUrl: inserted.action_url,
      priority: inserted.priority,
      createdAt: inserted.created_at
    };
  },

  updateEvent(id, data) {
    const stmt = db.prepare(`
      UPDATE events SET
        title = ?, message = ?, type = ?, start_date = ?, end_date = ?,
        is_active = ?, is_popup = ?, banner_url = ?, action_url = ?, priority = ?
      WHERE id = ?
    `);

    stmt.run(
      data.title,
      data.message,
      data.type || 'evento',
      data.startDate || '',
      data.endDate || '',
      data.isActive ? 1 : 0,
      data.isPopup ? 1 : 0,
      data.bannerUrl || '',
      data.actionUrl || '',
      data.priority || 1,
      id
    );

    const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    if (!updated) return null;
    return {
      id: updated.id,
      title: updated.title,
      message: updated.message,
      type: updated.type,
      startDate: updated.start_date,
      endDate: updated.end_date,
      isActive: Boolean(updated.is_active),
      isPopup: Boolean(updated.is_popup),
      bannerUrl: updated.banner_url,
      actionUrl: updated.action_url,
      priority: updated.priority,
      createdAt: updated.created_at
    };
  },

  deleteEvent(id) {
    return db.prepare('DELETE FROM events WHERE id = ?').run(id);
  }
};

export default db;
