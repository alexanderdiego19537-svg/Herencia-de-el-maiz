import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar Google Gemini
// Usar gemini-1.5-flash ya que admite imágenes y texto de forma rápida
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

    // Configurar el modelo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Instrucción de contexto (System Prompt)
    const contextPrompt = `Eres "ñu’mu", un experto, historiador y agrónomo sobre el maíz nativo de México, específicamente de la región de Ixtenco, Tlaxcala. 
Tu objetivo es dar respuestas precisas, culturales y científicas sobre las razas de maíz, su nutrición, y la cultura Otomí-Yuhmu.
El usuario preguntará lo siguiente: "${prompt}". Responde de forma cálida, profesional y concisa (no más de 3 párrafos).`;

    let result;

    if (image) {
      const imageParts = [{ inlineData: { data: image, mimeType: "image/jpeg" } }];
      result = await model.generateContent([contextPrompt, ...imageParts]);
    } else {
      result = await model.generateContent(contextPrompt);
    }

    const responseText = result.response.text();

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
