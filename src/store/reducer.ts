import { createReducer } from '@reduxjs/toolkit';
import { Offer } from '../types/offer';
import { changeCity, setError } from './action';
import { fetchOffersAction } from './api-actions';

type InitialState = {
  city: string;
  offers: Offer[];
  isOffersDataLoading: boolean;
  error: string | null;
};

const initialState: InitialState = {
  city: 'Paris',
  offers: [],
  isOffersDataLoading: false,
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
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    });
});

export { reducer };
