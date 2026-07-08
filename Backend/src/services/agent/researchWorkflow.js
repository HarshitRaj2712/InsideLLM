import { researchGraph } from './researchGraph.js';

export async function runResearchWorkflow(companyName) {
  return researchGraph.invoke({ companyName });
}
