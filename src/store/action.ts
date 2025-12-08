import { createAction } from '@reduxjs/toolkit';

export const changeCity = createAction<string>('city/changeCity');
export const setError = createAction<string | null>('app/setError');
