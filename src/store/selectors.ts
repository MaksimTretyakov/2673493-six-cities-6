import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Offer } from '../types/offer';
import { NameSpace } from './const';

const groupOffersByCity = (offers: Offer[]) =>
  offers.reduce<{ [key: string]: Offer[] }>((acc, offer) => {
    if (!acc[offer.city.name]) {
      acc[offer.city.name] = [];
    }
    acc[offer.city.name].push(offer);
    return acc;
  }, {});

export const selectOffers = (state: RootState) => state[NameSpace.Data].offers;
export const selectCity = (state: RootState) => state[NameSpace.App].city;

export const selectOffersForCity = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city)
);

export const selectFavoriteOffers = createSelector([selectOffers], (offers) =>
  offers.filter((offer) => offer.isFavorite)
);

export const selectFavoriteCount = createSelector(
  [selectFavoriteOffers],
  (favoriteOffers) => favoriteOffers.length
);

export const selectGroupedFavoriteOffers = createSelector(
  [selectFavoriteOffers],
  (favoriteOffers) => groupOffersByCity(favoriteOffers)
);
