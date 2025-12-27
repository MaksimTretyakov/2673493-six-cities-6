import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import OfferPage from './offer-page';
import {
  makeFakeOffer,
  makeFakeReview,
  makeFakeStore,
} from '../../utils/mocks';
import { AuthorizationStatus } from '../../consts';
import { NameSpace } from '../../store/const';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mockOffer = makeFakeOffer();
const mockReviews = [makeFakeReview()];
const mockNearby = [makeFakeOffer()];

describe('Page: OfferPage', () => {
  it('should render spinner while loading', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          isOfferDataLoading: true,
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${mockOffer.id}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render offer details when data is loaded', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          currentOffer: mockOffer,
          comments: mockReviews,
          nearbyOffers: mockNearby,
          isOfferDataLoading: false,
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${mockOffer.id}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const mainHeading = screen.getByRole('heading', {
      level: 1,
      name: mockOffer.title,
    });
    expect(mainHeading).toBeInTheDocument();
    expect(
      screen.getByText('Other places in the neighbourhood')
    ).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(mockNearby.length);
  });

  it('should render comment form for authorized user', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.User]: {
          ...makeFakeStore()[NameSpace.User],
          authorizationStatus: AuthorizationStatus.Auth,
        },
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          currentOffer: mockOffer,
          isOfferDataLoading: false,
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${mockOffer.id}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Your review/i)).toBeInTheDocument();
  });

  it('should not render comment form for unauthorized user', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          currentOffer: mockOffer,
          isOfferDataLoading: false,
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/offer/${mockOffer.id}`]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByLabelText(/Your review/i)).not.toBeInTheDocument();
  });
});
