import { createStageUpdate } from '../nodeHelpers.js';

const POSITIVE_TERMS = ['growth', 'beat', 'upgrade', 'expansion', 'record', 'strong', 'profit', 'outperform', 'innovation'];
const NEGATIVE_TERMS = ['lawsuit', 'decline', 'drop', 'layoff', 'fraud', 'probe', 'risk', 'loss', 'weak', 'downgrade'];

const SECTOR_PE_BANDS = {
  technology: { attractive: 20, expensive: 42 },
  healthcare: { attractive: 22, expensive: 38 },
  finance: { attractive: 14, expensive: 25 },
  energy: { attractive: 11, expensive: 22 },
  industrials: { attractive: 18, expensive: 30 },
  consumer: { attractive: 19, expensive: 32 },
  default: { attractive: 18, expensive: 34 }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundToOneDecimal(value) {
  return Number(value.toFixed(1));
}

function normalizePercent(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  if (Math.abs(value) <= 1) {
    return value * 100;
  }

  return value;
}

function scoreHigherIsBetter(value, lowAnchor, highAnchor) {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized = (value - lowAnchor) / (highAnchor - lowAnchor);
  return clamp(1 + (normalized * 9), 1, 10);
}

function scoreLowerIsBetter(value, goodThreshold, expensiveThreshold) {
  if (!Number.isFinite(value)) {
    return null;
  }

  if (value <= goodThreshold) {
    return 10;
  }

  const normalized = (value - goodThreshold) / (expensiveThreshold - goodThreshold);
  return clamp(10 - (normalized * 9), 1, 10);
}

function weightedAverage(entries, fallbackScore) {
  const validEntries = entries.filter((entry) => Number.isFinite(entry.score) && Number.isFinite(entry.weight));

  if (!validEntries.length) {
    return fallbackScore;
  }

  const weightedTotal = validEntries.reduce((sum, entry) => sum + (entry.score * entry.weight), 0);
  const totalWeight = validEntries.reduce((sum, entry) => sum + entry.weight, 0);

  return totalWeight > 0 ? weightedTotal / totalWeight : fallbackScore;
}

function identifySectorBand(sector) {
  const normalizedSector = String(sector || '').toLowerCase();

  if (normalizedSector.includes('tech') || normalizedSector.includes('software')) {
    return SECTOR_PE_BANDS.technology;
  }

  if (normalizedSector.includes('health')) {
    return SECTOR_PE_BANDS.healthcare;
  }

  if (normalizedSector.includes('financ') || normalizedSector.includes('bank')) {
    return SECTOR_PE_BANDS.finance;
  }

  if (normalizedSector.includes('energy') || normalizedSector.includes('oil') || normalizedSector.includes('gas')) {
    return SECTOR_PE_BANDS.energy;
  }

  if (normalizedSector.includes('industr')) {
    return SECTOR_PE_BANDS.industrials;
  }

  if (normalizedSector.includes('consumer') || normalizedSector.includes('retail')) {
    return SECTOR_PE_BANDS.consumer;
  }

  return SECTOR_PE_BANDS.default;
}

function countTermHits(textItems, terms) {
  return (textItems || []).reduce((count, item) => {
    const normalizedText = String(item || '').toLowerCase();
    const hasTerm = terms.some((term) => normalizedText.includes(term));
    return hasTerm ? count + 1 : count;
  }, 0);
}

function scoreFromSignalBalance(positiveHits, negativeHits) {
  const signalBalance = positiveHits - negativeHits;
  return clamp(5 + signalBalance, 1, 10);
}

export function calculateDeterministicScores(state) {
  const financialData = state.financialData || {};
  const hasFinancialData = Boolean(state.financialData);
  const combinedResearchText = [...(state.webResearch || []), ...(state.recentNews || [])];

  const roeScore = scoreHigherIsBetter(normalizePercent(financialData.returnOnEquityTTM), 5, 22);
  const profitMarginScore = scoreHigherIsBetter(normalizePercent(financialData.profitMargin), 4, 20);
  const operatingMarginScore = scoreHigherIsBetter(normalizePercent(financialData.operatingMarginTTM), 6, 24);

  const sectorBand = identifySectorBand(financialData.sector);
  const peScore = scoreLowerIsBetter(financialData.peRatio, sectorBand.attractive, sectorBand.expensive);
  const debtScore = scoreLowerIsBetter(financialData.debtToEquity, 0.6, 2.5);
  const revenueGrowthScore = scoreHigherIsBetter(normalizePercent(financialData.quarterlyRevenueGrowthYOY), -5, 18);
  const earningsGrowthScore = scoreHigherIsBetter(normalizePercent(financialData.quarterlyEarningsGrowthYOY), -5, 20);

  const financialHealth = weightedAverage([
    { score: roeScore, weight: 0.23 },
    { score: profitMarginScore, weight: 0.22 },
    { score: operatingMarginScore, weight: 0.14 },
    { score: peScore, weight: 0.16 },
    { score: debtScore, weight: 0.15 },
    { score: revenueGrowthScore, weight: 0.1 }
  ], hasFinancialData ? 5 : 2);

  const positiveHits = countTermHits(combinedResearchText, POSITIVE_TERMS);
  const negativeHits = countTermHits(combinedResearchText, NEGATIVE_TERMS);
  const sentimentScore = scoreFromSignalBalance(positiveHits, negativeHits);
  const coverageScore = clamp(3 + ((state.webResearch?.length || 0) * 0.8) + ((state.recentNews?.length || 0) * 0.6), 1, 10);

  const growthPotential = weightedAverage([
    { score: revenueGrowthScore, weight: 0.4 },
    { score: earningsGrowthScore, weight: 0.25 },
    { score: sentimentScore, weight: 0.2 },
    { score: coverageScore, weight: 0.15 }
  ], clamp((sentimentScore * 0.65) + (coverageScore * 0.35), 1, 10));

  const marketCapScore = scoreHigherIsBetter(Math.log10(Math.max(1, financialData.marketCapitalization || 0)), 8.5, 12.3);
  const betaScore = scoreLowerIsBetter(Math.abs(financialData.beta || Number.NaN), 0.9, 2.2);

  const marketPosition = weightedAverage([
    { score: marketCapScore, weight: 0.45 },
    { score: sentimentScore, weight: 0.3 },
    { score: betaScore, weight: 0.1 },
    { score: coverageScore, weight: 0.15 }
  ], clamp((sentimentScore * 0.6) + (coverageScore * 0.4), 1, 10));

  const existingRiskLevel = typeof state.scores?.riskLevel === 'number' ? state.scores.riskLevel : 5;

  return {
    financialHealth: roundToOneDecimal(financialHealth),
    growthPotential: roundToOneDecimal(growthPotential),
    marketPosition: roundToOneDecimal(marketPosition),
    riskLevel: clamp(roundToOneDecimal(existingRiskLevel), 1, 10)
  };
}

export async function investmentScoringNode(state) {
  const computedScores = calculateDeterministicScores(state);

  return createStageUpdate(state, 'investmentScoring', {
    scores: {
      ...state.scores,
      ...computedScores
    }
  });
}
