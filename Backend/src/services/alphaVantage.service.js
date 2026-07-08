import { env } from '../config/env.js';

const FALLBACK_FINANCIAL_ERROR = 'ALPHAVANTAGE_API_KEY is not configured';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pickMetrics(overview = {}) {
  return {
    symbol: overview.Symbol ?? null,
    assetType: overview.AssetType ?? null,
    name: overview.Name ?? null,
    description: overview.Description ?? null,
    exchange: overview.Exchange ?? null,
    currency: overview.Currency ?? null,
    country: overview.Country ?? null,
    sector: overview.Sector ?? null,
    industry: overview.Industry ?? null,
    marketCapitalization: toNumber(overview.MarketCapitalization),
    peRatio: toNumber(overview.PERatio),
    priceToBookRatio: toNumber(overview.PriceToBookRatio),
    profitMargin: toNumber(overview.ProfitMargin),
    operatingMarginTTM: toNumber(overview.OperatingMarginTTM),
    returnOnEquityTTM: toNumber(overview.ReturnOnEquityTTM),
    revenueTTM: toNumber(overview.RevenueTTM),
    netIncomeTTM: toNumber(overview.NetIncomeTTM),
    beta: toNumber(overview.Beta),
    weekHigh52: toNumber(overview['52WeekHigh']),
    weekLow52: toNumber(overview['52WeekLow']),
    epsTTM: toNumber(overview.EPS),
    dividendPerShare: toNumber(overview.DividendPerShare),
    dividendYield: toNumber(overview.DividendYield),
    analystTargetPrice: toNumber(overview.AnalystTargetPrice),
    latestQuarter: overview.LatestQuarter ?? null,
    fiscalYearEnd: overview.FiscalYearEnd ?? null
  };
}

async function fetchJson(url) {
  const response = await fetch(url);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.Note || payload?.Information || payload?.ErrorMessage || 'Alpha Vantage request failed';
    throw new Error(message);
  }

  return payload;
}

export async function fetchCompanyFinancialData(companyName) {
  if (!env.ALPHAVANTAGE_API_KEY) {
    return {
      symbol: null,
      companyName,
      metrics: null,
      companyMatches: [],
      sources: [],
      error: FALLBACK_FINANCIAL_ERROR
    };
  }

  const searchUrl = new URL(env.ALPHAVANTAGE_BASE_URL);
  searchUrl.searchParams.set('function', 'SYMBOL_SEARCH');
  searchUrl.searchParams.set('keywords', companyName);
  searchUrl.searchParams.set('apikey', env.ALPHAVANTAGE_API_KEY);

  const searchPayload = await fetchJson(searchUrl);
  const bestMatch = searchPayload?.bestMatches?.[0] ?? null;
  const symbol = bestMatch?.['1. symbol'] ?? null;

  if (!symbol) {
    return {
      symbol: null,
      companyName,
      metrics: null,
      companyMatches: Array.isArray(searchPayload?.bestMatches) ? searchPayload.bestMatches.slice(0, 5) : [],
      sources: [],
      error: `No symbol match found for ${companyName}`
    };
  }

  const overviewUrl = new URL(env.ALPHAVANTAGE_BASE_URL);
  overviewUrl.searchParams.set('function', 'OVERVIEW');
  overviewUrl.searchParams.set('symbol', symbol);
  overviewUrl.searchParams.set('apikey', env.ALPHAVANTAGE_API_KEY);

  const overviewPayload = await fetchJson(overviewUrl);

  if (!overviewPayload || Object.keys(overviewPayload).length === 0) {
    return {
      symbol,
      companyName,
      metrics: null,
      companyMatches: Array.isArray(searchPayload?.bestMatches) ? searchPayload.bestMatches.slice(0, 5) : [],
      sources: [{ title: `Alpha Vantage overview for ${symbol}`, url: env.ALPHAVANTAGE_BASE_URL, sourceType: 'alphavantage' }],
      error: `No overview data returned for ${symbol}`
    };
  }

  return {
    symbol,
    companyName,
    metrics: pickMetrics(overviewPayload),
    companyMatches: Array.isArray(searchPayload?.bestMatches) ? searchPayload.bestMatches.slice(0, 5) : [],
    sources: [
      { title: `Alpha Vantage symbol search for ${companyName}`, url: env.ALPHAVANTAGE_BASE_URL, sourceType: 'alphavantage' },
      { title: `Alpha Vantage overview for ${symbol}`, url: env.ALPHAVANTAGE_BASE_URL, sourceType: 'alphavantage' }
    ],
    error: null
  };
}