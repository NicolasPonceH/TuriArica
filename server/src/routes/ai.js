import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Groq from 'groq-sdk';
import { dbOperations } from '../db.js';
import { getLiveWeather } from './weather.js';
import { getAricaDutyPharmacies, HEALTH_CENTERS_ARICA } from './health.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

const router = Router();

// Reglas e instrucciones para el Asistente Turístico de Arica
const STRICT_SYSTEM_PROMPT = `Eres el asistente turístico oficial de Arica y de la región de Arica y Parinacota.

Instrucciones:
1. Basa tus respuestas en la información turística proporcionada en el "Contexto" (lugares, playas, surf, bodyboard, locomoción/micros, gastronomía, clima en vivo, salud y eventos).
2. Responde en español, con un tono cálido, amable, claro y entusiasta como un excelente guía local (aprox. 4–8 líneas).
3. Cuando te pregunten qué hacer, qué playas visitar, dónde surfear, cómo llegar en micro o el estado del clima, recomienda con confianza los sitios y datos indicados en el contexto.
4. Solo di "No tengo suficiente información para responder eso con certeza" si la pregunta es sobre algo completamente ajeno o fuera del alcance de Arica y su contexto turístico.
5. En ningún caso menciones qué modelo de IA eres ni hagas alusión a OpenAI, Groq u otras tecnologías. Preséntate y actúa siempre como el asistente turístico de Arica.`;

