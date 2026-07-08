function formatWarnings(errors = []) {
  const warnings = errors.map((error) => {
    const message = String(error);

    if (
      message.includes('429') ||
      message.includes('quota') ||
      message.includes('Too Many Requests')
    ) {
      return 'AI analysis is temporarily unavailable due to API rate limits.';
    }

    if (
      message.includes('No overview data') ||
      message.includes('ALPHAVANTAGE')
    ) {
      return 'Structured financial data could not be retrieved.';
    }

    if (message.includes('fetch failed')) {
      return 'An external research service could not be reached.';
    }

    return 'Some research data could not be retrieved.';
  });

  return [...new Set(warnings)];
}

export function formatResearchReport(state) {
  const company =
    state.normalizedCompanyName ||
    state.companyName;

  const warnings = formatWarnings(state.errors);

  return {
    company,

    decision: state.finalDecision || state.decision,

    confidence: state.confidenceScore,

    overallScore: state.overallScore,

    scores: state.scores,

    companyOverview: state.companyOverview,

    strengths: state.strengths || [],

    risks: state.riskFactors || [],

    recentDevelopments:
      state.recentDevelopments || [],

    investmentThesis:
      state.investmentThesis,

    sources: state.sources || [],

    warnings
  };
}