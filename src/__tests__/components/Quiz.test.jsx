/**
 * @file Quiz.test.jsx — Registry-driven quiz render smoke test
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Quiz from '../../components/interactive/Quiz';
import { ActivityBankProvider } from '../../contexts/ActivityBankContext';
import { getModuleById } from '../../data/modules';

describe('Quiz', () => {
  it('renders module 1 registry quiz without crashing', () => {
    const { quiz } = getModuleById(1);
    render(
      <ActivityBankProvider>
        <Quiz questions={quiz} title="Retrieval" />
      </ActivityBankProvider>,
    );
    expect(screen.getByRole('region', { name: 'Retrieval' })).toBeInTheDocument();
    expect(screen.getByText(quiz[0].prompt)).toBeInTheDocument();
  });
});
