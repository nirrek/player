import {
  SEARCH_QUERY, SEARCH_REQUEST, SEARCH_RESPONSE_SUCCESS,
  SEARCH_RESPONSE_FAILURE
} from '../actions/player.js';

const initialState = {
  query: '',
  isFetching: false,
  hasFetched: false,
  error: '',
  results: [],
};

function searchReducer(state: Object = initialState, action: Object): Object {
  switch (action.type)  {
    case SEARCH_QUERY:
      return {
        ...state,
        query: action.query
      };

    case SEARCH_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasFetched: true,
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

    default:
      return state;
  }
}

export default searchReducer;
