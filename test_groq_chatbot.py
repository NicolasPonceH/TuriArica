#!/usr/bin/env python3
"""
TuriArica - Script de Prueba del Chatbot con Groq AI y openai/gpt-oss-20b
Este script ejecuta el modelo openai/gpt-oss-20b de Groq alimentado
directamente con la base de conocimiento oficial de Arica y Parinacota.
"""

import os
import sys
import json
import urllib.request
from groq import Groq

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# 1. Configuración de API Key
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    # Intentar leer de server/.env
    try:
        env_path = os.path.join(os.path.dirname(__file__), "server", ".env")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("GROQ_API_KEY=") and len(line.strip().split("=", 1)) > 1:
                        val = line.strip().split("=", 1)[1].strip()
                        if val:
                            GROQ_API_KEY = val
                            break
    except Exception:
        pass

if not GROQ_API_KEY:
    print("\n⚠️  No se encontró la variable GROQ_API_KEY en el entorno ni en server/.env")
    GROQ_API_KEY = input("👉 Ingresa tu GROQ_API_KEY para continuar (o Enter para salir): ").strip()
    if not GROQ_API_KEY:
        print("Operación cancelada. Puedes definir 'GROQ_API_KEY' en tu entorno o en server/.env")
        sys.exit(1)

client = Groq(api_key=GROQ_API_KEY)

# 2. Obtener el contexto oficial de la base de datos (Backend o Fallback local)
def get_official_context():
    url = "http://localhost:5000/api/ai/context"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "TuriArica-CLI/1.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("context"):
                print(f"✅ Contexto completo obtenido del servidor backend ({len(data.get('places', []))} lugares, {len(data.get('events', []))} eventos y estación meteorológica en vivo).")
                return data["context"]

            places = data.get("places", [])
            events = data.get("events", [])
            print(f"✅ Contexto obtenido del servidor backend: {len(places)} lugares y {len(events)} eventos.")
            
            lines = []
            lines.append("--- LUGARES TURÍSTICOS Y SERVICIOS EN ARICA ---")
            for p in places:
                bus = ", ".join(p.get("transport", {}).get("lineas", [])) if isinstance(p.get("transport"), dict) else "N/A"
                parada = p.get("transport", {}).get("parada", "N/A") if isinstance(p.get("transport"), dict) else "N/A"
                lines.append(
                    f"- {p.get('name')} ({p.get('category')}): {p.get('fullDesc') or p.get('shortDesc')}\n"
                    f"  Dirección: {p.get('directions') or 'Centro de Arica'}. "
                    f"  Locomoción colectiva: Micros [{bus}] (Parada: {parada}). "
                    f"  Horario: {p.get('hours') or 'Abierto'}. "
                    f"  Precio: {p.get('priceRange') or 'Gratuito'}."
                )
            if events:
                lines.append("\n--- EVENTOS Y ALERTAS ACTIVAS ---")
                for e in events:
                    lines.append(f"- {e.get('title')}: {e.get('message')} ({e.get('startDate', '')} a {e.get('endDate', '')})")
            return "\n".join(lines)
    except Exception:
        print("ℹ️  Backend no responde en http://localhost:5000, usando base de datos local integrada...")
        return (
            "--- LUGARES TURÍSTICOS Y SERVICIOS EN ARICA ---\n"
            "- Playa El Laucho (Playa): Balneario familiar de aguas calmas, apta para baño con rampas accesibles.\n"
            "  Dirección: Av. Comandante San Martín al sur. Micros: [12, 14, 10, 8] (Parada: Av. Comandante San Martín). Horario: 24h.\n"
            "- Museo de Sitio Colón 10 (Museo): Resguarda momias de la Cultura Chinchorro in situ (7.000 años).\n"
            "  Dirección: Calle Colón 10. Micros: [1, 2, 3, 5, 7, 10, 11, 16, 113] (Parada: Calle Colón). Horario: Mar-Dom 09:00-18:00.\n"
            "- El Morro de Arica (Histórico): Peñón histórico de 139m con museo y vista panorámica.\n"
            "  Dirección: Acceso por Av. Colón o Sotomayor. Micros: [12, 14, 10, 8] (Parada: Pies del Morro). Horario: Mar-Dom 08:00-18:00.\n"
            "- Humedal del Río Lluta (Naturaleza): Santuario de aves migratorias (flamencos, patos jergón).\n"
            "  Dirección: Desembocadura Río Lluta. Locomoción: Solo taxi o auto particular. Horario: 08:00-18:30.\n"
            "- Terminal Agropecuario ASOCAPEC (Gastronomía): Frutas tropicales, aceitunas de Azapa y comida típica.\n"
            "  Dirección: Panamericana Norte. Micros: [12, 14, 8, 16, 113] (Letrero Agro). Horario: 06:00-18:00.\n"
            "- Playa Chinchorro (Playa): Aguas cálidas y oleaje moderado para natación y paseo familiar.\n"
            "  Dirección: Av. Raúl Pey Casado. Micros: [12, 14] (España con Buenos Aires). Horario: 24h.\n"
            "- Playa Las Machas (Playa): Surf y bodyboard, corrientes fuertes, NO apta para baño.\n"
            "  Dirección: Av. Las Dunas. Micros: [12, 14] (Eliat con Av. España). Horario: 24h."
        )

