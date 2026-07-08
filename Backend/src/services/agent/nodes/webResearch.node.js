import { createStageUpdate } from '../nodeHelpers.js';
import { searchCompanyWebContext } from '../../tavily.service.js';

export async function webResearchNode(state) {
  const webResearchResult = await searchCompanyWebContext(state.normalizedCompanyName || state.companyName);

  return createStageUpdate(state, 'webResearch', {
    webResearch: webResearchResult.researchItems,
    sources: [...state.sources, ...webResearchResult.sources],
    errors: webResearchResult.error ? [...state.errors, webResearchResult.error] : state.errors,
    companyOverview: webResearchResult.summary ?? state.companyOverview
  });
}
