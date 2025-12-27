import { createAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../consts';

export const changeCity = createAction<string>('city/changeCity');
export const setError = createAction<string | null>('app/setError');
export const requireAuthorization = createAction<AuthorizationStatus>(
  'user/requireAuthorization'
);
export const changeSortType = createAction<string>('app/changeSortType');
