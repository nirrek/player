import Soundcloud from 'soundcloud';
// ACTIONS - player

// -----------------------------------------------------------------------------
// SEARCH
// -----------------------------------------------------------------------------
export const SEARCH_QUERY = 'SEARCH_QUERY';
export const SEARCH_REQUEST = 'SEARCH_REQUEST';
export const SEARCH_RESPONSE_SUCCESS = 'SEARCH_RESPONSE_SUCCESS';
export const SEARCH_RESPONSE_FAILURE = 'SEARCH_RESPONSE_FAILURE';

export const searchQuery = (query) => ({
  type: SEARCH_QUERY,
  query,
});

const searchRequest = () => ({
  type: SEARCH_REQUEST
});

const searchResponseFailure = (error) => ({
  type: SEARCH_RESPONSE_FAILURE,
  error
});

const searchResponseSuccess = (tracks) => ({
  type: SEARCH_RESPONSE_SUCCESS,
  tracks
});

export const search = () =>
  (dispatch, getState) => {
    const { query } = getState();
    dispatch(searchRequest());

    return Soundcloud.get('/tracks', { q: query })
      .then(tracks => {
        dispatch(searchResponseSuccess(tracks))
      })
      .catch(err => dispatch(searchResponseFailure(err.message)));
  };


// -----------------------------------------------------------------------------
// Play
// -----------------------------------------------------------------------------
export const PLAY_LIST = 'PLAY_LIST';
export const PAUSE = 'PAUSE';
export const REPLACE_TRACKS = 'REPLACE_TRACKS';
export const PLAY = 'PLAY';
export const ADD_SOUND = 'ADD_SOUND';
export const UPDATE_TIME = 'UPDATE_TIME';
export const SEEK = 'SEEK';
export const VOLUME = 'VOLUME';
export const ACTIVE_TRACK = 'ACTIVE_TRACK';

export const playList = (startTrackId) =>
  (dispatch, getState) => {
    const { isPlaying, results } = getState();

    if (isPlaying)
      dispatch(pause()); // synchronous. I dont like treating async/sync differently...

    const tracksToLoad = tracksFollowing(results, startTrackId);
    dispatch(replaceTracks(tracksToLoad));
    dispatch(play(startTrackId));
  }

const replaceTracks = (tracks) => ({
  type: REPLACE_TRACKS,
  tracks
});



const addSound = (trackId, sound) => ({
  type: ADD_SOUND,
  trackId,
  sound
});

const activeTrack = (trackId) => ({
  type: ACTIVE_TRACK,
  trackId
});

const _play = (trackId) => ({
  type: PLAY,
  trackId,
});

// play :: Id -> Promise
// Play the particular track. Precondition: no current track is playing.
const play = (trackId) =>
  (dispatch, getState) => {
    const { sounds } = getState();
    dispatch(activeTrack(trackId)); // Update active track prior to playback.

    // Check if track sounds is in the cache.
    // TODO could simplify by removing the cache. always load from network..
    const sound = sounds[trackId];
    if (sound) {
      dispatch(playSound(trackId, sound));
      return Promise.resolve();
    }

    return Soundcloud.stream(`/tracks/${trackId}`)
      .then(sound => {
        dispatch(addSound(trackId, sound));
        return sound;
      })
      .then(sound => (trackId === getState().activeTrackId)
                       ? sound
                       : Promise.reject('Non-latest play request resolved'))
      .then (sound => dispatch(playSound(trackId, sound)))
      .catch(err => console.log(err));
  };

// Plays the given sound. Sets up and tears down appropriate event handlers
// for the sound, dispatching relevant events.
const playSound = (trackId, sound) =>
  (dispatch, getState) => {
    const { volume } = getState();

    const onTime = () => {
      dispatch(updateTime(sound.currentTime()));
    }
    const onFinish = () => {
      sound.off('time', onTime);
      sound.off('finish', onFinish);
      dispatch(next());
    }
    sound.on('time', onTime);
    sound.on('finish', onFinish);
    sound.setVolume(volume);
    sound.play();
    dispatch(_play(trackId));
}

const updateTime = (elapsedTime) => ({
  type: UPDATE_TIME,
  elapsedTime
});

// Toggles the activeTrack between play/pause states.
export const togglePlayPause = () =>
  (dispatch, getState) => {
    const { isPlaying, activeTrackId } = getState();
    if (isPlaying) dispatch(pause());
    else           dispatch(play(activeTrackId))
  };

const _pause = () => ({
  type: PAUSE,
});

const pause = () =>
  (dispatch, getState) => {
    const { isPlaying, activeTrackId, sounds } = getState();
    const sound = sounds[activeTrackId];
    if (!isPlaying || !sound) return;
    sound.pause();
    dispatch(_pause());
  };

export const next = () =>
  (dispatch, getState) => {
    const { activeTrackId, tracks } = getState();
    const nextTrack = nextTrackId(tracks, activeTrackId);
    if (!nextTrack) return;
    dispatch(pause());
    dispatch(play(nextTrack));
  }

export const prev = () =>
  (dispatch, getState) => {
    const { activeTrackId, tracks } = getState();
    const prevTrack = prevTrackId(tracks, activeTrackId);
    if (!prevTrack) return;
    dispatch(pause());
    dispatch(play(prevTrack));
  };

export const seek = (toTime) =>
  (dispatch, getState) => {
    const { activeTrackId, sounds } = getState();
    sounds[activeTrackId].seek(toTime);
    // TODO check if the seek, will cause a firing of the 'time event' which
    // we will already be responding to. Probs only ms delay even if it dont.
    // dispatch(updateTime(toTime));
  }

const _volume = (volume) => ({
  type: VOLUME,
  volume
});

export const volume = (newVolume) =>
  (dispatch, getStack) => {
    const { activeTrackId, sounds } = getState();
    sounds[activeTrackId].setVolume(newVolume);
    dispatch(_volume(newVolume));
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
