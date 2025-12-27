import { createReducer } from '@reduxjs/toolkit';
import { changeCity, setError, changeSortType } from '../action';
import {
  loginAction,
  postCommentAction,
  fetchOffersAction,
  fetchOfferAction,
  fetchNearbyOffersAction,
  fetchCommentsAction,
  logoutAction,
  toggleFavoriteStatusAction,
  fetchFavoriteOffersAction,
} from '../api-actions';
import { SortingOption } from '../../consts';

type AppProcess = {
  city: string;
  sortType: string;
  error: string | null;
};

const initialState: AppProcess = {
  city: 'Paris',
  sortType: SortingOption.Popular,
  error: null,
};

export const appProcess = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(loginAction.rejected, (state) => {
      state.error = 'Login failed. Please check your credentials.';
    })
    .addCase(postCommentAction.rejected, (state) => {
      state.error = 'Failed to post comment. Please try again later.';
    })
    .addCase(changeSortType, (state, action) => {
      state.sortType = action.payload;
    })
    .addCase(fetchOffersAction.rejected, (state) => {
      state.error = 'Failed to load offers. Please try again later.';
    })
    .addCase(fetchOfferAction.rejected, (state) => {
      state.error = 'Failed to load offer details. Please try again later.';
    })
    .addCase(fetchNearbyOffersAction.rejected, (state) => {
      state.error = 'Failed to load nearby offers.';
    })
    .addCase(fetchCommentsAction.rejected, (state) => {
      state.error = 'Failed to load comments.';
    })
    .addCase(logoutAction.rejected, (state) => {
      state.error = 'Logout failed. Please try again.';
    })
    .addCase(toggleFavoriteStatusAction.rejected, (state) => {
      state.error = 'Failed to update favorite status. Please try again.';
    })
    .addCase(fetchFavoriteOffersAction.rejected, (state) => {
      state.error = 'Failed to load favorite offers. Please try again later.';
    });
});
