import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Instrucciones de personalidad base — conversacional y natural
const BASE_PERSONA = `Eres ñu'mu, una IA especializada en maíz nativo mexicano, la cultura de Ixtenco, Tlaxcala, y las lenguas Otomí/Yuhmu. También tienes conocimiento general sobre cualquier tema.

Tu forma de hablar:
- Eres directo, claro y natural. Como si hablaras con alguien de verdad, no como un manual.
- Usas español fluido y cotidiano, sin ser informal en exceso.
- No empiezas respuestas con "¡Claro!" ni "Por supuesto!" ni "Excelente pregunta". Simplemente responde.
- No repites la pregunta del usuario al inicio de tu respuesta.
- Si es una pregunta simple, responde simple. Si es compleja, das más detalle.
- Cuando no sabes algo con certeza, lo dices honestamente.
- Si el tema es sobre maíz, Ixtenco, o lenguas originarias, eres especialmente preciso y apasionado.`;

// Configuraciones por modo
const MODOS = {
  flash: {
    instruccion: `${BASE_PERSONA}

MODO: Rápido.
Responde en máximo 2 oraciones. Solo lo esencial, nada de relleno. Directo al punto.`,
    maxTokens: 150
  },
  normal: {
    instruccion: `${BASE_PERSONA}

MODO: Normal.
Responde de forma conversacional en 3-5 oraciones. Da la información clave sin extenderte demasiado. Natural y fluido.`,
    maxTokens: 400
  },
  deep: {
    instruccion: `${BASE_PERSONA}

MODO: Profundo.
Desarrolla una respuesta completa con contexto, detalles relevantes y matices importantes. Puedes usar párrafos o una estructura clara si el tema lo requiere. Tómate el tiempo necesario para explicar bien.`,
    maxTokens: 1000
  },
  expert: {
    instruccion: `${BASE_PERSONA}

MODO: Experto.
Respuesta detallada y académicamente rigurosa. Incluye datos específicos, contexto histórico o científico, referencias culturales cuando aplique. Usa estructura clara. Es el análisis más completo que puedes dar sobre el tema.`,
    maxTokens: 2000
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Falta GEMINI_API_KEY en variables de entorno Vercel.'
      });
    }

    const { prompt, image, mode = 'normal' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No se envió ninguna pregunta.' });
    }

    // Seleccionar configuración del modo
    const modoConfig = MODOS[mode] || MODOS.normal;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: modoConfig.maxTokens,
        temperature: mode === 'flash' ? 0.7 : mode === 'expert' ? 0.3 : 0.9,
      }
    });

    // Si es traducción, override todo con prompt especializado
    const esTraduccion = prompt.toLowerCase().includes('traduce') || prompt.toLowerCase().includes('en otomí') || prompt.toLowerCase().includes('en yuhmu');
    
    let finalPrompt;
    if (esTraduccion) {
      finalPrompt = `Eres un traductor certificado de Otomí y Yuhmu (lengua de Ixtenco, Tlaxcala). Traduce de forma precisa y fiel. Solo usa términos documentados, nunca inventes palabras. Entrega únicamente la traducción solicitada, sin explicaciones adicionales a menos que el usuario las pida.

${prompt}`;
    } else {
      finalPrompt = `${modoConfig.instruccion}

El usuario pregunta: "${prompt}"`;
    }

    let result;
    if (image) {
      const imageParts = [{ inlineData: { data: image, mimeType: "image/jpeg" } }];
      result = await model.generateContent([finalPrompt, ...imageParts]);
    } else {
      result = await model.generateContent(finalPrompt);
    }

    const responseText = result.response.text();

    // Guardar en Supabase (no bloquea la respuesta)
    if (supabase) {
      supabase.from('ia-consultas').insert([{
        pregunta_usuario: prompt,
        respuesta_ia: responseText,
        modo_respuesta: mode,
        tiene_imagen: !!image,
        fecha: new Date().toISOString()
      }]).then(({ error: sbError }) => {
        if (sbError) console.error("Supabase Error:", sbError);
      }).catch(e => console.log("Supabase Exception:", e.message));
    }

    return res.status(200).json({ reply: responseText, mode });

  } catch (error) {
    console.error("Vercel Catch Error:", error);
    return res.status(500).json({
      error: `Error interno: ${error.message}`,
      name: error.name
    });
  }
}
