import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Offer } from '../types/offer';
import { NameSpace } from './const';

import { SortingOption } from '../consts';

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

export const selectFavoriteCount = createSelector(
  (state: RootState) => state[NameSpace.Data].favoriteOffers,
  (favoriteOffers) => favoriteOffers.length
);

export const selectSortType = (state: RootState) =>
  state[NameSpace.App].sortType;

export const selectSortedOffersForCity = createSelector(
  [selectOffersForCity, selectSortType],
  (offers, sortType) => {
    const offersCopy = [...offers];
    switch (sortType) {
      case SortingOption.PriceLowToHigh:
        return offersCopy.sort((a, b) => a.price - b.price);
      case SortingOption.PriceHighToLow:
        return offersCopy.sort((a, b) => b.price - a.price);
      case SortingOption.TopRatedFirst:
        return offersCopy.sort((a, b) => b.rating - a.rating);
      case SortingOption.Popular:
      default:
        return offers;
    }
  }
);

export const selectFetchedFavorites = (state: RootState) =>
  state[NameSpace.Data].favoriteOffers;

export const selectGroupedFetchedFavorites = createSelector(
  [selectFetchedFavorites],
  (favoriteOffers) => groupOffersByCity(favoriteOffers)
);
