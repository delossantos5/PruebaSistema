import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /sistema contable/i, level: 1 }); // Busca específicamente el <h1>
  expect(heading).toBeInTheDocument();
});
