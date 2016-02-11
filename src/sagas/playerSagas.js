/* @flow */
import { take, put, fork, call, apply, race, SagaCancellationException, cancel } from 'redux-saga';
import {
  PLAY_TRACK_IN_RESULTS, PLAY_TRACK_IN_QUEUE, PLAY_START,
  NEXT_TRACK, PREV_TRACK, SOUNDSTREAM_REQUEST, SOUNDSTREAM_RESPONSE_SUCCESS,
  SOUNDSTREAM_RESPONSE_FAILURE, UPDATE_TIME, TOGGLE_PLAY_PAUSE, SEEK, VOLUME,
} from '../actions/player.js';
import soundcloud from 'soundcloud';
import { createChannel, CLOSED } from 'barebones-channel';

// -----------------------------------------------------------------------------
//  Helpers
// -----------------------------------------------------------------------------

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

function createTimeChannel(sound) {
  const chan = createChannel();
  const onTime = () => chan.put(sound.currentTime());
  const onFinish = () => {
    chan.close();
    sound.off('time', onTime);
    sound.off('finish', onFinish);
  }
  sound.on('time', onTime);
  sound.on('finish', onFinish);
  return chan;
}


// -----------------------------------------------------------------------------
//  Sagas
// -----------------------------------------------------------------------------
function* updateElapsedTimeOnChange(chan) {
  let elapsedTime;
  while ((elapsedTime = yield chan.take()) !== CLOSED)
    yield put({ type: UPDATE_TIME, elapsedTime })
  return true; // indicate saga completion (for use in a race)
}

function* monitorSoundProgress(sound) {
  const chan = yield call(createTimeChannel, sound);

  const { soundCompleted } = yield race({
    soundCompleted: call(updateElapsedTimeOnChange, chan),
    superceded: call(takePlayCausingAction)
  });

  if (soundCompleted)
    yield put({ type: 'NEXT_TRACK' });
}

// Plays a track
// Extracted into a generator to ensure it is an atomic transaction.
function* playSound(sound, volume, trackId) {
  // TODO this will make duplicate sagas if repeatedly play same track
  // without the track finishing. We need a way to kill the saga if one
  // of the play actions happens.

  yield fork(monitorSoundProgress, sound);
  yield call([sound, sound.setVolume], volume);
  yield call([sound, sound.play]);
  yield put({
    type: PLAY_START,
    trackId,
  });
}

// Plays the track with the specified trackId
function* playTrack(getState, trackId) {
  const { sounds, volume } = getState();
  let sound = sounds[trackId];
  try {
    if (!sound) {
      yield put({ type: SOUNDSTREAM_REQUEST });
      try {
        sound = yield call(
          [soundcloud, soundcloud.stream],
          `/tracks/${trackId}`
        );
      } catch (error) {
        // TODO figure out what to do at this juncture...
        yield put({ type: SOUNDSTREAM_RESPONSE_FAILURE, error })
      }
      yield put({ type: SOUNDSTREAM_RESPONSE_SUCCESS, sound, trackId });
    }

    // I assume once its called, it cant be cancelled by our cancellation.
    yield call(playSound, sound, volume, trackId);
  }
  catch (err) {
    if (!(err instanceof SagaCancellationException)) throw err;
  }
}

// Plays the track with the given trackId and corresponding sound object.
// If another action is dispatched that will cause a different track to be
// played, the task will automatically be cancelled.
function* playTrackTask(getState, trackId) {
  const { isPlaying, activeTrackId, sounds } = getState();

  if (isPlaying) {
    const activeSound = sounds[activeTrackId];
    yield call([activeSound, activeSound.pause]);
    // TODO if we dispatched an action here, what PERF impact is there?
    // My intuition is that it means an entire render cycle 100ms+
  }

  yield race([
    call(playTrack, getState, trackId),
    call(takePlayCausingAction),
  ]);
}

// Takes the first action that may lead to a track being played. Used for
// racing a playTrack task against this.
function* takePlayCausingAction() {
  yield race([
    take(PLAY_TRACK_IN_RESULTS),
    take(PLAY_TRACK_IN_QUEUE),
    take(NEXT_TRACK), // BUT these may NOT cause a play...
    take(PREV_TRACK), // BUT these may NOT cause a play...
  ]);
  return true; // indicate saga completion (for use in a race)
}


// -----------------------------------------------------------------------------
//  Watchers
// -----------------------------------------------------------------------------
function* watchPlayTrackInResults(getState) {
  while (true) {
    const { trackId } = yield take(PLAY_TRACK_IN_RESULTS);
    yield fork(playTrackTask, getState, trackId);
  }
}

function* watchNextTrack(getState) {
  while (true) {
    yield take(NEXT_TRACK);
    const { tracks, activeTrackId } = getState();
    yield fork(playTrackTask, getState, nextTrackId(tracks, activeTrackId));
  }
}

function* watchPrevTrack(getState) {
  while (true) {
    yield take(PREV_TRACK);
    const { tracks, activeTrackId } = getState();
    yield fork(playTrackTask, getState, prevTrackId(tracks, activeTrackId));
  }
}

function* watchTogglePlayPause(getState) {
  while (true) {
    yield take(TOGGLE_PLAY_PAUSE);
    const { isPlaying, sounds, activeTrackId } = getState();
    const sound = sounds[activeTrackId];

    // Note that we are branching on the state after the reducers have updated.
    if (isPlaying) yield apply(sound, sound.play);
    else           yield apply(sound, sound.pause);
  }
}

function* watchSeek(getState) {
  while (true) {
    const { toTime } = yield take(SEEK);
    const { activeTrackId, sounds } = getState();
    const sound = sounds[activeTrackId];
    yield call([sound, sound.seek], toTime);
  }
}

function* watchVolume(getState) {
  while (true) {
    const { volume } = yield take(VOLUME);
    const { activeTrackId, sounds } = getState();
    const sound = sounds[activeTrackId];
    if (sound)
      yield call([sound, sound.setVolume], volume);
  }
}

export default function* playerSagas(getState: Function): Generator {
  yield fork(watchPlayTrackInResults, getState);
  yield fork(watchNextTrack, getState);
  yield fork(watchPrevTrack, getState);
  yield fork(watchTogglePlayPause, getState);
  yield fork(watchSeek, getState);
  yield fork(watchVolume, getState);
}
