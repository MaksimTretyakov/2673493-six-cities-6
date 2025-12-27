import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import Header from './header';
import { AuthorizationStatus } from '../../consts';
import { makeFakeStore, makeFakeOffer } from '../../utils/mocks';
import { NameSpace } from '../../store/const';

const mockStore = configureMockStore();

describe('Component: Header', () => {
  it('should render sign in for unauthorized user', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          user: null,
        },
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  it('should render user info and sign out for authorized user', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          user: {
            email: 'test@example.com',
            name: 'Test User',
            avatarUrl: 'avatar.jpg',
            isPro: false,
            token: 'token',
          },
        },
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          favoriteOffers: [makeFakeOffer(), makeFakeOffer(), makeFakeOffer()],
        },
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
