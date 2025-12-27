import { render } from '@testing-library/react';
import Map from './map';
import { makeFakeCity, makeFakeOffer } from '../../utils/mocks';
import { vi } from 'vitest';

vi.mock('../../hooks/use-map', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('Component: Map', () => {
  it('should render correctly', () => {
    const mockCity = makeFakeCity();
    const mockOffers = [makeFakeOffer()];

    const { container } = render(
      <Map
        city={mockCity}
        offers={mockOffers}
        selectedOfferId={null}
        className="test-map"
      />
    );
    const mapElement = container.querySelector('.test-map');
    expect(mapElement).toBeInTheDocument();
  });
});
