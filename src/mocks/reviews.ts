import { Review } from '../types/review';

export const reviews: Review[] = [
  {
    id: 'b67ddfd5-b953-4a30-8c8d-bd083cd6b62a',
    date: '2023-04-24T10:20:30.123Z',
    user: {
      name: 'Max',
      avatarUrl: 'img/avatar-max.jpg',
      isPro: false,
      id: 1,
    },
    comment:
      'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    rating: 4,
  },
  {
    id: 'a57ddfd5-b953-4a30-8c8d-bd083cd6b62b',
    date: '2023-03-15T12:00:00.000Z',
    user: {
      name: 'Angelina',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true,
      id: 2,
    },
    comment:
      'The apartment is just perfect. Everything you need is there. The location is also great, very central. I would recommend it to anyone.',
    rating: 5,
  },
  {
    id: 'c87ddfd5-b953-4a30-8c8d-bd083cd6b62c',
    date: '2023-02-01T08:45:10.543Z',
    user: {
      name: 'John',
      avatarUrl: 'img/avatar.svg',
      isPro: false,
      id: 3,
    },
    comment:
      'It was a nice stay. The host was very friendly and helpful. However, the room was a bit smaller than expected.',
    rating: 3,
  },
];
