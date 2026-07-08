function countNegativeSignals(textItems = []) {
  const negativeTerms = ['lawsuit', 'decline', 'drop', 'layoff', 'fraud', 'probe', 'risk', 'loss', 'weak', 'downgrade'];

  return textItems.reduce((count, item) => {
    const normalizedText = String(item).toLowerCase();
    const containsNegativeSignal = negativeTerms.some((term) => normalizedText.includes(term));
    return containsNegativeSignal ? count + 1 : count;
  }, 0);
}

export function analyzeRiskSignals(state) {
  const riskFactors = [];
  let riskScore = 5;

  if (!state.financialData) {
    riskFactors.push('Structured financial data is unavailable, which increases decision uncertainty.');
    riskScore += 1;
  }

  if (!state.webResearch.length) {
    riskFactors.push('No current web research was collected.');
    riskScore += 1;
  }

  if (!state.recentNews.length) {
    riskFactors.push('No recent company news was collected.');
    riskScore += 1;
  }

  const negativeNewsSignals = countNegativeSignals(state.recentNews);
  if (negativeNewsSignals > 0) {
    riskFactors.push(`Recent news contains ${negativeNewsSignals} potentially negative signal(s).`);
    riskScore += Math.min(2, negativeNewsSignals);
  }

  const cappedRiskScore = Math.max(1, Math.min(10, riskScore));

  return {
    riskFactors,
    scores: {
      riskLevel: cappedRiskScore
    }
  };
}