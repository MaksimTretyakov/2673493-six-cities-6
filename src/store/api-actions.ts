import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Offer } from '../types/offer';
import { Review, CommentData } from '../types/review';
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

export const fetchOfferAction = createAsyncThunk<
  Offer,
  string,
  { extra: AxiosInstance }
>('data/fetchOffer', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer>(`/offers/${offerId}`);
  return data;
});

export const fetchNearbyOffersAction = createAsyncThunk<
  Offer[],
  string,
  { extra: AxiosInstance }
>('data/fetchNearbyOffers', async (offerId, { extra: api }) => {
  const { data } = await api.get<Offer[]>(`/offers/${offerId}/nearby`);
  return data;
});

export const fetchCommentsAction = createAsyncThunk<
  Review[],
  string,
  { extra: AxiosInstance }
>('data/fetchComments', async (offerId, { extra: api }) => {
  const { data } = await api.get<Review[]>(`/comments/${offerId}`);
  return data;
});

export const postCommentAction = createAsyncThunk<
  Review,
  { offerId: string; commentData: CommentData },
  { extra: AxiosInstance }
>('data/postComment', async ({ offerId, commentData }, { extra: api }) => {
  const { data } = await api.post<Review>(`/comments/${offerId}`, commentData);
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
