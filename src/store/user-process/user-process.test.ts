import { userProcess } from './user-process';
import { requireAuthorization } from '../action';
import { checkAuthAction, loginAction, logoutAction } from '../api-actions';
import { AuthorizationStatus } from '../../consts';
import { makeFakeUserData } from '../../utils/mocks';

describe('UserProcess Reducer', () => {
  const initialState = {
    authorizationStatus: AuthorizationStatus.Unknown,
    user: null,
  };

  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const result = userProcess(initialState, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should set authorization status with "requireAuthorization" action', () => {
    const status = AuthorizationStatus.Auth;
    const action = requireAuthorization(status);
    const result = userProcess(initialState, action);
    expect(result.authorizationStatus).toBe(status);
  });

  describe('checkAuthAction', () => {
    it('should set Auth status and user data on fulfilled', () => {
      const userData = makeFakeUserData();
      const action = {
        type: checkAuthAction.fulfilled.type,
        payload: userData,
      };
      const result = userProcess(initialState, action);
      expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(result.user).toEqual(userData);
    });

    it('should set NoAuth status on rejected', () => {
      const action = { type: checkAuthAction.rejected.type };
      const result = userProcess(initialState, action);
      expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(result.user).toBeNull();
    });
  });

  describe('loginAction', () => {
    it('should set Auth status and user data on fulfilled', () => {
      const userData = makeFakeUserData();
      const action = { type: loginAction.fulfilled.type, payload: userData };
      const result = userProcess(initialState, action);
      expect(result.authorizationStatus).toBe(AuthorizationStatus.Auth);
      expect(result.user).toEqual(userData);
    });

    it('should set NoAuth status on rejected', () => {
      const action = { type: loginAction.rejected.type };
      const result = userProcess(initialState, action);
      expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(result.user).toBeNull();
    });
  });

  describe('logoutAction', () => {
    it('should set NoAuth status and clear user data on fulfilled', () => {
      const stateWithUser = {
        authorizationStatus: AuthorizationStatus.Auth,
        user: makeFakeUserData(),
      };
      const action = { type: logoutAction.fulfilled.type };
      const result = userProcess(stateWithUser, action);
      expect(result.authorizationStatus).toBe(AuthorizationStatus.NoAuth);
      expect(result.user).toBeNull();
    });
  });
});
