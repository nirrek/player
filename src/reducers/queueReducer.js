import { CLOSE_QUEUE, TOGGLE_QUEUE } from '../actions/player.js';

const initialState = {
  isQueueOpen: false,
};

export default function(state=initialState, action) {
  switch (action.type) {
    case CLOSE_QUEUE:
      return {
        isQueueOpen: false,
      };

    case TOGGLE_QUEUE:
      return {
        isQueueOpen: !state.isQueueOpen,
      };

    default:
      return state;
  }
}
