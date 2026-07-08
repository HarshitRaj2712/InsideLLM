import { createStageUpdate } from '../nodeHelpers.js';
import { analyzeRiskSignals } from '../../riskAnalysis.service.js';

export async function riskAnalysisNode(state) {
  const riskResult = analyzeRiskSignals(state);

  return createStageUpdate(state, 'riskAnalysis', {
    riskFactors: riskResult.riskFactors,
    scores: {
      ...state.scores,
      ...riskResult.scores
    }
  });
}
