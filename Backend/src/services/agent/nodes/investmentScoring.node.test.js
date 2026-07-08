import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDeterministicScores } from './investmentScoring.node.js';

function buildState(overrides = {}) {
  return {
    financialData: null,
    webResearch: [],
    recentNews: [],
    scores: { riskLevel: 5 },
    ...overrides
  };
}

test('deterministic scoring differentiates strong and weak financial profiles', () => {
  const strongState = buildState({
    financialData: {
      sector: 'Technology',
      returnOnEquityTTM: 0.26,
      profitMargin: 0.23,
      operatingMarginTTM: 0.28,
      peRatio: 24,
      debtToEquity: 0.4,
      quarterlyRevenueGrowthYOY: 0.16,
      quarterlyEarningsGrowthYOY: 0.18,
      marketCapitalization: 320000000000,
      beta: 0.9
    },
    webResearch: ['The company reported strong growth and record demand in cloud products.'],
    recentNews: ['Analysts upgrade outlook after earnings beat.']
  });

  const weakState = buildState({
    financialData: {
      sector: 'Technology',
      returnOnEquityTTM: 0.05,
      profitMargin: 0.04,
      operatingMarginTTM: 0.06,
      peRatio: 61,
      debtToEquity: 3.4,
      quarterlyRevenueGrowthYOY: -0.08,
      quarterlyEarningsGrowthYOY: -0.15,
      marketCapitalization: 1900000000,
      beta: 2.5
    },
    webResearch: ['The firm is facing decline in demand and weak execution concerns.'],
    recentNews: ['The company announced layoffs after a large quarterly loss.']
  });

  const strongScores = calculateDeterministicScores(strongState);
  const weakScores = calculateDeterministicScores(weakState);

  assert.ok(strongScores.financialHealth > weakScores.financialHealth);
  assert.ok(strongScores.growthPotential > weakScores.growthPotential);
  assert.ok(strongScores.marketPosition > weakScores.marketPosition);
});

test('deterministic scoring remains bounded from 1 to 10', () => {
  const scores = calculateDeterministicScores(
    buildState({
      financialData: {
        sector: 'Finance',
        returnOnEquityTTM: 2,
        profitMargin: 1.2,
        operatingMarginTTM: 1.4,
        peRatio: 0.5,
        debtToEquity: 0.01,
        quarterlyRevenueGrowthYOY: 1.8,
        quarterlyEarningsGrowthYOY: 2.1,
        marketCapitalization: 5000000000000,
        beta: 0.2
      },
      webResearch: ['Strong growth outlook and profit expansion continue.'],
      recentNews: ['Record quarter and analyst upgrade expected.'],
      scores: { riskLevel: 0 }
    })
  );

  assert.ok(scores.financialHealth >= 1 && scores.financialHealth <= 10);
  assert.ok(scores.growthPotential >= 1 && scores.growthPotential <= 10);
  assert.ok(scores.marketPosition >= 1 && scores.marketPosition <= 10);
  assert.ok(scores.riskLevel >= 1 && scores.riskLevel <= 10);
});

test('missing financial data reduces financialHealth while still using available research signals', () => {
  const scores = calculateDeterministicScores(
    buildState({
      webResearch: ['Strong product momentum and expansion into new markets.'],
      recentNews: ['Recent upgrade reflects better growth expectations.']
    })
  );

  assert.equal(scores.financialHealth, 2);
  assert.ok(scores.growthPotential > 4);
});
