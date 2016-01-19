import React, { Component, PropTypes } from 'react';
import Slider from './Slider.js';
import { prev, next, togglePlayPause, seek, volume } from '../../actions/player.js';
import Pause from 'react-icons/lib/md/pause';
import Play from 'react-icons/lib/md/play-arrow';
import Next from 'react-icons/lib/md/skip-next';
import Previous from 'react-icons/lib/md/skip-previous';
import Volume from 'react-icons/lib/md/volume-up';
import Playlist from 'react-icons/lib/md/playlist-play';
import Time from './Time.js';
import Button from '../Button.js';

// hasNextTrack :: ([Track], Id) -> Bool
// Determines if the track with the given id has a next track in the tracks list
const hasNextTrack = (tracks, trackId) => {
  const idx = tracks.findIndex(t => t.id === trackId);
  if (idx === -1 || idx === tracks.length - 1) return false;
  return true;
};

// hasPrevTrack :: ([Track], Id) -> Bool
// Determines if the track with the given id has a previous track in the tracks list
const hasPrevTrack = (tracks, trackId) => {
  const idx = tracks.findIndex(t => t.id === trackId);
  if (idx === -1 || idx === 0) return false;
  return true;
};

export default class Controls extends Component {
  constructor(props) {
    super(props);
    this.prev = this.prev.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.next = this.next.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
  }

  componentWillMount() {
    this.context.store.subscribe(() => this.forceUpdate());
  }

  prev() {
    this.context.store.dispatch(prev());
  }

  next() {
    this.context.store.dispatch(next());
  }

  togglePlay() {
    this.context.store.dispatch(togglePlayPause());
  }

  handleSeek(value) {
    this.context.store.dispatch(seek(value));
  }

  handleVolumeChange(value) {
    this.context.store.dispatch(volume(value));
  }

  render() {
    const { store } = this.context;
    const { isPlaying, activeTrackId, tracks, elapsedTime, volume } = store.getState();
    const track = tracks.find(t => t.id === activeTrackId);
    const doDisablePlay = !activeTrackId;
    const doDisablePrev = !hasPrevTrack(tracks, activeTrackId);
    const doDisableNext = !hasNextTrack(tracks, activeTrackId);

    const elapsedPercent = track ? (elapsedTime / track.duration) * 100
                                 : 0;
    // console.log(track);

    const seeker = track ? (
      <Slider min={0} max={track.duration} value={elapsedTime}
              onSlideEnd={this.handleSeek}/>
    ) : (
      <Slider />
    );

    return (
      <div style={styles.controls}>
        <div style={styles.leftColumn}>
          <Button disabled={doDisablePrev} onClick={this.prev}>
            <Previous width={25} height={25}/>
          </Button>
          <Button disabled={doDisablePlay} onClick={this.togglePlay}>
              {isPlaying
                ? <Pause width={40} height={40} />
                : <Play width={40} height={40} />}
          </Button>
          <Button disabled={doDisableNext} onClick={this.next}>
            <Next width={25} height={25} />
          </Button>
        </div>
        <div style={styles.centerColumn}>
          {activeTrackId && (
            <div style={{ display: 'flex', position: 'relative', alignItems: 'center' }}>
              <span style={styles.trackTitle}>
                {track.title}
              </span>

              <div style={{ paddingRight: '.6em' }}>
                <Time time={elapsedTime || 0} />
              </div>
              <div style={{ flexGrow: 1 }}>
                {seeker}
              </div>
              <div style={{ paddingLeft: '.6em' }}>
                <Time time={track.duration} />
              </div>
            </div>
          )}
        </div>
        <div style={styles.rightColumn}>
          <Playlist width={25} height={25} style={{ marginRight: 15 }} />
          <div style={{ display: 'flex', width: 100 }}>
            <Volume width={18} height={18}
              style={{ position: 'relative', top: 1, marginRight: 3 }} />
            <Slider value={volume} min={0} max={1}
              onSlide={(value) => this.handleVolumeChange(value)} />
          </div>
        </div>
      </div>
    );
  }
}

Controls.contextTypes = {
  store: PropTypes.object
};

const styles = {
  controls: {
    display: 'flex',
    height: '100%'
  },
  trackTitle: {
    position: 'absolute',
    top: -8,
    width: '100%',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: 11,
    lineHeight: 1
  },
  leftColumn: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
  },
  centerColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center'
  },
  rightColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px'
  }
};
