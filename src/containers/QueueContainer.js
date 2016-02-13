import { connect } from 'react-redux';
import {
  closeQueue, playTrackInQueue, removeTrackFromQueue
} from '../actions/player.js';
import Queue from '../components/Queue.js';

// playQueue :: ([Track], Id) -> [Track]
const playQueue = (tracks, activeTrackId) => {
  const idx = tracks.findIndex(t => t.id === activeTrackId);
  return tracks.slice(idx + 1);
};

export default connect(
  ({ queue, player }) => ({
    isQueueOpen: queue.isQueueOpen,
    playQueue: playQueue(player.tracks, player.activeTrackId),
    activeTrackId: player.activeTrackId,
  }),
  {
    closeQueue,
    playTrackInQueue,
    removeTrackFromQueue,
  }
)(Queue);
