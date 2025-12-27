import { createReducer } from '@reduxjs/toolkit';
import { changeCity, setError, changeSortType } from '../action';
import { loginAction } from '../api-actions';
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
    .addCase(changeSortType, (state, action) => {
      state.sortType = action.payload;
    });
});
