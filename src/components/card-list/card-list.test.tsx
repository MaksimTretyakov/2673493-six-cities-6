import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import CardList from './card-list';
import { makeFakeOffer, makeFakeStore } from '../../utils/mocks';

const mockStore = configureMockStore();
const store = mockStore(makeFakeStore());
const mockOffers = [makeFakeOffer(), makeFakeOffer()];

describe('Component: CardList', () => {
  it('should render a list of cards', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CardList offers={mockOffers} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByRole('article')).toHaveLength(mockOffers.length);
  });
});