SYSTEM_PROMPT = """Eres un asistente turístico de Arica y la región de Arica y Parinacota.

Reglas estrictas:
1. Responde ÚNICAMENTE con base en la información que se te proporcione en el campo "contexto".
2. Si la pregunta no se puede responder con esa información, di claramente: 
   "No tengo suficiente información para responder eso con certeza."
3. No inventes direcciones, horarios, precios, nombres de lugares ni rutas de locomoción.
4. Si el usuario pide recomendaciones, usa solo los sitios y datos que aparezcan en el contexto.
5. Responde en español, de forma clara, amable y concreta (máx. 6–8 líneas, salvo que se pida más detalle).
6. Cuando des direcciones o cómo llegar, sé específico (nombre de paradas, líneas de micro, puntos de referencia) pero solo si están en el contexto.
7. Si hay varios lugares que cumplen, enumera hasta 3 opciones como máximo, con nombre y una frase de por qué recomendarlos."""

def ask_groq(question: str, context: str):
    print(f"\n👤 Usuario: {question}")
    print("🤖 TuriArica AI (openai/gpt-oss-20b): ", end="", flush=True)

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Contexto:\n{context}\n\nPregunta:\n{question}"
                }
            ],
            temperature=1,
            max_completion_tokens=2048,
            top_p=1,
            reasoning_effort="medium",
            stream=True,
            stop=None
        )

        for chunk in completion:
            delta = chunk.choices[0].delta.content or ""
            print(delta, end="", flush=True)
        print("\n")
    except Exception as e:
        print(f"\n❌ Error al consultar Groq: {e}")
        # Si el modelo específico no está disponible para esta key, intentar fallback con llama-3.3-70b-versatile
        if "model" in str(e).lower() or "not found" in str(e).lower():
            print("🔄 Reintentando con modelo alternativo 'llama-3.3-70b-versatile'...")
            try:
                completion = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": f"Contexto:\n{context}\n\nPregunta:\n{question}"}
                    ],
                    temperature=1,
                    max_completion_tokens=2048,
                    stream=True
                )
                for chunk in completion:
                    print(chunk.choices[0].delta.content or "", end="", flush=True)
                print("\n")
            except Exception as e2:
                print(f"❌ Error en fallback: {e2}")

def main():
    print("=" * 65)
    print("🌴 TuriArica AI - Prueba del Chatbot con Groq Cloud (openai/gpt-oss-20b)")
    print("=" * 65)
    
    context = get_official_context()
    
    # Pruebas automatizadas rápidas
    sample_questions = [
        "¿Qué micro me lleva a la Playa El Laucho y qué características tiene?",
        "¿Dónde puedo ver las momias Chinchorro y en qué horario atienden?",
        "¿Cuáles son los mejores lugares de surf en Arica?",
        "¿Cómo llego a las pirámides de Egipto?" # Prueba de Regla 2 (debe responder 'No tengo suficiente información...')
    ]
    
    print("\nPresiona [1] para ejecutar preguntas de prueba automatizadas.")
    print("Presiona [2] para modo interactivo (escribir tus preguntas en vivo).")
    opt = input("Opción (1 o 2, default 2): ").strip()
    
    if opt == "1":
        for q in sample_questions:
            ask_groq(q, context)
            print("-" * 50)
    else:
        print("\n💬 Modo interactivo activado. Escribe 'salir' para terminar.\n")
        while True:
            try:
                user_q = input("Pregunta: ").strip()
                if not user_q:
                    continue
                if user_q.lower() in ["salir", "exit", "quit"]:
                    print("¡Hasta pronto!")
                    break
                ask_groq(user_q, context)
            except KeyboardInterrupt:
                print("\nSaliendo...")
                break

if __name__ == "__main__":
    main()
