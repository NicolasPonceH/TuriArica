import { Router } from 'express';
import { dbOperations } from '../db.js';

const router = Router();

// 1. Obtener contexto completo para alimentar una IA (RAG / System Prompt / Context Injection)
router.get('/context', (req, res) => {
  try {
    const places = dbOperations.getAllPlaces();
    const events = dbOperations.getActiveEvents();

    // Generar formato texto enriquecido para LLMs (OpenAI, Gemini, Ollama, etc.)
    const placesContext = places.map(p => {
      const busLines = p.transport?.lineas?.length ? p.transport.lineas.join(', ') : 'No especificada';
      return `### ${p.name} (${p.category} - ${p.type})
- Descripción: ${p.fullDesc || p.shortDesc}
- Ubicación: Latitud ${p.lat}, Longitud ${p.lng}
- Cómo llegar / Locomoción colectiva: Líneas de micro: [${busLines}]. Dirección: ${p.directions || 'Ver mapa'}. Parada cercana: ${p.transport?.parada || 'N/A'}.
- Horarios: ${p.hours || 'Sin horario fijo'}
- Contacto: ${p.phone || 'N/A'} | Web: ${p.website || 'N/A'}
- Rango de precio: ${p.priceRange || 'N/A'}
- Tags: ${(p.aiTags || []).join(', ')}`;
    }).join('\n\n');

    const eventsContext = events.length > 0 ? events.map(e => {
      return `### [EVENTO VIGENTE] ${e.title} (${e.type.toUpperCase()})
- Mensaje: ${e.message}
- Fechas: Desde ${e.startDate || 'Ahora'} hasta ${e.endDate || 'Fin de temporada'}
- Más info: ${e.actionUrl || 'Consultar en sitio web'}`;
    }).join('\n\n') : 'No hay alertas ni eventos especiales en este momento.';

    const systemPrompt = `Eres "TuriArica AI", el guía turístico inteligente, cálido y experto de la ciudad de Arica, Chile ("La Ciudad de la Eterna Primavera").
Tu misión es guiar y asesorar a turistas y residentes con información verídica, amable y precisa basada en la siguiente base de conocimiento oficial:

--- BASE DE CONOCIMIENTO DE LUGARES EN ARICA ---
${placesContext}

--- EVENTOS Y ALERTAS ACTIVAS ---
${eventsContext}

Pautas para responder:
1. Responde siempre con entusiasmo, orgullo ariqueño y cortesía.
2. Si te preguntan cómo llegar, indica las líneas de microbús exactas registradas en la base de datos.
3. Si hay eventos o alertas vigentes que apliquen a la pregunta, recuérdalos proactivamente.
4. No inventes lugares que no existan; utiliza la información oficial provista.`;

    res.json({
      systemPrompt,
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

// 2. Endpoint de consulta / chat IA preparado para backend
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'La pregunta no puede estar vacía.' });
    }

    const q = question.toLowerCase().trim();
    const places = dbOperations.getAllPlaces();
    const events = dbOperations.getActiveEvents();

    // Búsqueda semántica preliminar en la base de datos
    const matchedPlaces = places.filter(p => {
      const inName = p.name.toLowerCase().includes(q);
      const inCategory = p.category.toLowerCase().includes(q);
      const inDesc = (p.fullDesc || '').toLowerCase().includes(q);
      const inTags = (p.aiTags || []).some(t => q.includes(t.toLowerCase()));
      return inName || inCategory || inDesc || inTags;
    });

    const relevantPlaces = matchedPlaces.length > 0 ? matchedPlaces : places.slice(0, 3);

    // Formatear respuesta con grounding en la base de datos
    let answer = '';
    if (matchedPlaces.length > 0) {
      const main = matchedPlaces[0];
      answer = `¡Hola! Te recomiendo especialmente visitar **${main.name}** (${main.category}). ${main.shortDesc || main.fullDesc}\n\n` +
        (main.transport?.lineas?.length ? `🚌 **Locomoción colectiva:** Puedes llegar en las micros línea **${main.transport.lineas.join(', ')}** (${main.transport.letrero || 'Dirección Centro/Mall'}).\n` : '') +
        (main.hours ? `🕒 **Horarios:** ${main.hours}\n` : '') +
        (main.directions ? `📍 **Dirección:** ${main.directions}\n` : '');

      if (matchedPlaces.length > 1) {
        answer += `\nOtros lugares relacionados en Arica son: ${matchedPlaces.slice(1, 3).map(p => p.name).join(', ')}.`;
      }
    } else {
      answer = `En Arica contamos con increíbles atractivos turísticos, playas y gastronomía como el **Morro de Arica**, las momias de **Colón 10**, **Playa El Laucho** y el **Terminal Agropecuario**. ¿Te gustaría saber sobre alguna categoría en particular (playas, historia, museos o comida)?`;
    }

    // Si hay un evento o festival activo, mencionarlo
    const activePopup = events.find(e => e.isPopup || e.type === 'festival');
    if (activePopup) {
      answer += `\n\n🎉 **Aviso importante:** Recuerda que está activo el evento: *${activePopup.title}*. ${activePopup.message}`;
    }

    res.json({
      answer,
      groundedPlaces: relevantPlaces.map(p => ({ id: p.id, name: p.name, category: p.category })),
      matchedCount: matchedPlaces.length
    });
  } catch (error) {
    console.error('Error al responder consulta con IA:', error);
    res.status(500).json({ error: 'Error al procesar la respuesta turística.' });
  }
});

// 3. Exportar Dataset para Fine-Tuning / RAG / Embeddings
router.get('/dataset', (req, res) => {
  try {
    const places = dbOperations.getAllPlaces();
    const dataset = places.map(p => ({
      id: `arica-place-${p.id}`,
      text: `${p.name} es un lugar turístico de tipo ${p.category} en Arica, Chile. ${p.fullDesc} Se ubica en latitud ${p.lat} y longitud ${p.lng}. Dirección: ${p.directions}. Locomoción: ${p.transport?.lineas?.join(', ') || 'Auto/Taxi'}. Horarios: ${p.hours}.`,
      metadata: {
        placeId: p.id,
        name: p.name,
        category: p.category,
        type: p.type,
        lat: p.lat,
        lng: p.lng
      }
    }));

    res.json(dataset);
  } catch (error) {
    res.status(500).json({ error: 'Error al exportar dataset para IA.' });
  }
});

export default router;
