# 🚀 InsideIIM AI Investment Research Agent

> An agentic AI-powered investment research platform that researches companies, analyzes financial and market evidence, evaluates risks and growth potential, and generates an explainable **INVEST or PASS** recommendation.

---

## 🌐 Live Demo

### 🎨 Frontend

https://aiinvester.vercel.app

### ⚙️ Backend API

https://insidellm.onrender.com

### 🔗 API Health Check

https://insidellm.onrender.com/api

---

## 📌 Overview

The **InsideIIM AI Investment Research Agent** is a full-stack AI application designed to simulate the workflow of an investment research analyst.

A user enters the name of a company, and the application automatically performs a multi-stage research workflow to collect company information, financial data, recent developments, and investment risk signals.

The collected evidence is processed through a **LangGraph-powered agentic workflow** that combines:

* 🌐 Real-time web research
* 📊 Structured financial data
* 📰 Recent company developments
* ⚠️ Investment risk analysis
* 🧮 Deterministic investment scoring
* 🤖 Gemini-powered company analysis
* 📈 Explainable INVEST or PASS recommendations

Instead of directly asking an LLM whether a company is worth investing in, the application follows a structured research pipeline and provides the AI model with collected evidence.

The final output contains:

* INVEST or PASS decision
* Decision confidence
* Overall investment score
* Financial health score
* Growth potential score
* Market position score
* Risk level
* Company overview
* Key strengths
* Investment risks
* Recent developments
* Investment thesis
* Research sources
* Partial-data warnings when external services fail

---

# ✨ Key Features

## 🤖 Agentic AI Research Workflow

The backend uses **LangGraph.js** to orchestrate the complete investment research workflow.

Each research responsibility is implemented as an independent node in the graph.

```text
START
   │
   ▼
Validate Company
   │
   ▼
Plan Research
   │
   ▼
Web Research
   │
   ▼
Financial Research
   │
   ▼
Recent News Research
   │
   ▼
Risk Analysis
   │
   ▼
Company Analysis
   │
   ▼
Investment Scoring
   │
   ▼
Final Decision
   │
   ▼
END
```

This architecture makes the research process modular, explainable, and easier to extend.

---

## 🔍 Real-Time Company Research

The application uses the **Tavily Search API** to collect current information about a company.

The research process gathers information such as:

* Company overview
* Business activities
* Recent developments
* Market signals
* Growth-related information
* Potential negative developments
* Relevant research sources

---

## 💰 Structured Financial Research

The backend uses the **Alpha Vantage API** to retrieve structured financial information where available.

Financial metrics used by the scoring system can include:

* Return on Equity (ROE)
* Profit Margin
* Operating Margin
* P/E Ratio
* Debt-to-Equity Ratio
* Revenue Growth
* Earnings Growth
* Market Capitalization
* Beta

These metrics are processed by the deterministic scoring engine instead of relying entirely on LLM-generated financial judgments.

---

## 🧠 Gemini-Powered Analysis

The application uses **Google Gemini through LangChain.js** for evidence-based company analysis.

The Gemini integration uses:

```text
ChatGoogleGenerativeAI
```

from:

```text
@langchain/google-genai
```

The AI model receives the evidence collected during previous research stages, including:

* Company overview
* Web research
* Financial data
* Recent news
* Risk factors
* Deterministic scores
* Research sources

Gemini then generates a structured analysis containing:

* Company overview
* Strengths
* Recent developments
* Investment thesis

Structured output validation is used to keep AI responses predictable and safe for frontend rendering.

---

## 🧮 Hybrid Investment Decision System

One of the main engineering decisions in this project was to avoid relying completely on an LLM for investment decisions.

The application uses a **hybrid architecture**:

```text
Real Research Data
        +
Structured Financial Metrics
        +
Deterministic Scoring
        +
Gemini Reasoning
        =
Explainable Investment Report
```

Deterministic logic is used for numerical scoring, while Gemini is used for evidence synthesis and investor-focused reasoning.

This approach provides greater consistency and explainability than simply asking an LLM:

> "Should I invest in this company?"

---

# 🏗️ System Architecture

