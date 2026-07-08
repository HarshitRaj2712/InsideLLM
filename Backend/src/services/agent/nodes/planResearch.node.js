import { createStageUpdate } from '../nodeHelpers.js';

export async function planResearchNode(state) {
  return createStageUpdate(state, 'planResearch', {
    researchPlan: [
      'Collect current company background from the web',
      'Fetch structured financial metrics',
      'Review recent news and developments',
      'Identify key risks and strengths',
      'Score the company and produce a final decision'
    ]
  });
}
