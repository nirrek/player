import SC from 'soundcloud';

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

export const searchRequest = () => ({
  type: SEARCH_REQUEST
});

export const searchResponseFailure = (error) => ({
  type: SEARCH_RESPONSE_FAILURE,
  error
});

export const searchResponseSuccess = (tracks) => ({
  type: SEARCH_RESPONSE_SUCCESS,
  tracks
});

// -----------------------------------------------------------------------------
// Play
// -----------------------------------------------------------------------------
export const PLAY_LIST = 'PLAY_LIST';
export const PAUSE = 'PAUSE';
export const REPLACE_TRACKS = 'REPLACE_TRACKS';
export const PLAY = 'PLAY';
export const PLAYING = 'PLAYING';
export const ADD_SOUND = 'ADD_SOUND';
export const UPDATE_TIME = 'UPDATE_TIME';
export const SEEK = 'SEEK';
export const VOLUME = 'VOLUME';
export const ACTIVE_TRACK = 'ACTIVE_TRACK';
export const NEXT = 'NEXT';
export const PREV = 'PREV';
export const TOGGLE_PLAY_PAUSE = 'TOGGLE_PLAY_PAUSE';

export const playList = (startTrackId) => ({
  type: PLAY_LIST,
  startTrackId
});

export const replaceTracks = (tracks) => ({
  type: REPLACE_TRACKS,
  tracks
});

export const addSound = (trackId, sound) => ({
  type: ADD_SOUND,
  trackId,
  sound
});

export const play = (trackId) => ({
  type: PLAY,
  trackId,
});

export const playing = (trackId) => ({
  type: PLAYING,
  trackId,
});

export const updateTime = (elapsedTime) => ({
  type: UPDATE_TIME,
  elapsedTime
});

export const togglePlayPause = () => ({
  type: TOGGLE_PLAY_PAUSE
});

export const pause = () => ({
  type: PAUSE
});

export const next = () => ({
  type: NEXT
});

export const prev = () => ({
  type: PREV
});

export const seek = (toTime) => ({
  type: SEEK,
  toTime
});

export const volume = (volume) => ({
  type: VOLUME,
  volume
});
