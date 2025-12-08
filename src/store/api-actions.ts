import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { AuthData, UserData } from '../types/auth';
import { saveToken, dropToken } from '../services/token';
import { requireAuthorization } from './action';
import { AuthorizationStatus } from '../consts';

export const fetchOffersAction = createAsyncThunk<
  Offer[],
  undefined,
  { extra: AxiosInstance }
>('data/fetchOffers', async (_arg, { extra: api }) => {
  const { data } = await api.get<Offer[]>('/offers');
  return data;
});

export const checkAuthAction = createAsyncThunk<
  UserData,
  undefined,
  { extra: AxiosInstance }
>('user/checkAuth', async (_arg, { extra: api }) => {
  const { data } = await api.get<UserData>('/login');
  return data;
});

export const loginAction = createAsyncThunk<
  UserData,
  AuthData,
  { extra: AxiosInstance }
>('user/login', async ({ email, password }, { extra: api }) => {
  const { data } = await api.post<UserData>('/login', { email, password });
  saveToken(data.token);
  return data;
});

export const logoutAction = createAsyncThunk<
  void,
  undefined,
  { extra: AxiosInstance }
>('user/logout', async (_arg, { dispatch, extra: api }) => {
  await api.delete('/logout');
  dropToken();
  dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
});
