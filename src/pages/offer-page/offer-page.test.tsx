import { render, screen, within } from '@testing-library/react';
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
  });

  it('should render no more than 10 reviews, sorted by date', () => {
    const newerReview = makeFakeReview({
      date: '2023-10-25T10:00:00.000Z',
      comment: 'This is the newest review.',
    });
    const olderReview = makeFakeReview({
      date: '2023-01-01T10:00:00.000Z',
      comment: 'This is the oldest review and should not be visible.',
    });
    const mockReviews12 = [
      olderReview,
      ...Array.from({ length: 10 }, (_, i) =>
        makeFakeReview({
          date: `2023-05-${10 + i}T10:00:00.000Z`,
          comment: `Review number ${i}`,
        })
      ),
      newerReview,
    ];

    const store = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          currentOffer: mockOffer,
          comments: mockReviews12,
          isOfferDataLoading: false,
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );
    const reviewsSection = screen.getByText(/Reviews/i).closest('section');
    expect(reviewsSection).toBeInTheDocument();
    if (reviewsSection) {
      const reviewItems = within(reviewsSection).getAllByRole('listitem');
      expect(reviewItems).toHaveLength(10);
      expect(
        within(reviewItems[0]).getByText(newerReview.comment)
      ).toBeInTheDocument();
      expect(
        within(reviewsSection).queryByText(olderReview.comment)
      ).not.toBeInTheDocument();
    }
  });

  it('should render no more than 3 nearby offers', () => {
    const store = mockStore(
      makeFakeStore({
        [NameSpace.Data]: {
          ...makeFakeStore()[NameSpace.Data],
          currentOffer: mockOffer,
          nearbyOffers: Array.from({ length: 5 }, makeFakeOffer),
          isOfferDataLoading: false,
        },
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <OfferPage />
        </MemoryRouter>
      </Provider>
    );
    const nearbySection = screen.getByText(
      /Other places in the neighbourhood/i
    ).parentElement;
    expect(nearbySection).toBeInTheDocument();
    if (nearbySection) {
      const nearbyCards = within(nearbySection).getAllByRole('article');
      expect(nearbyCards).toHaveLength(3);
    }
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
