// Serverless API for calling Google GenAI securely (Vercel)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { action, data, prompt } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    if (action === 'dashboard_insights') {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze this SaaS dashboard data and provide 3 key business insights in bullet points. Data: ${JSON.stringify(data)}`,
        config: {
          systemInstruction: "You are a world-class business analyst. Provide concise, high-impact strategic insights.",
          temperature: 0.7
        }
      });
      return res.status(200).json({ text: response.text });
    }

    if (action === 'custom_analysis') {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt || '',
        config: { systemInstruction: 'Analyze the provided dataset within its business context.', temperature: 0.5 }
      });
      return res.status(200).json({ text: response.text });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('Gemini API error:', err);
    return res.status(500).json({ error: 'Gemini API error', detail: String(err) });
  }
}
