import { env } from '../config/env.js';
import { z } from 'zod';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const companyAnalysisSchema = z.object({
  companyOverview: z.string().nullable().optional(),
  strengths: z.array(z.string()).default([]),
  recentDevelopments: z.array(z.string()).default([]),
  investmentThesis: z.string().nullable().optional(),
  errors: z.array(z.string()).default([])
});

let modelClient = null;

function getModelClient() {
  if (!env.GEMINI_API_KEY) {
    return null;
  }

  if (!modelClient) {
    modelClient = new ChatGoogleGenerativeAI({
      apiKey: env.GEMINI_API_KEY,
      model: env.GEMINI_MODEL,
      temperature: 0.2
    });
  }

  return modelClient;
}

async function callGeminiStructured(payload, systemInstruction) {
  const client = getModelClient();

  if (!client) {
    return { error: 'GEMINI_API_KEY is not configured', data: null };
  }

  try {
    const structuredModel = client.withStructuredOutput(companyAnalysisSchema, {
      name: 'company_analysis_output'
    });

    const response = await structuredModel.invoke([
      ['system', systemInstruction],
      [
        'human',
        JSON.stringify(
          {
            companyName: payload.companyName,
            overview: payload.companyOverview,
            webResearch: payload.webResearch,
            financialData: payload.financialData,
            recentNews: payload.recentNews,
            riskFactors: payload.riskFactors,
            scores: payload.scores,
            sources: payload.sources
          },
          null,
          2
        )
      ]
    ]);

    return { error: null, data: companyAnalysisSchema.parse(response) };
  } catch (error) {
    return { error: error?.message || 'Gemini request failed', data: null };
  }
}

export async function generateCompanyAnalysis(payload) {
  const systemInstruction = [
    'You are an investment research analyst.',
    'Use only the provided evidence.',
    'Return a concise structured analysis with companyOverview, strengths, recentDevelopments, investmentThesis, and errors.',
    'Do not invent financial data or sources.',
    'Keep the language concise and investor-focused.'
  ].join(' ');

  return callGeminiStructured(payload, systemInstruction);
}
