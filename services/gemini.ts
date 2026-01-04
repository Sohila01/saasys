
export const geminiService = {
  async getDashboardInsights(data: any) {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dashboard_insights', data })
      });
      if (!res.ok) throw new Error(await res.text());
      const body = await res.json();
      return body.text;
    } catch (error) {
      console.error('Gemini Insight Error:', error);
      return 'Unable to generate AI insights at this time.';
    }
  },

  async getCustomAnalysis(prompt: string) {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'custom_analysis', prompt })
      });
      if (!res.ok) throw new Error(await res.text());
      const body = await res.json();
      return body.text;
    } catch (error) {
      console.error('Gemini Custom Error:', error);
      return 'Intelligence analysis interrupted.';
    }
  }
};
