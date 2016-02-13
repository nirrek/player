import searchReducer from './searchReducer.js';
import playerReducer from './playerReducer.js';
import queueReducer from './queueReducer.js';

export default function(state={}, action) {
  // This allows sharing part of the search state in multiple subtrees.
  const search = searchReducer(state.search, action);

  return {
    search,
    player: playerReducer(state.player, action, search.results),
    queue: queueReducer(state.queue, action),
  };
}
