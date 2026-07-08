import { createStageUpdate } from '../nodeHelpers.js';
import { fetchCompanyFinancialData } from '../../alphaVantage.service.js';

export async function financialResearchNode(state) {
  const financialResult = await fetchCompanyFinancialData(state.normalizedCompanyName || state.companyName);

  return createStageUpdate(state, 'financialResearch', {
    financialData: financialResult.metrics,
    sources: [...state.sources, ...financialResult.sources],
    errors: financialResult.error ? [...state.errors, financialResult.error] : state.errors
  });
}
