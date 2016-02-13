import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dock from 'react-dock'; // TODO find this
import { Scrollbars } from 'react-custom-scrollbars';
import {
  closeQueue, playTrackInQueue, removeTrackFromQueue
} from '../actions/player.js';
import Button from '../components/Button.js';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import Play from 'react-icons/lib/md/play-circle-outline';
import Close from 'react-icons/lib/md/highlight-off';
import cn from 'classnames';
import Hoverable from '../components/Hoverable.js';

class Track extends Component {
  constructor(props) {
    super(props);
    this.handleHoverChange = this.handleHoverChange.bind(this);

    this.state = {
      isHovered: false
    };
  }

  handleHoverChange(isHovered) {
    this.setState({ isHovered });
  }

  render() {
    const {
      id,
      title,
      isActiveTrack,
      playTrack,
      removeTrack,
    } = this.props;

    let actionStyle = this.state.isHovered
      ? { visibility: 'visible' }
      : { visibility: 'hidden' };

    return (
      <Hoverable onHoverChange={this.handleHoverChange}
        className={cn(trackStyles.row, { [trackStyles.rowActive]: isActiveTrack })}>
        <div className={trackStyles.flex}>
          <div className={trackStyles.action}>
            <Play
              onClick={() => playTrack(id)}
              style={actionStyle}
              width={20} height={20} />
          </div>
          <span className={trackStyles.title}>{title}</span>
          <div className={trackStyles.action}>
            <Close
              onClick={() => removeTrack(id)}
              style={actionStyle}
              width={20} height={20} />
          </div>
        </div>
      </Hoverable>
    )
  }
}


const trackStyles = cssInJS({
  row: {
    fontSize: 14,
    padding: '1em 10px',
    borderBottom: '1px solid #eee',
    ':first-of-type': {
      borderTop: '1px solid #eee',
    },
    ':hover': {
      cursor: 'default',
    }
  },
  rowActive: {
    color: '#0097FF',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    userSelect: 'none',
    flexGrow: 1,
    margin: '0 5px',
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  action: {
    position: 'relative',
    top: -1,
    ':hover': { cursor: 'pointer' }
  }
});


class Queue extends Component {
  render() {
    const {
      isQueueOpen, closeQueue, playQueue, activeTrackId, playTrackInQueue,
      removeTrackFromQueue,
    } = this.props;

    return (
      <Dock isVisible={isQueueOpen} position={'right'} size={400} fluid={false}>
        <Scrollbars>
          <div className={styles.headingContainer}>
            <h2 className={styles.heading}>Songs Up Next</h2>
            <Button onClick={closeQueue}>
              <ChevronRight className={styles.chevron} width={25} height={25} />
            </Button>
          </div>
          <div className={styles.playQueue}>
            {playQueue.map(track =>
              <Track key={track.id}
                     isActiveTrack={track.id === activeTrackId}
                     playTrack={playTrackInQueue}
                     removeTrack={removeTrackFromQueue}
                     {...track} />
            )}
          </div>
        </Scrollbars>
      </Dock>
    );
  }
}

const styles = cssInJS({
  headingContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    paddingLeft: 35,
    fontWeight: 200,
    color: '#333',
  },
  chevron: {
    marginRight: 28,
  },
  playQueue: {
  },
});

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
