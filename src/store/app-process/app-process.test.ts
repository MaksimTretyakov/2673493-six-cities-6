import { appProcess } from './app-process';
import { changeCity, changeSortType, setError } from '../action';
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

  it('should set error to null with "setError" action', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const action = setError(null);
    const result = appProcess(stateWithError, action);
    expect(result.error).toBeNull();
  });
});
