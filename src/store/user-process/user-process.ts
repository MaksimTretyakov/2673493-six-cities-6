import { createReducer } from '@reduxjs/toolkit';
import { UserData } from '../../types/auth';
import { requireAuthorization } from '../action';
import { checkAuthAction, loginAction } from '../api-actions';
import { AuthorizationStatus } from '../../consts';

type UserProcess = {
  authorizationStatus: AuthorizationStatus;
  user: UserData | null;
};

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
};

export const userProcess = createReducer(initialState, (builder) => {
  builder
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
    });
});
