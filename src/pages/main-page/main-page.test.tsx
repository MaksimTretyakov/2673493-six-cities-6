import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import MainPage from './main-page';
import { makeFakeOffer, makeFakeStore } from '../../utils/mocks';
import { NameSpace } from '../../store/const';
import { CITIES } from '../../consts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Page: MainPage', () => {
  it('should render correctly with offers', () => {
    const offers = [makeFakeOffer()];
    const store = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          offers: offers,
        },
        [NameSpace.App]: {
          ...makeFakeStore()[NameSpace.App],
          city: offers[0].city.name,
        },
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText(`1 places to stay in ${offers[0].city.name}`)
    ).toBeInTheDocument();
    expect(screen.getByText(CITIES[0].name)).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('should render MainEmpty when no offers for the city', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          offers: [],
        },
        [NameSpace.App]: {
          ...makeFakeStore()[NameSpace.App],
          city: 'Paris',
        },
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
  });
});
