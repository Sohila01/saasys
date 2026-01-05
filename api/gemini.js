// Serverless API for calling Google GenAI securely (Vercel)
export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, data, prompt } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY not configured');
    return res.status(500).json({ 
      error: 'Gemini API not configured',
      message: 'Please add GEMINI_API_KEY to environment variables'
    });
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);

    if (action === 'dashboard_insights') {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Analyze this SaaS dashboard data and provide 3 key business insights in bullet points. Data: ${JSON.stringify(data)}`;
      
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      
      return res.status(200).json({ text });
    }

    if (action === 'custom_analysis') {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt || '');
      const text = await result.response.text();
      
      return res.status(200).json({ text });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    console.error('Gemini API error:', err);
    return res.status(500).json({ 
      error: 'Gemini API error', 
      detail: err.message || String(err)
    });
  }
}
