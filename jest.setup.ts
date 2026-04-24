import '@testing-library/jest-dom';

// Polyfill for matchMedia which is not present in JSDOM but used by Framer Motion / Lucide etc.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock framer-motion to avoid animation delays in tests
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  
  const MockDiv = React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
    return React.createElement('div', { ref, ...rest });
  });
  MockDiv.displayName = 'motion.div';

  const MockButton = React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
    return React.createElement('button', { ref, ...rest });
  });
  MockButton.displayName = 'motion.button';

  const MockAnimatePresence = ({ children }: { children: React.ReactNode }) => 
    React.createElement(React.Fragment, null, children);
  MockAnimatePresence.displayName = 'AnimatePresence';

  return {
    ...jest.requireActual('framer-motion'),
    motion: {
      div: MockDiv,
      button: MockButton,
    },
    AnimatePresence: MockAnimatePresence,
  };
});
