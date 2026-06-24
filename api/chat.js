import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Personalidad base — conversacional y natural
const BASE_PERSONA = `Eres ñu'mu, una IA especializada en maíz nativo mexicano, la cultura de Ixtenco, Tlaxcala, y las lenguas Otomí/Yuhmu. También tienes conocimiento general.

Forma de hablar:
- Natural y directo. Como si hablaras con alguien de verdad.
- No empiezas con "¡Claro!", "Por supuesto!" o "Excelente pregunta". Solo responde.
- No repites la pregunta del usuario.
- Si no sabes algo con certeza, lo dices.
- CRÍTICO: Siempre termina tus oraciones completas. Nunca dejes una frase a la mitad.`;

// Instrucciones por modo — la brevedad la controla el PROMPT, no los tokens
const MODOS = {
  flash: {
    instruccion: `${BASE_PERSONA}

MODO RÁPIDO: Da UNA respuesta corta y completa. Máximo 2 oraciones bien terminadas. Sin listas, sin puntos. Solo lo más importante, directo y claro. Asegúrate de que la última oración quede cerrada correctamente.`,
    temperature: 0.7
  },
  normal: {
    instruccion: `${BASE_PERSONA}

MODO NORMAL: Responde de forma conversacional en 3-5 oraciones completas. Información clave, fluida y natural. Termina todas tus oraciones correctamente.`,
    temperature: 0.85
  },
  deep: {
    instruccion: `${BASE_PERSONA}

MODO PROFUNDO: Desarrolla una respuesta completa con contexto y detalles importantes. Usa párrafos o estructura clara. Termina todas las ideas correctamente.`,
    temperature: 0.9
  },
  expert: {
    instruccion: `${BASE_PERSONA}

MODO EXPERTO: Respuesta rigurosa y académica. Incluye datos específicos, contexto histórico o científico, y referencias culturales cuando aplique. Estructura clara. Completa todas las ideas.`,
    temperature: 0.5
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Falta GEMINI_API_KEY en variables de entorno Vercel.' });
    }

    const { prompt, image, mode = 'normal' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No se envió ninguna pregunta.' });
    }

    const modoConfig = MODOS[mode] || MODOS.normal;

    // Sin maxOutputTokens — la brevedad la controla el prompt, no el límite de tokens
    // Esto evita que las respuestas se corten a la mitad
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: modoConfig.temperature,
        stopSequences: [],
      }
    });

    const esTraduccion = prompt.toLowerCase().includes('traduce') ||
                         prompt.toLowerCase().includes('en otomí') ||
                         prompt.toLowerCase().includes('en yuhmu');

    let finalPrompt;
    if (esTraduccion) {
      finalPrompt = `Eres un traductor certificado de Otomí y Yuhmu (lengua de Ixtenco, Tlaxcala). Sé preciso y fiel. Solo usa términos documentados. Entrega únicamente la traducción, sin explicaciones adicionales.

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

    // Guardar en Supabase de forma no bloqueante
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
    console.error("Error:", error);
    return res.status(500).json({ error: `Error interno: ${error.message}` });
  }
}
