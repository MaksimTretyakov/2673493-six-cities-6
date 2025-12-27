import { Offer, City, Location, Host } from '../types/offer';
import { Review, User } from '../types/review';
import { UserData } from '../types/auth';
import { AuthorizationStatus, SortingOption } from '../consts';
import { NameSpace } from '../store/const';
import { RootState } from '../store';

export const makeFakeLocation = (): Location => ({
  latitude: 52.35514938496378,
  longitude: 4.673877537499948,
  zoom: 8,
});

export const makeFakeCity = (): City => ({
  name: 'Amsterdam',
  location: makeFakeLocation(),
});

export const makeFakeHost = (): Host => ({
  id: 1,
  name: 'Oliver Conner',
  isPro: false,
  avatarUrl: 'https://url-to-image/image.png',
});

export const makeFakeOffer = (): Offer => ({
  id: '6af6f711-c28d-4121-82cd-e0b462a27f00',
  title: 'Beautiful & luxurious studio at great location',
  type: 'apartment',
  price: 120,
  city: makeFakeCity(),
  location: makeFakeLocation(),
  isFavorite: false,
  isPremium: false,
  rating: 4,
  previewImage: 'https://url-to-image/image.png',
  description:
    'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
  bedrooms: 3,
  goods: ['Heating'],
  host: makeFakeHost(),
  images: ['https://url-to-image/image.png'],
  maxAdults: 4,
});

export const makeFakeUser = (): User => ({
  id: 1,
  name: 'Oliver Conner',
  isPro: false,
  avatarUrl: 'https://url-to-image/image.png',
});

export const makeFakeReview = (): Review => ({
  id: 'b67ddfd5-b953-4a30-8c8d-bd083cd6b62a',
  date: '2019-05-08T14:13:56.569Z',
  user: makeFakeUser(),
  comment:
    'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
  rating: 4,
});

export const makeFakeUserData = (): UserData => ({
  name: 'Oliver Conner',
  avatarUrl: 'https://url-to-image/image.png',
  isPro: false,
  email: 'Oliver.conner@gmail.com',
  token: 'T2xpdmVyLmNvbm5lckBnbWFpbC5jb20=',
});

export const makeFakeStore = (
  initialState?: Partial<RootState>
): RootState => ({
  [NameSpace.Data]: {
    offers: [],
    favoriteOffers: [],
    isOffersDataLoading: false,
    isOfferDataLoading: false,
    isCommentSubmitting: false,
    currentOffer: null,
    comments: [],
    nearbyOffers: [],
  },
  [NameSpace.User]: {
    authorizationStatus: AuthorizationStatus.NoAuth,
    user: null,
  },
  [NameSpace.App]: {
    city: 'Paris',
    sortType: SortingOption.Popular,
    error: null,
  },
  ...initialState,
});
