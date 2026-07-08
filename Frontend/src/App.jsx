import React, { useState } from 'react';
import { submitResearchRequest } from './services/researchApi.js';
import './App.css';

const workflow = [
  'Validate company',
  'Plan research',
  'Web research',
  'Financial research',
  'Recent news',
  'Risk analysis',
  'Company analysis',
  'Investment scoring',
  'Final decision'
];

const sampleCompanies = ['Tata Consultancy Services', 'Infosys', 'Reliance Industries', 'HDFC Bank'];

function App() {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleExampleClick = (name) => {
    setCompanyName(name);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = companyName.trim();

    if (!trimmedName) {
      setError('Enter a company name to start the research workflow.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await submitResearchRequest(trimmedName);
      setResult(response);
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to contact the backend research API.');
    } finally {
      setLoading(false);
    }
  };

  const report = result?.data?.decision ? result.data : null;
  const workflowErrors = Array.isArray(result?.data?.errors) ? result.data.errors.filter(Boolean) : [];
  const normalizedCompanyName = report?.company || result?.data?.normalizedCompanyName || companyName.trim();
  const decisionLabel = showDecision(report);

  return (
    <main className="research-shell">
      <div className="research-backdrop research-backdrop-left" />
      <div className="research-backdrop research-backdrop-right" />

      <section className="research-layout">
        <div className="hero-card">
          <div className="eyebrow">AI investment research agent</div>
          <h1>
            Research a company with a <span>real workflow</span>, not a single LLM guess.
          </h1>
          <p className="hero-copy">
            Enter a company name and the backend will eventually validate the company, gather current web and
            financial evidence, reason with Gemini, and return a structured INVEST or PASS report.
          </p>

          <form className="research-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="companyName">
              Company name
            </label>
            <div className="form-row">
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Search for a listed company"
                autoComplete="off"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Researching...' : 'Start research'}
              </button>
            </div>

            <div className="sample-row" aria-label="Sample companies">
              {sampleCompanies.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="sample-chip"
                  onClick={() => handleExampleClick(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            {error ? <p className="status status-error">{error}</p> : null}
            {!error && result ? <p className="status status-success">{result.message}</p> : null}
            {!error && workflowErrors.length > 0 ? (
              <p className="status status-warning">
                Workflow finished with {workflowErrors.length} partial issue(s). Report is based on available evidence.
              </p>
            ) : null}
          </form>

          <div className="workflow-card">
            <div className="workflow-header">
              <h2>Workflow</h2>
              <span>LangGraph orchestration</span>
            </div>
            <div className="workflow-steps">
              {workflow.map((step, index) => (
                <div key={step} className="workflow-step">
                  <span className="step-index">0{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="results-panel">
          <div className="results-header">
            <div>
              <p className="eyebrow">Research output</p>
              <h2>{normalizedCompanyName || 'No company selected yet'}</h2>
            </div>
            <div className={`decision-pill ${decisionLabel.className}`}>
              {decisionLabel.label}
            </div>
          </div>

          {loading ? (
            <div className="loading-state" role="status" aria-live="polite">
              <p className="empty-title">Running research workflow...</p>
              <p>
                Collecting sources from Tavily and Alpha Vantage, then generating structured analysis with Gemini.
                If one provider fails, the workflow still returns a best-effort report.
              </p>
            </div>
          ) : report ? (
            <div className="report-grid">
              {workflowErrors.length > 0 ? (
                <section className="report-section report-warning" aria-live="polite">
                  <h3>Partial data issues</h3>
                  <ul>
                    {workflowErrors.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="report-section score-summary">
                <div>
                  <span>Decision confidence</span>
                  <strong>{report.confidence ?? 'N/A'}%</strong>
                </div>
                <div>
                  <span>Overall score</span>
                  <strong>{report.overallScore ?? 'N/A'}</strong>
                </div>
              </section>

              <section className="report-section report-highlight">
                <h3>Investment thesis</h3>
                <p>{report.investmentThesis}</p>
              </section>

              <section className="report-section">
                <h3>Core scores</h3>
                <div className="score-grid">
                  {Object.entries(report.scores || {}).map(([label, value]) => (
                    <div key={label} className="score-card">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className="report-section">
                <h3>Company overview</h3>
                <p>{report.companyOverview}</p>
              </section>

              <section className="report-section two-column">
                <div>
                  <h3>Strengths</h3>
                  <ul>
                    {(report.strengths || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Risks</h3>
                  <ul>
                    {(report.risks || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="report-section">
                <h3>Recent developments</h3>
                <ul>
                  {(report.recentDevelopments || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="report-section">
                <h3>Sources</h3>
                <ul className="source-list">
                  {(report.sources || []).map((source) => (
                    <li key={source.url || source.title}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title || source.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-title">Waiting for the first structured report</p>
              <p>
                This panel is already shaped for the final LangGraph output. Right now it shows the backend accept
                step; once the agent workflow is wired, it will render the full investment report here.
              </p>
              {result ? (
                <div className="raw-response">
                  <span>Current backend response</span>
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              ) : null}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

function showDecision(report) {
  if (!report) {
    return { label: 'PENDING', className: 'decision-pending' };
  }

  const normalizedDecision = String(report.decision || '').toUpperCase();

  if (normalizedDecision === 'INVEST') {
    return { label: 'INVEST', className: 'decision-invest' };
  }

  if (normalizedDecision === 'PASS') {
    return { label: 'PASS', className: 'decision-pass' };
  }

  return { label: normalizedDecision || 'PENDING', className: 'decision-pending' };
}

export default App;
