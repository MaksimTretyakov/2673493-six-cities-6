import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
import {
  fetchOffersAction,
  fetchOfferAction,
  fetchCommentsAction,
  fetchNearbyOffersAction,
  postCommentAction,
} from '../api-actions';

type DataProcess = {
  offers: Offer[];
  isOffersDataLoading: boolean;
  isOfferDataLoading: boolean;
  isCommentSubmitting: boolean;
  currentOffer: Offer | null;
  comments: Review[];
  nearbyOffers: Offer[];
};

const initialState: DataProcess = {
  offers: [],
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
    .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
      state.nearbyOffers = action.payload;
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
    });
});
