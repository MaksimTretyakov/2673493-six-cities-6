import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CitiesList from './cities-list';
import { CITIES } from '../../consts';

describe('Component: CitiesList', () => {
  it('should render correctly', () => {
    render(
      <MemoryRouter>
        <CitiesList
          cities={CITIES}
          selectedCity="Paris"
          onCityClick={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
  });

  it('should have active class on selected city', () => {
    render(
      <MemoryRouter>
        <CitiesList
          cities={CITIES}
          selectedCity="Amsterdam"
          onCityClick={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Amsterdam').parentElement).toHaveClass(
      'tabs__item--active'
    );
  });

  it('should call onCityClick when a city is clicked', async () => {
    const handleCityClick = vi.fn();
    render(
      <MemoryRouter>
        <CitiesList
          cities={CITIES}
          selectedCity="Paris"
          onCityClick={handleCityClick}
        />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByText('Cologne'));
    expect(handleCityClick).toHaveBeenCalledWith('Cologne');
  });
});
