// scripts/update_geo_data.mjs
import fs from 'node:fs';

async function updateMapGeoData() {
  const p12 = [[-70.2950, -18.5020], [-70.2980, -18.4900], [-70.3010, -18.4680], [-70.3150, -18.4480]];
  const p7 = [[-70.3080, -18.4850], [-70.3140, -18.4790], [-70.3180, -18.4770], [-70.3240, -18.4760]];
  const p1 = [[-70.2850, -18.5100], [-70.2970, -18.4950], [-70.3170, -18.4780]];

  async function getCoords(pts) {
    const s = pts.map(p => p.join(',')).join(';');
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${s}?overview=full&geometries=geojson`);
    const data = await res.json();
    return data.routes[0].geometry.coordinates;
  }

  console.log('Fetching OSRM routes...');
  const c12 = await getCoords(p12);
  const c7 = await getCoords(p7);
  const c1 = await getCoords(p1);
  console.log(`Fetched: L12=${c12.length}, L7=${c7.length}, C1=${c1.length}`);

  let content = fs.readFileSync('src/data/mapGeoData.js', 'utf-8');

  // Replace line 12 coordinates
  const regex12 = /(id:\s*"linea-micro-12"[\s\S]*?geometry:\s*\{[\s\S]*?type:\s*"LineString",\s*coordinates:\s*)\[[\s\S]*?\](\s*\})/;
  content = content.replace(regex12, `$1${JSON.stringify(c12)}$2`);

  // Replace line 7 coordinates
  const regex7 = /(id:\s*"linea-micro-07"[\s\S]*?geometry:\s*\{[\s\S]*?type:\s*"LineString",\s*coordinates:\s*)\[[\s\S]*?\](\s*\})/;
  content = content.replace(regex7, `$1${JSON.stringify(c7)}$2`);

  // Replace line 1 coordinates
  const regex1 = /(id:\s*"linea-colectivo-01"[\s\S]*?geometry:\s*\{[\s\S]*?type:\s*"LineString",\s*coordinates:\s*)\[[\s\S]*?\](\s*\})/;
  content = content.replace(regex1, `$1${JSON.stringify(c1)}$2`);

  fs.writeFileSync('src/data/mapGeoData.js', content, 'utf-8');
  console.log('src/data/mapGeoData.js successfully updated with real road coordinates!');
}

updateMapGeoData().catch(console.error);
