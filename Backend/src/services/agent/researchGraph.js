import { END, START, StateGraph } from '@langchain/langgraph';
import { researchStateSchema } from './researchState.js';
import { validateCompanyNode } from './nodes/validateCompany.node.js';
import { planResearchNode } from './nodes/planResearch.node.js';
import { webResearchNode } from './nodes/webResearch.node.js';
import { financialResearchNode } from './nodes/financialResearch.node.js';
import { recentNewsResearchNode } from './nodes/recentNewsResearch.node.js';
import { riskAnalysisNode } from './nodes/riskAnalysis.node.js';
import { companyAnalysisNode } from './nodes/companyAnalysis.node.js';
import { investmentScoringNode } from './nodes/investmentScoring.node.js';
import { finalDecisionNode } from './nodes/finalDecision.node.js';

const graphBuilder = new StateGraph(researchStateSchema)
  .addNode('validateCompanyNode', validateCompanyNode)
  .addNode('planResearchNode', planResearchNode)
  .addNode('webResearchNode', webResearchNode)
  .addNode('financialResearchNode', financialResearchNode)
  .addNode('recentNewsResearchNode', recentNewsResearchNode)
  .addNode('riskAnalysisNode', riskAnalysisNode)
  .addNode('companyAnalysisNode', companyAnalysisNode)
  .addNode('investmentScoringNode', investmentScoringNode)
  .addNode('finalDecisionNode', finalDecisionNode)
  .addEdge(START, 'validateCompanyNode')
  .addEdge('validateCompanyNode', 'planResearchNode')
  .addEdge('planResearchNode', 'webResearchNode')
  .addEdge('webResearchNode', 'financialResearchNode')
  .addEdge('financialResearchNode', 'recentNewsResearchNode')
  .addEdge('recentNewsResearchNode', 'riskAnalysisNode')
  .addEdge('riskAnalysisNode', 'companyAnalysisNode')
  .addEdge('companyAnalysisNode', 'investmentScoringNode')
  .addEdge('investmentScoringNode', 'finalDecisionNode')
  .addEdge('finalDecisionNode', END);

export const researchGraph = graphBuilder.compile();
