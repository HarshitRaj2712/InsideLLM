import { createStageUpdate } from '../nodeHelpers.js';

function calculateOverallScore(scores) {
  const financialHealth = scores.financialHealth ?? 0;
  const growthPotential = scores.growthPotential ?? 0;
  const marketPosition = scores.marketPosition ?? 0;
  const riskLevel = scores.riskLevel ?? 5;

  const adjustedRisk = 11 - Math.max(1, Math.min(10, riskLevel));
  const weightedScore = (financialHealth * 0.35) + (growthPotential * 0.25) + (marketPosition * 0.25) + (adjustedRisk * 0.15);

  return Number(weightedScore.toFixed(1));
}

function calculateConfidence(state, overallScore) {
  const evidenceCoverage = [state.companyOverview, state.financialData, state.recentNews.length, state.webResearch.length].filter(Boolean).length;
  const rawConfidence = 40 + (overallScore * 5) + (evidenceCoverage * 5);
  return Math.max(30, Math.min(95, Math.round(rawConfidence)));
}

function decideInvestment(overallScore, riskLevel) {
  if (overallScore >= 6.5 && riskLevel <= 7) {
    return 'INVEST';
  }

  return 'PASS';
}

export async function finalDecisionNode(state) {
  const overallScore = calculateOverallScore(state.scores);
  const decision = decideInvestment(overallScore, state.scores.riskLevel ?? 5);
  const confidenceScore = calculateConfidence(state, overallScore);

  return createStageUpdate(state, 'finalDecision', {
    overallScore,
    decision,
    finalDecision: decision,
    confidenceScore,
    investmentThesis: state.investmentThesis || `Based on the collected evidence, the company currently merits a ${decision} decision.`
  });
}
