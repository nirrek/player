import { SEARCH_QUERY, SEARCH_REQUEST, SEARCH_RESPONSE_SUCCESS,
  SEARCH_RESPONSE_FAILURE, PLAY_LIST, PAUSE, REPLACE_TRACKS,
  PLAY, ADD_SOUND, UPDATE_TIME, VOLUME, ACTIVE_TRACK } from '../actions/player.js';

const initialState = {
  query: '',
  isFetching: false,
  error: '',
  results: [],
  tracks: [],
  sounds: {},
  activeTrackId: undefined,
  isPlaying: false,
  elapsedTime: undefined,
  volume: 0.8, // value in range [0,1]
};

const rootReducer = (state = initialState, action) => {
  console.log('ROOT_REDUCER', action.type);

  switch (action.type) {
    case SEARCH_QUERY:
      return {
        ...state,
        query: action.query
      };

    case SEARCH_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: '',
      };

    case SEARCH_RESPONSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };

    case SEARCH_RESPONSE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        results: action.tracks
      };

    case PAUSE:
      return {
        ...state,
        isPlaying: false,
      };

    case ACTIVE_TRACK:
      return {
        ...state,
        activeTrackId: action.trackId
      };

    case PLAY:
      return {
        ...state,
        isPlaying: true,
      };

    case REPLACE_TRACKS:
      return {
        ...state,
        tracks: action.tracks,
      };

    case ADD_SOUND:
      return {
        ...state,
        sounds: {
          ...state.sounds,
          [action.trackId]: action.sound
        }
      };

    case UPDATE_TIME:
      return {
        ...state,
        elapsedTime: action.elapsedTime
      };

    case VOLUME:
      return {
        ...state,
        volume: action.volume
      };

    default:
      return state;
  }
}

export default rootReducer;