// Función auxiliar para compilar el contexto oficial desde SQLite, RedMeteo y Farmanet MINSAL
async function buildOfficialContext() {
  const places = dbOperations.getAllPlaces();
  const events = dbOperations.getActiveEvents();

  let weatherText = '';
  try {
    const weather = await getLiveWeather();
    if (weather && weather.current) {
      weatherText = `\n\n--- CONDICIÓN METEOROLÓGICA Y CLIMA EN TIEMPO REAL (ESTACIÓN CAPITANÍA DE PUERTO ARICA) ---
- Temperatura actual: ${weather.current.temp}°C
- Humedad relativa: ${weather.current.humidity}%
- Viento actual: ${weather.current.windSpeedKmH} km/h (Dirección ${weather.current.windDirection})
- Radiación solar: ${weather.current.solarRadiation !== null ? `${weather.current.solarRadiation} W/m²` : 'N/A'}
- Índice de radiación UV: ${weather.current.uvIndex}
- Fuente oficial: Red Meteorológica Aficionada de Chile (RedMeteo.cl), Estación ${weather.station.name} (${weather.station.code}).`;
    }
  } catch (e) {
    // Si falla el clima, continuar sin interrumpir el contexto
  }

  let healthText = '';
  try {
    const pharmacies = await getAricaDutyPharmacies();
    const dutyPharmaciesText = pharmacies && pharmacies.length > 0
      ? pharmacies.map(f => `- ${f.name}: ${f.address} (${f.neighborhood}). Turno: ${f.openTime} a ${f.closeTime}. Tel: ${f.phone}.`).join('\n')
      : 'Consultar farmacia de turno en Farmanet MINSAL.';

    const emergencyCentersText = HEALTH_CENTERS_ARICA
      .filter(c => c.is24h)
      .map(c => `- ${c.name}: ${c.address}. Horario: ${c.schedule}. Teléfono urgencia: ${c.phone} (Ambulancia SAMU: 131).`)
      .join('\n');

    healthText = `\n\n--- SALUD, FARMACIAS DE TURNO Y URGENCIAS EN ARICA (MINSAL / DISAM) ---
* Farmacias de turno vigentes hoy:
${dutyPharmaciesText}

* Centros de urgencia 24 horas:
${emergencyCentersText}

* Números de emergencia vital:
- SAMU Ambulancias: 131
- Hospital Dr. Juan Noé Crevani: +56 58 220 4000
- SAR Iris Véliz Hume: +56 58 238 6800
- Carabineros de Chile: 133
- Bomberos Arica: 132`;
  } catch (e) {
    // Si falla health, continuar
  }

  const placesContext = places.map(p => {
    const busLines = p.transport?.lineas?.length ? p.transport.lineas.join(', ') : 'No especificada';
    const parada = p.transport?.parada || 'N/A';
    const direccion = p.transport?.direccion || '';
    const letrero = p.transport?.letrero || '';
    return `### ${p.name} (Categoría: ${p.category} | Tipo: ${p.type})
- Descripción: ${p.fullDesc || p.shortDesc}
- Ubicación: Latitud ${p.lat}, Longitud ${p.lng}
- Cómo llegar / Locomoción: Micros [${busLines}]. Parada: ${parada}. Dirección/Letrero: ${letrero || direccion || 'N/A'}. Indicaciones adicionales: ${p.directions || 'Ver mapa'}.
- Horarios: ${p.hours || 'Sin horario especificado'}
- Precios: ${p.priceRange || 'Gratuito / Acceso libre'}
- Teléfono / Contacto: ${p.phone || 'N/A'} | Web: ${p.website || 'N/A'}
- Etiquetas de búsqueda: ${(p.aiTags || []).join(', ')}`;
  }).join('\n\n');

  const eventsContext = events.length > 0 ? events.map(e => {
    return `### [EVENTO O ALERTA ACTIVA] ${e.title} (${e.type.toUpperCase()})
- Mensaje: ${e.message}
- Fechas: Desde ${e.startDate || 'Ahora'} hasta ${e.endDate || 'Fin de temporada'}
- Más info: ${e.actionUrl || 'Consultar en la app'}`;
  }).join('\n\n') : 'No hay alertas ni eventos especiales vigentes en este momento.';

  const coastalSurfGuide = `\n\n--- GUÍA COSTERA, DEPORTES NÁUTICOS, PLAYAS Y SURF EN ARICA ---
* PLAYAS APTAS PARA SURF Y BODYBOARD EN ARICA:
1. Playa Las Machas: La playa insignia para surf y bodyboard en Arica (nivel intermedio a avanzado). Cuenta con olas consistentes sobre fondo arenoso, rompiente potente de orilla y escuelas locales de surf con arriendo de trajes y tablas. NO es apta para el baño debido a las fuertes corrientes de resaca.
2. Ex Isla Alacrán (Ola "El Gringo" y "El Buey"): Reconocida a nivel mundial como el "Pipeline chileno". "El Gringo" es una ola tubular perfecta, pesada y hueca que rompe sobre fondo de rocas filosas, sede de fechas del campeonato mundial WSL (World Surf League) y Arica Pro Tour. Solo para surfistas y bodyboarders de nivel experto. Al frente en mar abierto rompe "El Buey", ola gigante de mar abierto (big wave tow-in surfing) de hasta 6-8 metros de altura.
3. La Capilla / Sector Corazones: Rompientes de orilla rocosa hacia el sur de Arica, muy frecuentadas por bodyboarders locales.

* PLAYAS APTAS PARA BAÑO, NATACIÓN Y FAMILIAS (NO APTAS PARA SURF):
1. Playa El Laucho: Balneario protegido de aguas templadas y muy calmas (funciona como piscina natural), con rampas de accesibilidad universal hasta el agua. Apta para el baño. NO tiene olas para surf.
2. Playa La Lisera: Bahía en forma de herradura con aguas muy mansas y arena blanca, ideal para niños pequeños, natación y snorkel seguro. Apta para el baño.
3. Playa Chinchorro: Playa extensa de aguas cálidas y oleaje moderado. Apta para el baño, natación, stand up paddle (SUP), kayak y clases de surf de iniciación para niños pequeños.`;

  return {
    text: `--- LUGARES TURÍSTICOS, PATRIMONIALES Y SERVICIOS EN ARICA ---\n${placesContext}\n\n--- EVENTOS Y AVISOS OFICIALES ---\n${eventsContext}${weatherText}${healthText}${coastalSurfGuide}`,
    places,
    events
  };
}

