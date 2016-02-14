/* @flow */
import { put, fork, call, SagaCancellationException } from 'redux-saga';
import soundcloud from 'soundcloud';
import {
  SEARCH_REQUEST, SEARCH_RESPONSE_FAILURE, SEARCH_RESPONSE_SUCCESS
} from '../actions/player.js';
import { takeLatest } from './sagaUtils.js';

function* search(action, getQuery) {
  try {
    const tracks = yield call(
      [soundcloud, soundcloud.get],
      '/tracks', { q: getQuery(), limit: 100 }
    );
    yield put({ type: SEARCH_RESPONSE_SUCCESS, tracks });
  } catch (error) {
    if (!(error instanceof SagaCancellationException))
      yield put({ type: SEARCH_RESPONSE_FAILURE, error: error.message });
  }
}

function* watchSearchRequest(getQuery) {
  yield* takeLatest(SEARCH_REQUEST, search, getQuery);
}

export default function* searchSagas(getState: Function): Generator {
  const getQuery = () => getState().search.query;

  yield fork(watchSearchRequest, getQuery);
}
