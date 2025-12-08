import { createReducer } from '@reduxjs/toolkit';
import { offers } from '../mocks/offers';
import { Offer } from '../types/offer';
import { changeCity, fillOffers } from './action';

type InitialState = {
  city: string;
  offers: Offer[];
};

const initialState: InitialState = {
  city: 'Paris',
  offers: offers,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(fillOffers, (state, action) => {
      state.offers = action.payload;
    });
});

export { reducer };
