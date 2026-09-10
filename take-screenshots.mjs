import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  if (!fs.existsSync('public/docs')) {
    fs.mkdirSync('public/docs', { recursive: true });
  }

  console.log('Iniciando Playwright...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    console.log('Navegando a la app...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(4000); // Esperar a que cargue el video y las animaciones

    // Captura del Hero
    console.log('Capturando Hero...');
    await page.screenshot({ path: 'public/docs/hero.png' });

    // Captura de Lugares
    console.log('Capturando Lugares...');
    await page.evaluate(() => document.getElementById('lugares').scrollIntoView());
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'public/docs/lugares.png' });

    // Captura del Mapa
    console.log('Capturando Mapa...');
    await page.evaluate(() => document.getElementById('mapa').scrollIntoView());
    await page.waitForTimeout(2000); // Esperar a que carguen los tiles del mapa
    // Seleccionar un lugar en el mapa para mostrar el panel de locomoción
    await page.selectOption('select', '14'); // Paseo 21 de Mayo
    await page.waitForTimeout(1000);
    // Trazar ruta en el mapa
    await page.click('text=Trazar Ruta');
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'public/docs/mapa.png' });

    // Captura del Asistente
    console.log('Capturando Asistente...');
    // Clic en la tuerca
    await page.click('button[aria-label="Herramientas de accesibilidad"]');
    await page.waitForTimeout(1000);
    // Clic en Turi-Asistente (buscando por texto)
    await page.click('text=Turi-Asistente');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'public/docs/asistente.png' });

    if (!fs.existsSync('docs')) {
      fs.mkdirSync('docs', { recursive: true });
    }
    fs.copyFileSync('public/docs/hero.png', 'docs/hero.png');
    fs.copyFileSync('public/docs/lugares.png', 'docs/lugares.png');
    fs.copyFileSync('public/docs/mapa.png', 'docs/mapa.png');
    fs.copyFileSync('public/docs/asistente.png', 'docs/asistente.png');

    console.log('Todas las capturas generadas y sincronizadas en docs/ y public/docs/');
  } catch (err) {
    console.error('Error durante la captura:', err);
  } finally {
    await browser.close();
  }
})();
