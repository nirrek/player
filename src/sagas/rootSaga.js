/* @flow */
import { call } from 'redux-saga';
import playerSagas from './playerSagas.js';
import searchSagas from './searchSagas.js';

export default function* rootSaga(getState: Function): Generator {
  yield call(searchSagas, getState);
  yield call(playerSagas, getState);
}
