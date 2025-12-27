import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
import {
  fetchOffersAction,
  fetchOfferAction,
  fetchCommentsAction,
  fetchNearbyOffersAction,
  postCommentAction,
  toggleFavoriteStatusAction,
  fetchFavoriteOffersAction,
  logoutAction,
} from '../api-actions';

type DataProcess = {
  offers: Offer[];
  favoriteOffers: Offer[];
  isOffersDataLoading: boolean;
  isOfferDataLoading: boolean;
  isCommentSubmitting: boolean;
  currentOffer: Offer | null;
  comments: Review[];
  nearbyOffers: Offer[];
};

const initialState: DataProcess = {
  offers: [],
  favoriteOffers: [],
  isOffersDataLoading: false,
  isOfferDataLoading: true,
  isCommentSubmitting: false,
  currentOffer: null,
  comments: [],
  nearbyOffers: [],
};

export const dataProcess = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchOffersAction.pending, (state) => {
      state.isOffersDataLoading = true;
    })
    .addCase(fetchOffersAction.fulfilled, (state, action) => {
      state.offers = action.payload;
      state.isOffersDataLoading = false;
    })
    .addCase(fetchOffersAction.rejected, (state) => {
      state.isOffersDataLoading = false;
    })
    .addCase(fetchOfferAction.pending, (state) => {
      state.isOfferDataLoading = true;
    })
    .addCase(fetchOfferAction.fulfilled, (state, action) => {
      state.currentOffer = action.payload;
      state.isOfferDataLoading = false;
    })
    .addCase(fetchOfferAction.rejected, (state) => {
      state.isOfferDataLoading = false;
      state.currentOffer = null;
    })
    .addCase(fetchCommentsAction.fulfilled, (state, action) => {
      state.comments = action.payload;
    })
    .addCase(fetchCommentsAction.rejected, (state) => {
      state.comments = [];
    })
    .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(fetchNearbyOffersAction.rejected, (state) => {
      state.nearbyOffers = [];
    })
    .addCase(postCommentAction.pending, (state) => {
      state.isCommentSubmitting = true;
    })
    .addCase(postCommentAction.fulfilled, (state, action) => {
      state.comments = [action.payload, ...state.comments];
      state.isCommentSubmitting = false;
    })
    .addCase(postCommentAction.rejected, (state) => {
      state.isCommentSubmitting = false;
    })
    .addCase(toggleFavoriteStatusAction.fulfilled, (state, action) => {
      const updatedOffer = action.payload;
      state.offers = state.offers.map((offer) =>
        offer.id === updatedOffer.id ? updatedOffer : offer
      );
      state.nearbyOffers = state.nearbyOffers.map((offer) =>
        offer.id === updatedOffer.id ? updatedOffer : offer
      );
      if (state.currentOffer && state.currentOffer.id === updatedOffer.id) {
        state.currentOffer = updatedOffer;
      }
      if (updatedOffer.isFavorite) {
        state.favoriteOffers.push(updatedOffer);
      } else {
        state.favoriteOffers = state.favoriteOffers.filter(
          (offer) => offer.id !== updatedOffer.id
        );
      }
    })
    .addCase(fetchFavoriteOffersAction.fulfilled, (state, action) => {
      state.favoriteOffers = action.payload;
    })
    .addCase(fetchFavoriteOffersAction.rejected, (state) => {
      state.favoriteOffers = [];
    })
    .addCase(logoutAction.fulfilled, (state) => {
      state.offers = state.offers.map((offer) =>
        offer.isFavorite ? { ...offer, isFavorite: false } : offer
      );
      state.nearbyOffers = state.nearbyOffers.map((offer) =>
        offer.isFavorite ? { ...offer, isFavorite: false } : offer
      );
      if (state.currentOffer?.isFavorite) {
        state.currentOffer.isFavorite = false;
      }
      state.favoriteOffers = [];
    });
});
