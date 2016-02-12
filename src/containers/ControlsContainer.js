import { connect } from 'react-redux';
import Controls from '../components/Controls.js';
import {
  prev, next, togglePlayPause, seek, volume
} from '../actions/player.js';

const hasNextTrack = (tracks, trackId) => {
  const idx = tracks.findIndex(t => t.id === trackId);
  if (idx === -1 || idx === tracks.length - 1) return false;
  return true;
};

const hasPrevTrack = (tracks, trackId) => {
  const idx = tracks.findIndex(t => t.id === trackId);
  if (idx === -1 || idx === 0) return false;
  return true;
};

const activeTrack =
  (tracks, activeTrackId) => tracks.find(t => t.id === activeTrackId);

export default connect(
  ({ player: { tracks, activeTrackId, isPlaying, elapsedTime, volume } }) => ({
    activeTrack: activeTrack(tracks, activeTrackId),
    isNextTrack: hasNextTrack(tracks, activeTrackId),
    isPrevTrack: hasPrevTrack(tracks, activeTrackId),
    isPlaying,
    elapsedTime,
    volume,
  }),
  {
    prev,
    next,
    togglePlayPause,
    seek,
    updateVolume: volume, // avoid name clash with volume data prop
  }
)(Controls);
