import { take, put, fork, call, cancel, SagaCancellationException } from '../vendor/redux-saga/lib/index.js';

import { SEARCH_REQUEST, searchResponseFailure, searchResponseSuccess, PLAY_LIST, pause, PAUSE, replaceTracks, play, PLAY, playing, addSound, next, NEXT, PREV, updateTime, TOGGLE_PLAY_PAUSE, SEEK, VOLUME } from '../actions/player.js';

function* searchSaga(getState) {
  while (true) {
    yield take(SEARCH_REQUEST);

    try {
      const tracks = yield SC.get('/tracks', { q: getState().query }); // call()
      yield put(searchResponseSuccess(tracks));
    } catch (err) {
      yield put(searchResponseFailure(err.message));
    }
  }
}

function* playListSaga(getState) {
  while (true) {
    const { startTrackId } = yield take(PLAY_LIST);
    const { isPlaying, results } = getState();

    if (isPlaying)
      yield put(pause());

    const trackToLoad = tracksFollowing(results, startTrackId);
    yield put(replaceTracks(trackToLoad));
    yield put(play(startTrackId));
  }
}

// Seems to be a general purpose play? Intended for use when you don't know
// what you want to play?

function* playSaga(getState, dispatch) {
  let task;
  while (true) {
    const { trackId } = yield take(PLAY);

    // Cancel any currently pending _playTrack tasks.
    if (task && task.isRunning())
      yield cancel(task)

    task = yield fork(_playTrack(trackId, getState, dispatch));
  }
}

// Subroutine.
function* _playTrack(trackId, getState, dispatch) {
  console.log('_playTrack');
  console.log('trackId', trackId);

  try {
    let sound = getState().sounds[trackId];
    if (!sound) {
      sound = yield SC.stream(`/tracks/${trackId}`); // TODO call() it up
      yield put(addSound(trackId, sound));
      console.log('addedSound');
    }

    yield put(playing(trackId));
    console.log(`should be playing ${trackId}`, getState());


    const { volume } = getState();
    const handleTime = () => dispatch(updateTime(sound.currentTime()));
    const handleFinish = () => {
      sound.off('time', handleTime);
      sound.off('finish', handleFinish);
      dispatch(next());
    }
    sound.on('time', handleTime);
    sound.on('finish', handleFinish);
    sound.setVolume(volume);
    sound.play();
  } catch (err) {
    if (!(err instanceof SagaCancellationException)) console.error(err);
  }
}

function* nextSaga(getState, dispatch) {
  let task;
  while (true) {
    yield take(NEXT);

    const { activeTrackId, tracks } = getState();
    const nextTrack = nextTrackId(tracks, activeTrackId);
    if (!nextTrack) continue;

    pauseActiveTrack(getState);
    yield put(play(nextTrack));
  }
}

function* prevSaga(getState) {
  while (true) {
    yield take(PREV); // TODO - implement

    const { activeTrackId, tracks } = getState();
    const prevTrack = prevTrackId(tracks, activeTrackId);
    if (!prevTrack) return;

    pauseActiveTrack(getState);
    yield put(play(prevTrack));
  }
}

function* togglePlayPause(getState) {
  while (true) {
    yield take(TOGGLE_PLAY_PAUSE);

    const { isPlaying, activeTrackId } = getState();
    if (isPlaying) {
      yield put(pause());
      pauseActiveTrack(getState);
    }
    else {
      yield put(play(activeTrackId));
    }
  }
}

function* seekSaga(getState) {
  while (true) {
    const { toTime } = yield take(SEEK);

    const { activeTrackId, sounds } = getState();
    sounds[activeTrackId].seek(toTime);
  }
}

function* volumeSaga(getState) {
  while (true) {
    const { volume } = yield take(VOLUME);

    const { activeTrackId, sounds } = getState();
    sounds[activeTrackId].setVolume(volume);
  }
}

export default function* sagas(getState, dispatch) {
  yield fork(searchSaga(getState));
  yield fork(playListSaga(getState));
  yield fork(playSaga(getState, dispatch));
  yield fork(nextSaga(getState, dispatch));
  yield fork(prevSaga(getState));
  yield fork(togglePlayPause(getState));
  yield fork(seekSaga(getState));
  yield fork(volumeSaga(getState));
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

// tracksFollowing :: ([Track], TrackId) -> [Track]
const tracksFollowing = (tracks, trackId) => {
  const idx = tracks.findIndex(t => t.id === trackId);
  if (idx === -1) return [];
  return tracks.slice(idx);
}

// nextTrackId :: ([Track], TrackId) -> TrackId | undefined
// Produces the trackId of the track following the given TrackId. If there is
// no nextTrack, produces undefined.
const nextTrackId = (tracks, trackId) => {
  const idx = tracks.findIndex(t => t.id === trackId);
  if (idx === tracks.length - 1 || idx === -1) return undefined;
  return tracks[idx + 1].id;
}

// prevTrackId :: ([Track], TrackId) -> TrackId | undefined
const prevTrackId = (tracks, trackId) => {
  const idx = tracks.findIndex(t => t.id === trackId);
  if (idx === 0 || idx === -1) return undefined;
  return tracks[idx - 1].id;
}

const pauseActiveTrack = (getState) => {
  const { activeTrackId, sounds } = getState();
  const sound = sounds[activeTrackId];
  if (sound) sound.pause();
}
