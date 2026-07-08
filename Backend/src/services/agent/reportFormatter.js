export function formatResearchReport(state) {
  const company = state.normalizedCompanyName || state.companyName;

  return {
    company,
    companyName: state.companyName,
    decision: state.decision,
    finalDecision: state.finalDecision,
    confidence: state.confidenceScore,
    overallScore: state.overallScore,
    scores: state.scores,
    companyOverview: state.companyOverview,
    strengths: state.strengths,
    risks: state.riskFactors,
    recentDevelopments: state.recentDevelopments,
    investmentThesis: state.investmentThesis,
    sources: state.sources,
    errors: state.errors
  };
}
