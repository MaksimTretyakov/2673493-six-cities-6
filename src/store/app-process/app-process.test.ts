import { appProcess } from './app-process';
import { changeCity, changeSortType, setError } from '../action';
import {
  fetchCommentsAction,
  fetchFavoriteOffersAction,
  fetchNearbyOffersAction,
  fetchOfferAction,
  fetchOffersAction,
  loginAction,
  logoutAction,
  postCommentAction,
  toggleFavoriteStatusAction,
} from '../api-actions';
import { SortingOption } from '../../consts';

describe('AppProcess Reducer', () => {
  const initialState = {
    city: 'Paris',
    sortType: SortingOption.Popular,
    error: null,
  };

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = appProcess(initialState, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should return default initial state with undefined state and empty action', () => {
    const emptyAction = { type: '' };
    const result = appProcess(undefined, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should change city with "changeCity" action', () => {
    const newCity = 'Amsterdam';
    const action = changeCity(newCity);
    const result = appProcess(initialState, action);
    expect(result.city).toBe(newCity);
  });

  it('should change sort type with "changeSortType" action', () => {
    const newSortType = SortingOption.PriceHighToLow;
    const action = changeSortType(newSortType);
    const result = appProcess(initialState, action);
    expect(result.sortType).toBe(newSortType);
  });

  it('should set error with "setError" action', () => {
    const errorMessage = 'Something went wrong';
    const action = setError(errorMessage);
    const result = appProcess(initialState, action);
    expect(result.error).toBe(errorMessage);
  });

  it('should set error on postCommentAction.rejected', () => {
    const action = { type: postCommentAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe(
      'Failed to post comment. Please try again later.'
    );
  });

  it('should set error on loginAction.rejected', () => {
    const action = { type: loginAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe('Login failed. Please check your credentials.');
  });

  it('should set error on fetchOffersAction.rejected', () => {
    const action = { type: fetchOffersAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe('Failed to load offers. Please try again later.');
  });

  it('should set error on fetchOfferAction.rejected', () => {
    const action = { type: fetchOfferAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe(
      'Failed to load offer details. Please try again later.'
    );
  });

  it('should set error on fetchNearbyOffersAction.rejected', () => {
    const action = { type: fetchNearbyOffersAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe('Failed to load nearby offers.');
  });

  it('should set error on fetchCommentsAction.rejected', () => {
    const action = { type: fetchCommentsAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe('Failed to load comments.');
  });

  it('should set error on logoutAction.rejected', () => {
    const action = { type: logoutAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe('Logout failed. Please try again.');
  });

  it('should set error on toggleFavoriteStatusAction.rejected', () => {
    const action = { type: toggleFavoriteStatusAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe(
      'Failed to update favorite status. Please try again.'
    );
  });

  it('should set error on fetchFavoriteOffersAction.rejected', () => {
    const action = { type: fetchFavoriteOffersAction.rejected.type };
    const result = appProcess(initialState, action);
    expect(result.error).toBe(
      'Failed to load favorite offers. Please try again later.'
    );
  });

  it('should set error to null with "setError" action', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const action = setError(null);
    const result = appProcess(stateWithError, action);
    expect(result.error).toBeNull();
  });
});
