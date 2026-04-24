import { render, screen, fireEvent } from '@testing-library/react';
import { Form6Wizard } from '@/components/generative/Form6Wizard';
import type { Form6WizardOutput } from '@/lib/schemas';

const mockData: Form6WizardOutput = {
  state: "Maharashtra",
  eligible: true,
  summary: "Eligible for registration",
  requirements: [
    { id: "req-1", label: "Address Proof", description: "Any valid address proof", met: false, category: "residency" }
  ],
  registrationUrl: "https://voters.eci.gov.in"
};

describe('Form6Wizard', () => {
  it('renders initial step and title', () => {
    render(<Form6Wizard data={mockData} />);
    expect(screen.getByText('Form 6 — Voter Registration Check')).toBeInTheDocument();
    expect(screen.getByText('Are you an Indian citizen?')).toBeInTheDocument();
  });

  it('navigates through steps', () => {
    render(<Form6Wizard data={mockData} />);
    
    // Step 1 -> 2
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    expect(screen.getByText('Will you be 18+ years old on 1st January of the qualifying year?')).toBeInTheDocument();
    
    // Step 2 -> 3
    fireEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText('Which state/UT are you a resident of?')).toBeInTheDocument();
    
    // Step 3 -> 4
    fireEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText('Which ID proof will you submit?')).toBeInTheDocument();
  });
});
