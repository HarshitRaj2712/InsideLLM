import { createStageUpdate } from '../nodeHelpers.js';

export async function investmentScoringNode(state) {
  const hasFinancialData = Boolean(state.financialData);
  const hasWebResearch = state.webResearch.length > 0;
  const hasRecentNews = state.recentNews.length > 0;
  const riskLevel = typeof state.scores.riskLevel === 'number' ? state.scores.riskLevel : 5;

  return createStageUpdate(state, 'investmentScoring', {
    scores: {
      ...state.scores,
      financialHealth: hasFinancialData ? 6 : 2,
      growthPotential: hasWebResearch ? 6 : 2,
      marketPosition: hasRecentNews ? 5 : 3,
      riskLevel
    }
  });
}