```text
┌───────────────────────────┐
│      React Frontend       │
│                           │
│   Company Research Form   │
│   Investment Dashboard    │
└─────────────┬─────────────┘
              │
              │ POST /api/research
              ▼
┌───────────────────────────┐
│      Express Backend      │
│                           │
│   Validation              │
│   Controllers             │
│   Error Handling          │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        LangGraph          │
│                           │
│   Agent Orchestration     │
│   Shared Research State   │
└─────────────┬─────────────┘
              │
       ┌──────┼──────┐
       │      │      │
       ▼      ▼      ▼
   Tavily   Alpha   Gemini
   Search   Vantage   AI
       │      │      │
       └──────┼──────┘
              │
              ▼
┌───────────────────────────┐
│ Deterministic Scoring     │
│                           │
│ Financial Health          │
│ Growth Potential          │
│ Market Position           │
│ Risk Level                │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│    Final Research Report  │
│                           │
│       INVEST / PASS       │
└───────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* JavaScript

## Backend

* Node.js
* Express.js
* Zod
* CORS

## AI & Agent Framework

* LangChain.js
* LangGraph.js
* Google Gemini
* `@langchain/google-genai`

## Research & Financial Data

* Tavily Search API
* Alpha Vantage API

## Deployment

* Vercel — Frontend
* Render — Backend

---

# 📂 Project Structure

```text
InsideLLM/
│
├── Backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── cors.js
│   │   │
│   │   ├── controllers/
│   │   │   └── research.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── services/
│   │   │   │
│   │   │   ├── agent/
│   │   │   │   ├── nodes/
│   │   │   │   ├── researchGraph.js
│   │   │   │   ├── researchState.js
│   │   │   │   ├── researchWorkflow.js
│   │   │   │   └── reportFormatter.js
│   │   │   │
│   │   │   ├── tavily.service.js
│   │   │   ├── alphavantage.service.js
│   │   │   └── gemini.service.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── Frontend/
│   │
│   ├── src/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

# ⚙️ How to Run the Project Locally

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

You will also need API keys for:

* Tavily
* Alpha Vantage
* Google Gemini

---

# 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>

cd InsideLLM
```

---

# 2️⃣ Backend Setup

Navigate to the backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `Backend` directory.

```env
PORT=5000

CLIENT_ORIGIN=http://localhost:5173

NODE_ENV=development

TAVILY_API_KEY=your_tavily_api_key

TAVILY_BASE_URL=https://api.tavily.com

ALPHAVANTAGE_API_KEY=your_alphavantage_api_key

ALPHAVANTAGE_BASE_URL=https://www.alphavantage.co/query

GEMINI_API_KEY=your_gemini_api_key

GEMINI_MODEL=gemini-2.5-flash

GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

Start the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

API health check:

```text
http://localhost:5000/api
```

---

# 3️⃣ Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `Frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

# 4️⃣ Run Tests

## Backend Tests

```bash
cd Backend
npm test
```

## Frontend Tests

```bash
cd Frontend
npm test
```

---

# 🔄 How It Works

When a user submits a company name, the following workflow is executed.

## 1. Validate Company

The company input is validated and normalized before entering the research workflow.

---

## 2. Plan Research

The workflow initializes the research strategy and prepares the shared LangGraph state.

---

## 3. Web Research

Tavily searches for company information and relevant business developments.

---

## 4. Financial Research

Alpha Vantage attempts to resolve the company symbol and retrieve structured financial information.

---

## 5. Recent News Research

Tavily searches for recent developments such as:

* Earnings announcements
* Acquisitions
* Workforce changes
* Business expansion
* Management developments
* Potential risk signals

---

## 6. Risk Analysis

The collected research and news are analyzed for potential negative signals and investment risks.

---

## 7. Company Analysis

Gemini receives the collected evidence and generates a structured company analysis.

The model is instructed to:

* Use only provided evidence
* Avoid inventing financial information
* Generate concise investor-focused analysis
* Return structured output

---

## 8. Investment Scoring

The deterministic scoring engine calculates four core investment scores.

### Financial Health

Uses metrics including:

* ROE
* Profit Margin
* Operating Margin
* Sector-relative P/E
* Debt-to-Equity
* Revenue Growth

### Growth Potential

Uses:

* Revenue Growth
* Earnings Growth
* Positive and negative research signals
* Research coverage

### Market Position

Uses:

* Market Capitalization
* Research signals
* Beta
* Research coverage

### Risk Level

Uses signals identified during the risk-analysis stage.

All scores are normalized to a range of:

```text
1 → 10
```

---

## 9. Final Decision

The final node combines the available research and calculated scores to produce:

```text
INVEST
```

or:

```text
PASS
```

along with:

* Confidence score
* Overall investment score
* Investment thesis

