import { createReducer } from '@reduxjs/toolkit';
import { changeCity, setError } from '../action';
import { loginAction } from '../api-actions';

type AppProcess = {
  city: string;
  error: string | null;
};

const initialState: AppProcess = {
  city: 'Paris',
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
    });
});
