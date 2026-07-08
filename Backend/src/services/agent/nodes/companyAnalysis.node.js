import { createStageUpdate } from '../nodeHelpers.js';
import { generateCompanyAnalysis } from '../../gemini.service.js';

export async function companyAnalysisNode(state) {
  const geminiResult = await generateCompanyAnalysis(state);

  if (geminiResult.error || !geminiResult.data) {
    const fallbackAnalysis = {
      companyOverview: state.companyOverview,
      strengths: state.strengths,
      recentDevelopments: state.recentNews,
      investmentThesis: state.investmentThesis,
      errors: geminiResult.error ? [...state.errors, geminiResult.error] : state.errors
    };

    return createStageUpdate(state, 'companyAnalysis', fallbackAnalysis);
  }

  const strengths = Array.isArray(geminiResult.data.strengths) ? geminiResult.data.strengths.filter(Boolean) : state.strengths;
  const recentDevelopments = Array.isArray(geminiResult.data.recentDevelopments)
    ? geminiResult.data.recentDevelopments.filter(Boolean)
    : state.recentNews;

  return createStageUpdate(state, 'companyAnalysis', {
    companyOverview: typeof geminiResult.data.companyOverview === 'string' ? geminiResult.data.companyOverview : state.companyOverview,
    strengths,
    recentDevelopments,
    investmentThesis: typeof geminiResult.data.investmentThesis === 'string' ? geminiResult.data.investmentThesis : state.investmentThesis,
    errors: Array.isArray(geminiResult.data.errors) ? [...state.errors, ...geminiResult.data.errors] : state.errors
  });
}