---

# 📡 API Reference

## Research a Company

### Endpoint

```http
POST /api/research
```

### Request Body

```json
{
  "companyName": "Tata Consultancy Services"
}
```

### Example Response

```json
{
  "success": true,
  "message": "Research workflow executed",
  "data": {
    "company": "Tata Consultancy Services",
    "decision": "PASS",
    "confidence": 87,
    "overallScore": 5.4,
    "scores": {
      "riskLevel": 5,
      "financialHealth": 5,
      "growthPotential": 7.1,
      "marketPosition": 3.8
    },
    "companyOverview": "Tata Consultancy Services is a leading global IT services company.",
    "strengths": [
      "Strong global presence",
      "Diversified technology services portfolio"
    ],
    "risks": [
      "Potential negative industry signals"
    ],
    "recentDevelopments": [
      "Recent company and financial developments"
    ],
    "investmentThesis": "The available evidence currently supports a PASS decision.",
    "sources": [],
    "warnings": []
  }
}
```

---

# 🧮 Deterministic Scoring Model

The project intentionally avoids asking Gemini to generate arbitrary numerical investment scores.

Instead, the application uses explicit scoring functions.

Examples include:

```text
Higher ROE
      ↓
Higher Financial Health Score
```

```text
High Debt-to-Equity
      ↓
Lower Financial Health Score
```

```text
Positive Research Signals
      ↓
Higher Growth Potential
```

```text
Negative News Signals
      ↓
Higher Risk Level
```

Weighted averages are then used to calculate the final component scores.

This makes the decision process more consistent, explainable, and testable.

---

# 🛡️ Graceful Degradation

External APIs can fail because of:

* Rate limits
* Network errors
* Missing financial data
* Unsupported company symbols
* Temporary provider outages

The application is designed to continue the workflow when possible.

For example:

```text
Tavily        ✅

Alpha Vantage ⚠️ Partial Data

Gemini         ✅

        ↓

Research Workflow Continues

        ↓

Best-Effort Report + Warning
```

Instead of exposing large internal API errors to the frontend, the backend converts them into concise warnings such as:

```text
AI analysis is temporarily unavailable due to API rate limits.
```

or:

```text
Structured financial data could not be retrieved.
```

---

# 💡 Key Engineering Decisions & Trade-offs

## 1. Hybrid AI Architecture

### Decision

Use deterministic scoring for numerical analysis and Gemini for evidence synthesis.

### Why?

LLMs are useful for understanding and summarizing complex information but should not be blindly trusted to perform consistent financial calculations.

### Trade-off

The deterministic scoring model requires manually designed thresholds and weights.

---

## 2. LangGraph Instead of a Single LLM Call

### Decision

Use a multi-stage LangGraph workflow.

### Why?

A single prompt such as:

```text
Should I invest in TCS?
```

would produce a simple AI wrapper.

LangGraph allows the project to model an actual research pipeline with independent stages and shared state.

### Trade-off

The architecture introduces additional complexity compared to a single API call.

---

## 3. Structured LLM Output

### Decision

Use Zod schemas with LangChain structured output.

### Why?

Unstructured AI responses are difficult and unreliable to render directly on the frontend.

Structured output provides predictable response fields.

### Trade-off

Strict schemas can occasionally reject malformed model responses.

---

## 4. Graceful Degradation

### Decision

Allow the workflow to continue when one external provider fails.

### Why?

AI and research APIs can fail because of quotas, unsupported symbols, or network problems.

Returning a partial report with warnings provides a better user experience than completely failing the request.

### Trade-off

Reports generated from partial data have higher uncertainty.

---

## 5. Financial API Limitations

### Decision

Use Alpha Vantage for structured financial data.

### Why?

It provides accessible company and financial information suitable for the project scope.

### Trade-off

Free-tier data availability can be limited, especially for certain companies and international stock symbols.

The scoring system therefore uses evidence-weighted fallback values when individual metrics are unavailable.

---

# 🧪 Example Runs

## Example 1 — Tata Consultancy Services

### Request

```json
{
  "companyName": "Tata Consultancy Services"
}
```

### Research Process

```text
Company Validation
        ↓
Web Research
        ↓
Financial Research
        ↓
Recent News
        ↓
Risk Analysis
        ↓
Gemini Analysis
        ↓
Deterministic Scoring
        ↓
Final Recommendation
```

### Output

The agent returns:

