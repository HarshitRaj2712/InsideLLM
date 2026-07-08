import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import App from './App.jsx';
import { submitResearchRequest } from './services/researchApi.js';

vi.mock('./services/researchApi.js', () => ({
  submitResearchRequest: vi.fn()
}));

describe('App', () => {
  test('shows partial failure warning when workflow returns errors with successful report', async () => {
    submitResearchRequest.mockResolvedValueOnce({
      success: true,
      message: 'Research workflow executed',
      data: {
        company: 'Test Corp',
        decision: 'PASS',
        confidence: 66,
        overallScore: 5.8,
        scores: {
          financialHealth: 4.1,
          growthPotential: 6.2,
          marketPosition: 5.3,
          riskLevel: 7
        },
        companyOverview: 'Overview text',
        strengths: ['Efficient operations'],
        risks: ['Margin pressure'],
        recentDevelopments: ['Earnings miss'],
        investmentThesis: 'Wait for clearer fundamentals.',
        sources: [],
        errors: ['Tavily request failed with timeout']
      }
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/company name/i), {
      target: { value: 'Test Corp' }
    });

    fireEvent.click(screen.getByRole('button', { name: /start research/i }));

    await waitFor(() => {
      expect(screen.getByText(/workflow finished with 1 partial issue/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: /partial data issues/i })).toBeInTheDocument();
    expect(screen.getByText(/Tavily request failed with timeout/i)).toBeInTheDocument();
  });
});
