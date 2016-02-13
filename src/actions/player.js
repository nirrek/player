/* @flow */

// -----------------------------------------------------------------------------
// SEARCH
// -----------------------------------------------------------------------------
export const SEARCH_QUERY = 'SEARCH_QUERY';
export const SEARCH_REQUEST = 'SEARCH_REQUEST';
export const SEARCH_RESPONSE_SUCCESS = 'SEARCH_RESPONSE_SUCCESS';
export const SEARCH_RESPONSE_FAILURE = 'SEARCH_RESPONSE_FAILURE';

export const searchQuery = (query: String): Object => ({
  type: SEARCH_QUERY,
  query,
});

export const search = (): Object => ({
  type: SEARCH_REQUEST
});

// -----------------------------------------------------------------------------
// Queue
// -----------------------------------------------------------------------------
export const CLOSE_QUEUE = 'CLOSE_QUEUE';
export const TOGGLE_QUEUE = 'TOGGLE_QUEUE';
export const REMOVE_TRACK_FROM_QUEUE = 'REMOVE_TRACK_FROM_QUEUE';

export const closeQueue = (): Object => ({
  type: CLOSE_QUEUE,
});

export const toggleQueue = (): Object => ({
  type: TOGGLE_QUEUE,
});

export const removeTrackFromQueue = (trackId: Number): Object => ({
  type: REMOVE_TRACK_FROM_QUEUE,
  trackId,
});

// -----------------------------------------------------------------------------
// Play
// -----------------------------------------------------------------------------

export const PLAY_TRACK_IN_RESULTS = 'PLAY_TRACK_IN_RESULTS';
export const PLAY_TRACK_IN_QUEUE = 'PLAY_TRACK_IN_QUEUE';
export const PLAY_START = 'PLAY_START';
export const PLAY_INITIATED = 'PLAY_INITIATED';
export const NEXT_TRACK = 'NEXT_TRACK';
export const PREV_TRACK = 'PREV_TRACK';
export const TOGGLE_PLAY_PAUSE = 'TOGGLE_PLAY_PAUSE';
export const SOUNDSTREAM_REQUEST = 'SOUNDSTREAM_REQUEST';
export const SOUNDSTREAM_RESPONSE_SUCCESS = 'SOUNDSTREAM_RESPONSE_SUCCESS';
export const SOUNDSTREAM_RESPONSE_FAILURE = 'SOUNDSTREAM_RESPONSE_FAILURE';
export const UPDATE_TIME = 'UPDATE_TIME';
export const SEEK = 'SEEK';
export const VOLUME = 'VOLUME';

export const playList = (startTrackId: number): Object => ({
  type: PLAY_TRACK_IN_RESULTS,
  trackId: startTrackId,
})

export const playTrackInQueue = (startTrackId: number): Object => ({
  type: PLAY_TRACK_IN_QUEUE,
  trackId: startTrackId,
});

export const togglePlayPause = (): Object => ({
  type: TOGGLE_PLAY_PAUSE
});

export const next = (): Object => ({
  type: NEXT_TRACK
});

export const prev = (): Object => ({
  type: PREV_TRACK
});

export const seek = (toTime: Number): Object => ({
  type: SEEK,
  toTime
});

export const volume = (newVolume: Number): Object => ({
  type: VOLUME,
  volume: newVolume
});