* Investment decision
* Confidence level
* Overall score
* Core investment scores
* Company overview
* Strengths
* Risks
* Recent developments
* Investment thesis
* Research sources

---

## Example 2 — Reliance Industries

### Request

```json
{
  "companyName": "Reliance Industries"
}
```

The workflow researches Reliance Industries, retrieves available financial information, collects recent developments, generates AI-based analysis, calculates deterministic investment scores, and returns the final structured report.

---

# ⚠️ Current Limitations

The current version has several known limitations:

* Financial APIs may return incomplete data for some international companies.
* Company names with similar entities can occasionally create symbol-resolution ambiguity.
* Keyword-based sentiment analysis does not fully understand linguistic context.
* The current research workflow runs synchronously.
* External API latency affects total research time.
* Free-tier API rate limits may temporarily affect research quality.
* Investment scoring weights are manually designed rather than statistically trained.

---

# 🔮 What I Would Improve With More Time

## 1. Better Company Entity Resolution

Add a dedicated company-resolution stage that identifies:

* Exact company name
* Country
* Stock exchange
* Ticker symbol

before beginning research.

This would prevent companies with similar names from being mixed during research.

---

## 2. Higher-Quality Financial Data

Integrate richer financial datasets with:

* Historical revenue
* Historical earnings
* Free cash flow
* Balance sheet trends
* Sector benchmarks
* Valuation comparisons

---

## 3. Source Ranking & Deduplication

Add source-quality scoring to prioritize:

1. Official company filings
2. Investor relations pages
3. Regulatory filings
4. Reputable financial publications
5. General web sources

Duplicate sources would also be removed before generating the final report.

---

## 4. Real-Time Workflow Progress

Use Server-Sent Events or WebSockets to stream workflow progress.

For example:

```text
✓ Company validated

✓ Web research completed

✓ Financial data collected

✓ Recent news analyzed

✓ Risks identified

✓ Investment scores calculated

✓ Final recommendation generated
```

---

## 5. Research History

Add persistent storage using MongoDB or PostgreSQL.

Users could:

* View previous reports
* Compare companies
* Track changes in recommendations
* Re-run historical research

---

## 6. Company Comparison

Allow users to compare multiple companies based on:

* Financial Health
* Growth Potential
* Market Position
* Risk Level
* Overall Investment Score

---

## 7. Improved Reliability

Add:

* Request retries
* Exponential backoff
* Provider-specific timeouts
* Circuit breakers
* Better API rate-limit handling

---

## 8. Expanded Testing

Add:

* Provider mocks
* LangGraph node tests
* Integration tests
* API tests
* Golden report snapshots
* End-to-end frontend tests

---

# 🔐 Environment & Security

API keys are stored using environment variables and are never exposed to the frontend.

The project uses:

* Environment validation with Zod
* CORS origin validation
* Request body validation
* Centralized Express error handling
* Structured API responses

The `.env` files should never be committed to version control.

---

# 🚀 Deployment

## Frontend

The React frontend is deployed on Vercel.

```text
https://aiinvester.vercel.app
```

## Backend

The Node.js and Express backend is deployed on Render.

```text
https://insidellm.onrender.com
```

Production communication follows this architecture:

```text
Vercel Frontend
        │
        │ HTTPS API Request
        ▼
Render Backend
        │
        ▼
LangGraph Workflow
        │
        ├──── Tavily
        │
        ├──── Alpha Vantage
        │
        └──── Gemini
        │
        ▼
Structured Investment Report
        │
        ▼
React Investment Dashboard
```

---

# 🎯 Project Goal

The goal of this project was not simply to build an application that sends a company name to an LLM.

The goal was to explore how an AI-powered research system can:

* Gather evidence from multiple sources
* Coordinate research through an agentic workflow
* Separate deterministic calculations from AI reasoning
* Handle partial external-service failures
* Generate explainable investment recommendations
* Present complex research in a structured and user-friendly format

The result is a modular AI investment research platform that demonstrates full-stack development, agent orchestration, external API integration, deterministic financial scoring, structured LLM reasoning, and production deployment.

---

# ⚠️ Disclaimer

This project is built for educational and demonstration purposes.

The generated reports and INVEST/PASS recommendations should not be considered professional financial advice. Users should conduct independent research and consult qualified financial professionals before making investment decisions.

---

# 👨‍💻 Author

**Harshit Raj**

Built as part of the **InsideIIM / AltUni AI Labs AI Investment Research Agent Assignment**.
