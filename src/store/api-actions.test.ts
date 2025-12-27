import { createAPI } from '../services/api';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from 'redux';
import { AppDispatch, RootState } from './index';
import {
  fetchOffersAction,
  fetchFavoriteOffersAction,
  checkAuthAction,
  loginAction,
  logoutAction,
} from './api-actions';
import { makeFakeOffer, makeFakeUserData } from '../utils/mocks';

describe('Async actions', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);
  const middlewares = [thunk.withExtraArgument(api)];

  const mockStore = configureMockStore<RootState, Action<string>, AppDispatch>(
    middlewares
  );

  it('should dispatch fetchOffersAction.pending and fetchOffersAction.fulfilled when server returns 200', async () => {
    const mockOffers = [makeFakeOffer()];
    mockAPI.onGet('/offers').reply(200, mockOffers);
    const store = mockStore();

    await store.dispatch(fetchOffersAction());

    const actions = store.getActions().map(({ type }) => type);
    expect(actions).toEqual([
      fetchOffersAction.pending.type,
      fetchOffersAction.fulfilled.type,
    ]);
  });

  it('should dispatch checkAuthAction.pending and checkAuthAction.fulfilled when server returns 200', async () => {
    const mockUser = makeFakeUserData();
    mockAPI.onGet('/login').reply(200, mockUser);
    mockAPI.onGet('/favorite').reply(200, []);
    const store = mockStore();

    await store.dispatch(checkAuthAction());

    const actions = store.getActions().map(({ type }) => type);
    expect(actions).toEqual([
      checkAuthAction.pending.type,
      fetchFavoriteOffersAction.pending.type,
      checkAuthAction.fulfilled.type,
    ]);
  });

  it('should dispatch loginAction.pending and loginAction.fulfilled when server returns 200', async () => {
    const mockUser = makeFakeUserData();
    const authData = { email: 'test@test.com', password: '123' };
    mockAPI.onPost('/login').reply(200, mockUser);
    mockAPI.onGet('/favorite').reply(200, []);
    const store = mockStore();

    await store.dispatch(loginAction(authData));

    const actions = store.getActions().map(({ type }) => type);
    expect(actions).toEqual([
      loginAction.pending.type,
      fetchFavoriteOffersAction.pending.type,
      loginAction.fulfilled.type,
    ]);
  });

  it('should dispatch logoutAction.pending and logoutAction.fulfilled when server returns 204', async () => {
    mockAPI.onDelete('/logout').reply(204);
    const store = mockStore();

    await store.dispatch(logoutAction());

    const actions = store.getActions().map(({ type }) => type);

    expect(actions).toEqual([
      logoutAction.pending.type,
      logoutAction.fulfilled.type,
    ]);
  });
});
