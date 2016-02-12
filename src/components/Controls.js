import React, { Component, PropTypes } from 'react';
import Pause from 'react-icons/lib/md/pause';
import Play from 'react-icons/lib/md/play-arrow';
import Next from 'react-icons/lib/md/skip-next';
import Previous from 'react-icons/lib/md/skip-previous';
import Volume from 'react-icons/lib/md/volume-up';
import Playlist from 'react-icons/lib/md/playlist-play';
import Slider from './Slider.js';
import Time from './Time.js';
import Button from './Button.js';

export default class Controls extends Component {
  render() {
    const {
      activeTrack, isNextTrack, isPrevTrack, isPlaying, elapsedTime, volume,
      prev, next, togglePlayPause, seek, updateVolume
    } = this.props;

    const elapsedPercent = activeTrack
                            ? (elapsedTime / activeTrack.duration) * 100
                            : 0;

    const seeker = activeTrack ? (
      <Slider min={0} max={activeTrack.duration} value={elapsedTime}
              onSlideEnd={seek}/>
    ) : (
      <Slider />
    );

    return (
      <div style={styles.controls}>
        <div style={styles.leftColumn}>
          <Button disabled={!isPrevTrack} onClick={prev}>
            <Previous width={25} height={25}/>
          </Button>
          <Button disabled={!activeTrack} onClick={togglePlayPause}>
              {isPlaying
                ? <Pause width={40} height={40} />
                : <Play width={40} height={40} />}
          </Button>
          <Button disabled={!isNextTrack} onClick={next}>
            <Next width={25} height={25} />
          </Button>
        </div>
        <div style={styles.centerColumn}>
          {activeTrack && (
            <div style={{ display: 'flex', position: 'relative', alignItems: 'center' }}>
              <span style={styles.trackTitle}>
                {activeTrack.title}
              </span>

              <div style={{ paddingRight: '.6em' }}>
                <Time time={elapsedTime || 0} />
              </div>
              <div style={{ flexGrow: 1 }}>
                {seeker}
              </div>
              <div style={{ paddingLeft: '.6em' }}>
                <Time time={activeTrack.duration} />
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
              onSlide={updateVolume} />
          </div>
        </div>
      </div>
    );
  }
}

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
