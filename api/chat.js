const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");

// Inicializar Google Gemini
// Usar gemini-1.5-flash ya que admite imágenes y texto de forma rápida
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Inicializar Supabase (Opcional, pero recomendado para el registro histórico)
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Si no hay API Key de Gemini, regresamos error
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'La API Key de Gemini no está configurada en las Variables de Entorno de Vercel.' 
    });
  }

  try {
    const { prompt, image } = req.body;
    
    // Configurar el modelo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Instrucción de contexto (System Prompt) para que la IA asuma su rol
    const contextPrompt = `Eres el "Guardián de las Semillas", un experto, historiador y agrónomo sobre el maíz nativo de México, específicamente de la región de Ixtenco, Tlaxcala. 
Tu objetivo es dar respuestas precisas, culturales y científicas sobre las razas de maíz, su nutrición, y la cultura Otomí-Yuhmu.
El usuario preguntará lo siguiente: "${prompt}". Responde de forma cálida, profesional y concisa (no más de 3 párrafos).`;

    let result;

    if (image) {
      // Si el usuario subió una imagen, la enviamos junto con el texto
      const imageParts = [
        {
          inlineData: {
            data: image, // Base64
            mimeType: "image/jpeg" // Asumimos jpeg/png/webp
          }
        }
      ];
      result = await model.generateContent([contextPrompt, ...imageParts]);
    } else {
      // Si solo es texto
      result = await model.generateContent(contextPrompt);
    }

    const responseText = result.response.text();

    // =============== SUPABASE (Registro en BD) ===============
    // Intentamos guardar la interacción en la base de datos si está configurada
    if (supabase) {
      try {
        await supabase
          .from('ia_consultas')
          .insert([
            {
              pregunta_usuario: prompt,
              respuesta_ia: responseText,
              tiene_imagen: !!image,
              fecha: new Date().toISOString()
            }
          ]);
      } catch (dbError) {
        console.error("Error guardando en Supabase:", dbError);
        // No fallamos la respuesta si Supabase falla
      }
    }
    // =========================================================

    // Devolvemos la respuesta
    return res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error("Error de Inteligencia Artificial:", error);
    return res.status(500).json({ 
      error: 'Ocurrió un error al procesar tu solicitud con la Inteligencia Artificial.',
      details: error.message 
    });
  }
}
