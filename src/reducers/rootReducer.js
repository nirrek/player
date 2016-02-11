import { SEARCH_QUERY, SEARCH_REQUEST, SEARCH_RESPONSE_SUCCESS,
  SEARCH_RESPONSE_FAILURE, UPDATE_TIME, VOLUME,
  PLAY_TRACK_IN_RESULTS, PLAY_START,
  SOUNDSTREAM_REQUEST, SOUNDSTREAM_RESPONSE_SUCCESS, SOUNDSTREAM_RESPONSE_FAILURE,
  TOGGLE_PLAY_PAUSE, SEEK
} from '../actions/player.js';

const initialState = {
  // Search-related fields.
  query: '',
  isFetching: false,
  error: '',
  results: [],

  // Player-related fields.
  isFetchingSound: false, // this one doesnt fit as well.
  tracks: [],
  sounds: {},
  activeTrackId: undefined,
  isPlaying: false,
  elapsedTime: undefined,
  volume: 0.8, // value in range [0,1]
};

const rootReducer = (state: Object = initialState, action: Object): Object => {
  console.log('ROOT_REDUCER', action.type);

  switch (action.type) {

    // -----------------------------------------------------------------------------
    // SEARCH TODO make own reducer slice.
    // -----------------------------------------------------------------------------
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
        results: [],
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


    // -----------------------------------------------------------------------------
    // PLAYER TODO make own reducer slice i think.
    // -----------------------------------------------------------------------------
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

    case PLAY_TRACK_IN_RESULTS:
      return {
        ...state,
        tracks: [...state.results],
      };

    case SOUNDSTREAM_REQUEST:
      return {
        ...state,
        isFetchingSound: true,
      };

    case SOUNDSTREAM_RESPONSE_SUCCESS:
      return {
        ...state,
        isFetchingSound: false,
        sounds: {
          ...state.sounds,
          [action.trackId]: action.sound,
        },
      };

    case SOUNDSTREAM_RESPONSE_FAILURE:
      return {
        ...state,
        isFetchingSound: false
      };

    case PLAY_START:
      return {
        ...state,
        isPlaying: true,
        activeTrackId: action.trackId,
      };

    case TOGGLE_PLAY_PAUSE:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };

    case SEEK:
      return {
        ...state,
        elapsedTime: action.toTime,
      };

    default:
      return state;
  }
}

export default rootReducer;
