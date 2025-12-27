import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { Review } from '../types/review';
import { UserData } from '../types/auth';
import { changeCity, setError, requireAuthorization } from './action';
import {
  fetchOffersAction,
  checkAuthAction,
  loginAction,
  fetchOfferAction,
  fetchCommentsAction,
  fetchNearbyOffersAction,
  postCommentAction,
} from './api-actions';
import { AuthorizationStatus } from '../consts';

type InitialState = {
  city: string;
  offers: Offer[];
  isOffersDataLoading: boolean;
  isOfferDataLoading: boolean;
  isCommentSubmitting: boolean;
  authorizationStatus: AuthorizationStatus;
  user: UserData | null;
  error: string | null;
  currentOffer: Offer | null;
  comments: Review[];
  nearbyOffers: Offer[];
};

const initialState: InitialState = {
  city: 'Paris',
  offers: [],
  isOffersDataLoading: false,
  isOfferDataLoading: true,
  isCommentSubmitting: false,
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  error: null,
  currentOffer: null,
  comments: [],
  nearbyOffers: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
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
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(checkAuthAction.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.user = action.payload;
    })
    .addCase(checkAuthAction.rejected, (state) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.user = null;
    })
    .addCase(loginAction.fulfilled, (state, action) => {
      state.authorizationStatus = AuthorizationStatus.Auth;
      state.user = action.payload;
    })
    .addCase(loginAction.rejected, (state) => {
      if (state.authorizationStatus !== AuthorizationStatus.Auth) {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.user = null;
      }
      state.error = 'Login failed. Please check your credentials.';
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    });
});

export { reducer };
