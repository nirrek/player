import { UPDATE_TIME, VOLUME, PLAY_START, PLAY_INITIATED,
  SOUNDSTREAM_REQUEST, SOUNDSTREAM_RESPONSE_SUCCESS, SOUNDSTREAM_RESPONSE_FAILURE,
  TOGGLE_PLAY_PAUSE, SEEK, PLAY_TRACK_IN_RESULTS
} from '../actions/player.js';

const initialState = {
  isFetchingSound: false, // this one doesnt fit as well.
  elapsedTime: undefined,
  tracks: [],
  sounds: {},
  activeTrackId: undefined,
  isPlaying: false,
  volume: 0.8, // value in range [0,1]
}

function playerReducer(state: Object = initialState, action: Object,
  results: Array<Object>): Object {
  switch (action.type) {
    case PLAY_TRACK_IN_RESULTS:
      return {
        ...state,
        tracks: [...results],
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

    case PLAY_INITIATED:
      return {
        ...state,
        activeTrackId: action.trackId,
      };

    case PLAY_START:
      return {
        ...state,
        isPlaying: true,
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

export default playerReducer;
