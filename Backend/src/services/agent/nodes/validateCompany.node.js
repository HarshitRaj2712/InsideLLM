import { createStageUpdate } from '../nodeHelpers.js';

export async function validateCompanyNode(state) {
  const normalizedCompanyName = state.companyName.replace(/\s+/g, ' ').trim();

  return createStageUpdate(state, 'validateCompany', {
    normalizedCompanyName
  });
}
