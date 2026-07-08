export function createStageUpdate(state, stageName, update = {}) {
  return {
    ...update,
    currentStage: stageName,
    progress: [...state.progress, stageName]
  };
}
