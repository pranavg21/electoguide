import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/ui/Header';

describe('Header', () => {
  it('renders branding and integrations', () => {
    render(<Header />);
    expect(screen.getByText('ElectoGuide Bharat')).toBeInTheDocument();
    expect(screen.getByText('Generative UI')).toBeInTheDocument();
    expect(screen.getByText('Vertex AI')).toBeInTheDocument();
  });

  it('toggles theme when button is clicked', () => {
    render(<Header />);
    const button = screen.getByRole('button', { name: /switch to/i });
    expect(button).toBeInTheDocument();
    
    // Test the click interaction
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
