import { createStageUpdate } from '../nodeHelpers.js';
import { searchRecentCompanyNews } from '../../tavily.service.js';

export async function recentNewsResearchNode(state) {
  const newsResult = await searchRecentCompanyNews(state.normalizedCompanyName || state.companyName);

  return createStageUpdate(state, 'recentNewsResearch', {
    recentNews: newsResult.headlines,
    sources: [...state.sources, ...newsResult.sources],
    errors: newsResult.error ? [...state.errors, newsResult.error] : state.errors
  });
}
