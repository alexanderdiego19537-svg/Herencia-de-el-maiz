import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Inicializar Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Inicializar Supabase SOLO si existen las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo no permitido. Usa POST.' });
  }

  try {
    // Si no hay API Key de Gemini, regresamos error
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Falta GEMINI_API_KEY en variables de entorno Vercel.'
      });
    }

    const { prompt, image } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No se envió ninguna pregunta al servidor.' });
    }

    // Configurar el modelo principal
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const contextPrompt = `Te llamas "ñu'mu", eres una Inteligencia Artificial lógica, reflexiva y analítica. Tienes conocimientos generales sobre cualquier tema, pero tu especialidad absoluta y principal enfoque es el maíz nativo de México, la cultura de Ixtenco, Tlaxcala y sus lenguas originarias (Otomí y Yuhmu).
Tu deber es dar siempre información verídica, clara, comprobada y de extremo rigor. 
Tus respuestas deben ser naturales, fluidas y conversacionales, como una IA estándar. Brinda la información completa y necesaria de forma estructurada, sin ser excesivamente larga ni redundante, pero tampoco demasiado breve.
Si el usuario te pide una TRADUCCIÓN a Otomí o Yuhmu, debes actuar como un traductor certificado: sé extremadamente preciso y fiel. No inventes palabras, usa solo términos documentados.
El usuario dirá: "${prompt}". Responde de forma lógica y profesional. Si es traducción, entrega solo la traducción exacta.`;

    let result;

    if (image) {
      const imageParts = [{ inlineData: { data: image, mimeType: "image/jpeg" } }];
      result = await model.generateContent([contextPrompt, ...imageParts]);
    } else {
      result = await model.generateContent(contextPrompt);
    }

    const responseText = result.response.text();

    // =============== SUPABASE (Registro en BD) ===============
    // Ahora está seguro y usa await correctamente para que no de crash en Vercel
    if (supabase) {
      try {
        const { error: sbError } = await supabase.from('ia-consultas').insert([{
          pregunta_usuario: prompt,
          respuesta_ia: responseText,
          tiene_imagen: !!image,
          fecha: new Date().toISOString()
        }]);
        
        if (sbError) {
          console.error("Supabase Error al Insertar:", sbError);
        } else {
          console.log("Supabase: Conversación guardada exitosamente.");
        }
      } catch (dbError) {
        console.log("Advertencia Excepcion Supabase:", dbError.message);
      }
    } else {
      console.log("Supabase NO está configurado. Faltan variables de entorno en Vercel.");
    }
    // =========================================================

    return res.status(200).json({ reply: responseText });

  } catch (error) {
    // CAPTURAMOS EL ERROR EXACTO PARA MOSTRARSELO AL FRONTEND Y SABER QUÉ ES
    console.error("Vercel Catch Error:", error);

    return res.status(500).json({
      error: `Gemini Falló Internamente: ${error.message}`,
      name: error.name,
      stack: error.stack
    });
  }
}
