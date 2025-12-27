import { render, screen } from '@testing-library/react';
import MainEmpty from './main-empty';

describe('Component: MainEmpty', () => {
  it('should render correctly with given city', () => {
    const city = 'Dusseldorf';
    render(<MainEmpty selectedCity={city} />);
    expect(
      screen.getByText(/No places to stay available/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /We could not find any property available at the moment in Dusseldorf/i
      )
    ).toBeInTheDocument();
  });
});
