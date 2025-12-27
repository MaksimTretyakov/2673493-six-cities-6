import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from './const';
import { appProcess } from './app-process/app-process';
import { dataProcess } from './data-process/data-process';
import { userProcess } from './user-process/user-process';

export const rootReducer = combineReducers({
  [NameSpace.App]: appProcess,
  [NameSpace.Data]: dataProcess,
  [NameSpace.User]: userProcess,
});
