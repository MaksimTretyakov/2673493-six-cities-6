import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { UserData } from '../types/auth';
import { changeCity, setError, requireAuthorization } from './action';
import { fetchOffersAction, checkAuthAction, loginAction } from './api-actions';
import { AuthorizationStatus } from '../consts';

type InitialState = {
  city: string;
  offers: Offer[];
  isOffersDataLoading: boolean;
  authorizationStatus: AuthorizationStatus;
  user: UserData | null;
  error: string | null;
};

const initialState: InitialState = {
  city: 'Paris',
  offers: [],
  isOffersDataLoading: false,
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  error: null,
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
      state.error = 'Failed to load offers. Please check your connection.';
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
