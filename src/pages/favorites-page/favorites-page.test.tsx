import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import FavoritesPage from './favorites-page';
import { makeFakeOffer, makeFakeStore } from '../../utils/mocks';
import { AuthorizationStatus } from '../../consts';
import { NameSpace } from '../../store/const';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Page: FavoritesPage', () => {
  it('should render empty page when no favorite offers', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.User]: {
          ...makeFakeStore()[NameSpace.User],
          authorizationStatus: AuthorizationStatus.Auth,
        },
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          favoriteOffers: [],
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
  });

  it('should render favorite offers when they exist', () => {
    const favoriteOffers = [
      { ...makeFakeOffer(), city: { ...makeFakeOffer().city, name: 'Paris' } },
      {
        ...makeFakeOffer(),
        city: { ...makeFakeOffer().city, name: 'Cologne' },
      },
    ];
    const store = mockStore(
      makeFakeStore({
        [NameSpace.User]: {
          ...makeFakeStore()[NameSpace.User],
          authorizationStatus: AuthorizationStatus.Auth,
        },
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          favoriteOffers: favoriteOffers,
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Saved listing')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(favoriteOffers.length);
  });
});
