import { render, screen, fireEvent } from '@testing-library/react';
import { EVMSimulator } from '@/components/generative/EVMSimulator';
import type { EVMSimulatorOutput } from '@/lib/schemas';

const mockData: EVMSimulatorOutput = {
  title: "EVM Voting Simulation",
  description: "Learn how to use the Electronic Voting Machine",
  steps: [
    { id: "verify", title: "Identity Verification", description: "Show your ID" },
    { id: "press", title: "Cast Vote", description: "Press the blue button" },
    { id: "vvpat", title: "Check VVPAT", description: "Verify the printed slip" }
  ]
};

describe('EVMSimulator', () => {
  it('renders initial step and titles', () => {
    render(<EVMSimulator data={mockData} />);
    expect(screen.getByText('EVM Voting Simulation')).toBeInTheDocument();
    expect(screen.getByText('Identity Verification')).toBeInTheDocument();
  });

  it('can navigate to next step', () => {
    render(<EVMSimulator data={mockData} />);
    
    const nextButton = screen.getByText(/Next Step/i);
    fireEvent.click(nextButton);
    expect(screen.getByText('Cast Vote')).toBeInTheDocument();
  });

  it('can reset the simulation', () => {
    render(<EVMSimulator data={mockData} />);
    
    // Navigate to step 2
    fireEvent.click(screen.getByText(/Next Step/i));
    expect(screen.getByText('Cast Vote')).toBeInTheDocument();
    
    // Reset to step 1
    fireEvent.click(screen.getByText(/Restart/i));
    expect(screen.getByText('Identity Verification')).toBeInTheDocument();
  });
});