// 1. Obtener contexto completo para alimentar una IA (RAG / System Prompt / Context Injection)
router.get('/context', async (req, res) => {
  try {
    const { text, places, events } = await buildOfficialContext();
    res.json({
      systemPrompt: STRICT_SYSTEM_PROMPT,
      context: text,
      summary: {
        totalPlaces: places.length,
        activeEvents: events.length,
        categories: [...new Set(places.map(p => p.category))]
      },
      places,
      events
    });
  } catch (error) {
    console.error('Error al generar contexto para IA:', error);
    res.status(500).json({ error: 'Error al compilar el contexto turístico.' });
  }
});

// 2. Chatbot con Groq AI (modelo openai/gpt-oss-20b con streaming SSE o respuesta JSON)
router.post('/chat', async (req, res) => {
  try {
    const { question, stream = false, groqApiKey, model = 'openai/gpt-oss-20b', history = [] } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'La pregunta no puede estar vacía.' });
    }

    const apiKey = groqApiKey || process.env.GROQ_API_KEY;
    const { text: contextText, places, events } = await buildOfficialContext();

    // Si no hay API Key de Groq configurada, avisar y ofrecer respuesta de la base de datos
    if (!apiKey) {
      if (stream) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        const msg = "⚠️ Para activar el modelo 'openai/gpt-oss-20b' con Groq, ingresa tu API Key en la barra superior o en el archivo server/.env (GROQ_API_KEY=tu_clave). Mientras tanto, te respondo con la base de datos local:";
        res.write(`data: ${JSON.stringify({ chunk: msg + "\n\n" })}\n\n`);

        const fallback = generateDatabaseFallback(question, places, events);
        res.write(`data: ${JSON.stringify({ chunk: fallback })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        return res.end();
      }

      return res.json({
        answer: generateDatabaseFallback(question, places, events),
        needsApiKey: true,
        model: 'database-grounded-fallback',
        notice: "Configura GROQ_API_KEY en server/.env o en el modal para usar 'openai/gpt-oss-20b'."
      });
    }

    // Inicializar cliente Groq
    const groq = new Groq({ apiKey });

    // Armar mensajes respetando las reglas estrictas del usuario
    const messages = [
      {
        role: 'system',
        content: STRICT_SYSTEM_PROMPT
      }
    ];

    // Incluir hasta 4 mensajes de historial reciente si existen
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-4)) {
        if (h.role && h.content) {
          messages.push({ role: h.role === 'bot' ? 'assistant' : 'user', content: h.content });
        }
      }
    }

    // Mensaje de usuario con el contexto inyectado
    messages.push({
      role: 'user',
      content: `Contexto:\n${contextText}\n\nPregunta:\n${question.trim()}`
    });

    // Parámetros de llamada a Groq
    const requestPayload = {
      model,
      messages,
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1
    };

    // Si el modelo admite reasoning_effort
    if (model.includes('gpt-oss') || model.includes('o1') || model.includes('o3')) {
      requestPayload.reasoning_effort = 'medium';
    }

    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      try {
        let groqStream;
        try {
          groqStream = await groq.chat.completions.create({
            ...requestPayload,
            stream: true
          });
        } catch (firstErr) {
          // Si el modelo openai/gpt-oss-20b no está habilitado para esta key, intentar con llama-3.3-70b-versatile
          console.warn(`[GROQ] Falló con modelo ${model}: ${firstErr.message}. Reintentando con llama-3.3-70b-versatile...`);
          groqStream = await groq.chat.completions.create({
            ...requestPayload,
            model: 'llama-3.3-70b-versatile',
            stream: true
          });
        }

        for await (const chunk of groqStream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            res.write(`data: ${JSON.stringify({ chunk: delta })}\n\n`);
          }
        }

        res.write(`data: [DONE]\n\n`);
        return res.end();
      } catch (streamError) {
        console.error('[GROQ STREAM ERROR]', streamError);
        res.write(`data: ${JSON.stringify({ chunk: `\n\n❌ Error de Groq: ${streamError.message}` })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        return res.end();
      }
    }

    // Modo no-stream (JSON estándar)
    let completion;
    try {
      completion = await groq.chat.completions.create({
        ...requestPayload,
        stream: false
      });
    } catch (firstErr) {
      console.warn(`[GROQ] Falló con modelo ${model}: ${firstErr.message}. Reintentando con llama-3.3-70b-versatile...`);
      completion = await groq.chat.completions.create({
        ...requestPayload,
        model: 'llama-3.3-70b-versatile',
        stream: false
      });
    }

    const answer = completion.choices[0]?.message?.content || 'No se pudo generar respuesta.';

    res.json({
      answer,
      model: completion.model || model,
      usage: completion.usage
    });
  } catch (error) {
    console.error('Error al consultar chat con IA:', error);
    res.status(500).json({
      error: 'Error al procesar la respuesta con Groq.',
      details: error.message
    });
  }
});

