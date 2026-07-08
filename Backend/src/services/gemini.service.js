import { env } from '../config/env.js';

function extractJsonBlock(text) {
  const trimmedText = String(text || '').trim();

  if (!trimmedText) {
    throw new Error('Gemini returned an empty response');
  }

  try {
    return JSON.parse(trimmedText);
  } catch {
    const firstBrace = trimmedText.indexOf('{');
    const lastBrace = trimmedText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error('Gemini response was not valid JSON');
    }

    return JSON.parse(trimmedText.slice(firstBrace, lastBrace + 1));
  }
}

async function callGeminiJson(prompt, systemInstruction) {
  if (!env.GEMINI_API_KEY) {
    return { error: 'GEMINI_API_KEY is not configured', data: null };
  }

  const response = await fetch(
    `${env.GEMINI_BASE_URL}/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = payload?.error?.message || payload?.error?.status || 'Gemini request failed';
    return { error: errorMessage, data: null };
  }

  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join('') ?? '';

  try {
    return { error: null, data: extractJsonBlock(text) };
  } catch (parseError) {
    return { error: parseError.message, data: null };
  }
}

export async function generateCompanyAnalysis(payload) {
  const systemInstruction = [
    'You are an investment research analyst.',
    'Use only the provided evidence.',
    'Return only valid JSON.',
    'Do not invent financial data or sources.',
    'Keep the language concise and investor-focused.'
  ].join(' ');

  const prompt = JSON.stringify({
    companyName: payload.companyName,
    overview: payload.companyOverview,
    webResearch: payload.webResearch,
    financialData: payload.financialData,
    recentNews: payload.recentNews,
    riskFactors: payload.riskFactors,
    scores: payload.scores,
    sources: payload.sources
  }, null, 2);

  return callGeminiJson(prompt, systemInstruction);
}
