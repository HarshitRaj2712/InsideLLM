import { env } from '../config/env.js';

const DEFAULT_TAVILY_SEARCH_DEPTH = 'advanced';

function normalizeTavilyResults(results = []) {
  return results
    .filter((result) => result?.title && result?.url)
    .map((result) => ({
      title: result.title,
      url: result.url,
      sourceType: 'tavily'
    }));
}

export async function searchCompanyWebContext(companyName) {
  if (!env.TAVILY_API_KEY) {
    return {
      summary: null,
      researchItems: [],
      sources: [],
      error: 'TAVILY_API_KEY is not configured'
    };
  }

  try {
    const url = `${env.TAVILY_BASE_URL}/search`;

    console.log('Calling Tavily...');
    console.log('Tavily URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query: `${companyName} company overview recent developments`,
        search_depth: DEFAULT_TAVILY_SEARCH_DEPTH,
        include_answer: true,
        include_raw_content: false,
        max_results: 5
      })
    });

    console.log('Tavily response status:', response.status);

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        payload?.message ||
        payload?.error ||
        'Tavily search request failed';

      console.error('Tavily API Error:', errorMessage);

      return {
        summary: null,
        researchItems: [],
        sources: [],
        error: errorMessage
      };
    }

    const normalizedSources = normalizeTavilyResults(payload?.results);

    const researchItems = normalizedSources.map(
      (source) => source.title
    );

    console.log('Tavily search successful');

    return {
      summary:
        typeof payload?.answer === 'string'
          ? payload.answer
          : null,
      researchItems,
      sources: normalizedSources,
      error: null
    };

  } catch (error) {
    console.error('TAVILY FETCH FAILED');
    console.error('Message:', error.message);
    console.error('Cause:', error.cause);
    console.error('Full Error:', error);

    return {
      summary: null,
      researchItems: [],
      sources: [],
      error: error.message
    };
  }
}

export async function searchRecentCompanyNews(companyName) {
  if (!env.TAVILY_API_KEY) {
    return {
      headlines: [],
      sources: [],
      error: 'TAVILY_API_KEY is not configured'
    };
  }

  const response = await fetch(`${env.TAVILY_BASE_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.TAVILY_API_KEY}`
    },
    body: JSON.stringify({
      query: `${companyName} recent news earnings results acquisitions layoffs guidance`,
      search_depth: DEFAULT_TAVILY_SEARCH_DEPTH,
      include_answer: false,
      include_raw_content: false,
      max_results: 5
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = payload?.message || payload?.error || 'Tavily news request failed';

    return {
      headlines: [],
      sources: [],
      error: errorMessage
    };
  }

  const normalizedSources = normalizeTavilyResults(payload?.results);
  const headlines = normalizedSources.map((source) => source.title);

  return {
    headlines,
    sources: normalizedSources,
    error: null
  };
}