// 3. Endpoint de configuración para guardar/verificar GROQ_API_KEY
router.post('/config', (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || !apiKey.trim().startsWith('gsk_')) {
      return res.status(400).json({ error: 'La API Key debe comenzar con gsk_.' });
    }

    process.env.GROQ_API_KEY = apiKey.trim();

    // Actualizar server/.env si existe
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, 'utf-8');
      if (content.includes('GROQ_API_KEY=')) {
        content = content.replace(/GROQ_API_KEY=.*/g, `GROQ_API_KEY=${apiKey.trim()}`);
      } else {
        content += `\nGROQ_API_KEY=${apiKey.trim()}\nGROQ_MODEL=openai/gpt-oss-20b\n`;
      }
      fs.writeFileSync(envPath, content, 'utf-8');
    }

    res.json({ success: true, message: 'GROQ_API_KEY guardada exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la clave API.' });
  }
});

// 4. Fallback semántico basado estrictamente en la base de datos de Arica
function generateDatabaseFallback(question, places, events) {
  const q = question.toLowerCase().trim();

  // Búsqueda en nombre, categoría, descripción y transporte
  const matches = places.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const catMatch = p.category.toLowerCase().includes(q);
    const descMatch = (p.fullDesc || '').toLowerCase().includes(q);
    const busMatch = (p.transport?.lineas || []).some(l => q.includes(l.toLowerCase()));
    const tagMatch = (p.aiTags || []).some(t => q.includes(t.toLowerCase()));
    return nameMatch || catMatch || descMatch || busMatch || tagMatch;
  });

  if (matches.length > 0) {
    const top = matches.slice(0, 3);
    let out = top.map((p, idx) => {
      const bus = p.transport?.lineas?.length ? p.transport.lineas.join(', ') : 'N/A';
      return `${idx + 1}. **${p.name}** (${p.category}): ${p.shortDesc || p.fullDesc.slice(0, 150)}...\n   - 🚌 Micros: Línea ${bus} (Parada: ${p.transport?.parada || 'N/A'})\n   - 🕒 Horario: ${p.hours || 'Abierto todo el año'}`;
    }).join('\n\n');

    return out;
  }

  // Si la pregunta claramente no es de Arica (Regla 2 estricta)
  const isAricaRelated = ['arica', 'morro', 'playa', 'chinchorro', 'laucho', 'lisera', 'machas', 'momia', 'anzota', 'lluta', 'museo', 'micro', 'agro', 'azapa'].some(term => q.includes(term));
  if (!isAricaRelated) {
    return 'No tengo suficiente información para responder eso con certeza.';
  }

  return 'No tengo suficiente información en el contexto actual para responder con certeza sobre ese sitio específico.';
}

export default router;
