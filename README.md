# InsideIIM AI Investment Research Agent

## Overview
InsideIIM is a full-stack AI investment research app where a user enters a company name and gets a structured report with:
- decision: INVEST or PASS
- confidence and overall score
- score breakdown (financial health, growth potential, market position, risk level)
- concise thesis, strengths, risks, developments, and sources

The backend uses an agentic workflow (LangGraph) to orchestrate multi-step research. It combines deterministic scoring from real financial metrics and research signals with Gemini-based narrative reasoning.

## How to run it
### 1. Backend setup
```bash
cd Backend
npm install
```

Create `Backend/.env`:
```bash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
TAVILY_API_KEY=
TAVILY_BASE_URL=https://api.tavily.com
ALPHAVANTAGE_API_KEY=
ALPHAVANTAGE_BASE_URL=https://www.alphavantage.co/query
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

Run backend:
```bash
npm run dev
```

### 2. Frontend setup
```bash
cd Frontend
npm install
```

Create `Frontend/.env`:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

Run frontend:
```bash
npm run dev
```

### 3. Run tests
Backend tests:
```bash
cd Backend
npm test
```

Frontend tests:
```bash
cd Frontend
npm test
```

## How it works
### Workflow (LangGraph)
1. Validate company
2. Plan research
3. Web research (Tavily)
4. Financial research (Alpha Vantage)
5. Recent news research (Tavily)
6. Risk analysis
7. Company analysis (Gemini via LangChain)
8. Investment scoring (deterministic)
9. Final decision

### LangChain usage
Gemini integration uses `ChatGoogleGenerativeAI` from `@langchain/google-genai` with structured output parsing, instead of raw fetch + manual JSON extraction.

### Deterministic scoring details
The scoring node uses actual fetched metrics, not presence/absence flags. Examples:
- financial health: ROE, profit margin, operating margin, PE relative to sector bands, debt-to-equity, revenue growth
- growth potential: revenue/earnings growth + signal balance from research/news text
- market position: market cap scale + sentiment + stability cues
- risk level: carried from risk analysis node

Each score is clamped to a 1-10 range and computed with explicit weighted formulas.

## Key decisions & trade-offs
- Hybrid approach: deterministic arithmetic for scoring, LLM for synthesis and narrative.
- Graceful degradation: if one provider fails, workflow still returns a best-effort report and records issues in `errors`.
- Structured output: backend response is JSON-first, making frontend rendering predictable.
- Trade-off: Alpha Vantage free-tier data can be sparse (for some symbols), so scoring falls back to evidence-weighted defaults when specific metrics are missing.

## Example runs
### Example 1: Strong profile
Request:
```json
{
  "companyName": "Infosys"
}
```

Representative output (shape):
```json
{
  "company": "Infosys",
  "decision": "INVEST",
  "confidence": 81,
  "overallScore": 7.4,
  "scores": {
    "financialHealth": 7.9,
    "growthPotential": 7.1,
    "marketPosition": 7.3,
    "riskLevel": 5
  },
  "errors": []
}
```

### Example 2: Partial failure but successful workflow
Request:
```json
{
  "companyName": "Reliance Industries"
}
```

Representative output (shape):
```json
{
  "company": "Reliance Industries",
  "decision": "PASS",
  "confidence": 64,
  "overallScore": 5.9,
  "scores": {
    "financialHealth": 6.2,
    "growthPotential": 5.4,
    "marketPosition": 6.0,
    "riskLevel": 7
  },
  "errors": [
    "Tavily request failed: timeout"
  ]
}
```

Frontend behavior for partial failure:
- shows success response and report
- shows a warning banner listing partial data issues

## What you would improve
1. Add retries/circuit-breakers and per-provider timeouts with jitter.
2. Add streaming stage progress to frontend (SSE/WebSocket) instead of request-level loading.
3. Expand deterministic model with sector-normalized benchmarks from richer financial datasets.
4. Add integration tests with provider mocks and golden report snapshots.
5. Add persistent research history and report comparison across runs.
