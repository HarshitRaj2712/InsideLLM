import { researchRequestSchema } from '../schemas/research.schema.js';
import { formatResearchReport } from '../services/agent/reportFormatter.js';
import { runResearchWorkflow } from '../services/agent/researchWorkflow.js';

export const createResearchRequest = async (req, res, next) => {
  const parsedBody = researchRequestSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body',
      errors: parsedBody.error.flatten().fieldErrors
    });
  }

  const companyName = parsedBody.data.companyName.replace(/\s+/g, ' ').trim();

  try {
    const workflowState = await runResearchWorkflow(companyName);

    return res.status(200).json({
      success: true,
      message: 'Research workflow executed',
      data: formatResearchReport(workflowState)
    });
  } catch (error) {
    return next(error);
  }
};
