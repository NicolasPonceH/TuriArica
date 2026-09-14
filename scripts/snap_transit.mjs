// scripts/snap_transit.mjs
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../server/database/turiarica.db');
const db = new DatabaseSync(dbPath);

async function fetchRoute(waypoints) {
  const coordsString = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
  console.log(`Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM error: ${res.status}`);
  const data = await res.json();
  if (!data.routes || !data.routes.length) throw new Error('No route found');
  return data.routes[0].geometry.coordinates;
}

async function run() {
  const lines = db.prepare('SELECT id, nombre, paradas_json FROM transit_lines').all();
  console.log(`Found ${lines.length} lines in DB`);

  const results = {};

  for (const line of lines) {
    const paradas = JSON.parse(line.paradas_json || '[]');
    if (paradas.length >= 2) {
      const waypoints = paradas.map(p => [p.lng, p.lat]);
      try {
        const coords = await fetchRoute(waypoints);
        console.log(`Line ${line.nombre} snapped: ${coords.length} road coordinates`);
        const geom = { type: 'LineString', coordinates: coords };
        db.prepare('UPDATE transit_lines SET geometry_json = ? WHERE id = ?').run(
          JSON.stringify(geom),
          line.id
        );
        results[line.id] = coords;
      } catch (err) {
        console.error(`Error for ${line.id}:`, err.message);
      }
    }
  }

  // Also write to a json file so we can inspect and update mapGeoData.js
  const fs = await import('node:fs/promises');
  await fs.writeFile(
    path.resolve(__dirname, 'snapped_routes.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );
  console.log('Done! Saved to scripts/snapped_routes.json');
}

run().catch(console.error);
