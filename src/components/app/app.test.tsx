import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import { vi } from 'vitest';
import React from 'react';

import App from './app';
import { AuthorizationStatus } from '../../consts';
import { makeFakeStore, makeFakeOffer } from '../../utils/mocks';
import { NameSpace } from '../../store/const';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  };
});

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Application Routing', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render "MainPage" when user navigates to "/"', () => {
    const offerForParis = {
      ...makeFakeOffer(),
      city: {
        ...makeFakeOffer().city,
        name: 'Paris',
      },
    };

    const store = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          offers: [offerForParis],
          isOffersDataLoading: false,
        },
        [NameSpace.App]: {
          ...makeFakeStore()[NameSpace.App],
          city: 'Paris',
        },
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/places to stay in Paris/i)).toBeInTheDocument();
  });

  it('should render "LoginPage" when user navigates to "/login"', () => {
    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  it('should render "FavoritesPage" for authorized user', () => {
    const favoriteOffer = makeFakeOffer();
    const authStore = mockStore(
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          user: {
            name: 'test',
            email: 'test@test.com',
            avatarUrl: '',
            isPro: false,
            token: '',
          },
        },
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          favoriteOffers: [favoriteOffer],
          isOffersDataLoading: false,
        },
      })
    );

    render(
      <Provider store={authStore}>
        <MemoryRouter initialEntries={['/favorites']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Saved listing/i)).toBeInTheDocument();
  });

  it('should render "LoginPage" for unauthorized user trying to access "/favorites"', () => {
    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  });

  it('should render "NotFoundPage" when user navigates to non-existent route', () => {
    const store = mockStore(makeFakeStore());
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/non-existent-route']}>
          <App />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Go to the main page/i)).toBeInTheDocument();
  });
});
