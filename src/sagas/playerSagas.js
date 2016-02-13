/* @flow */
import { take, put, fork, call, apply, race, SagaCancellationException, cancel } from 'redux-saga';
import {
  PLAY_TRACK_IN_RESULTS, PLAY_TRACK_IN_QUEUE, PLAY_START, PLAY_INITIATED,
  NEXT_TRACK, PREV_TRACK, SOUNDSTREAM_REQUEST, SOUNDSTREAM_RESPONSE_SUCCESS,
  SOUNDSTREAM_RESPONSE_FAILURE, UPDATE_TIME, TOGGLE_PLAY_PAUSE, SEEK, VOLUME,
} from '../actions/player.js';
import soundcloud from 'soundcloud';
import { createChannel, CLOSED } from 'barebones-channel';
import { takeLatest } from './sagaUtils.js';

// -----------------------------------------------------------------------------
//  Helpers
// -----------------------------------------------------------------------------

// nextTrackId :: ([Track], TrackId) -> TrackId | undefined
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
  yield fork(monitorSoundProgress, sound);
  yield call([sound, sound.setVolume], volume);
  yield call([sound, sound.play]);
  yield put({ type: PLAY_START, trackId });
}

// Plays the track with the specified trackId
function* playTrack(getPlayer, trackId) {
  yield put({ type: PLAY_INITIATED, trackId });
  const { sounds, volume } = getPlayer();
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
function* playTrackTask(getPlayer, trackId) {
  const { isPlaying, activeTrackId, sounds } = getPlayer();
  let activeSound = sounds[activeTrackId]

  if (isPlaying && activeSound) {
    // isPlaying state maintained on next/prevTrack, but sound can be unloaded
    yield call([activeSound, activeSound.pause]);
  }

  yield race([
    call(playTrack, getPlayer, trackId),
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


function* playTrackInResults({ trackId }, getPlayer) {
  yield fork(playTrackTask, getPlayer, trackId);
}

function* playTrackInQueue({ trackId }, getPlayer) {
  yield fork(playTrackTask, getPlayer, trackId);
}

function* togglePlayPause(action, getPlayer) {
  const { isPlaying, sounds, activeTrackId } = getPlayer();
  const sound = sounds[activeTrackId];

  // Note that we are branching on the state after the reducers have updated.
  if (isPlaying) yield apply(sound, sound.play);
  else           yield apply(sound, sound.pause);
}

function* playNextTrack(action, getPlayer) {
  const { tracks, activeTrackId } = getPlayer();
  yield fork(playTrackTask, getPlayer, nextTrackId(tracks, activeTrackId));
}

function* playPrevTrack(action, getPlayer) {
  const { tracks, activeTrackId } = getPlayer();
  yield fork(playTrackTask, getPlayer, prevTrackId(tracks, activeTrackId));
}

function* changeVolume({ volume }, getActiveSound) {
  const sound = getActiveSound();
  if (sound) yield call([sound, sound.setVolume], volume);
}

function* seekSoundTo({ toTime }, getActiveSound) {
  const sound = getActiveSound();
  yield call([sound, sound.seek], toTime);
}

// -----------------------------------------------------------------------------
//  Watchers
// -----------------------------------------------------------------------------
function* watchPlayTrackInResults(getPlayer) {
  yield* takeLatest(PLAY_TRACK_IN_RESULTS, playTrackInResults, getPlayer);
}

function* watchPlayTrackInQueue(getPlayer) {
  yield* takeLatest(PLAY_TRACK_IN_QUEUE, playTrackInQueue, getPlayer);
}

function* watchNextTrack(getPlayer) {
  yield* takeLatest(NEXT_TRACK, playNextTrack, getPlayer);
}

function* watchPrevTrack(getPlayer) {
  yield* takeLatest(PREV_TRACK, playPrevTrack, getPlayer);
}

function* watchTogglePlayPause(getPlayer) {
  yield* takeLatest(TOGGLE_PLAY_PAUSE, togglePlayPause, getPlayer)
}

function* watchSeek(getActiveSound) {
  yield* takeLatest(SEEK, seekSoundTo, getActiveSound);
}

function* watchVolume(getActiveSound) {
  yield* takeLatest(VOLUME, changeVolume, getActiveSound);
}

export default function* playerSagas(getState: Function): Generator {
  const getActiveSound = () => {
    const { activeTrackId, sounds } = getState().player;
    return sounds[activeTrackId];
  }
  const getPlayer = () => getState().player;

  yield fork(watchPlayTrackInResults, getPlayer);
  yield fork(watchPlayTrackInQueue, getPlayer);
  yield fork(watchNextTrack, getPlayer);
  yield fork(watchPrevTrack, getPlayer);
  yield fork(watchTogglePlayPause, getPlayer);
  yield fork(watchSeek, getActiveSound);
  yield fork(watchVolume, getActiveSound);
}
