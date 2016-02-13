import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dock from 'react-dock'; // TODO find this
import { Scrollbars } from 'react-custom-scrollbars';
import { closeQueue, playTrackInQueue } from '../actions/player.js';
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
      onClick,
    } = this.props;

    let actionStyle = this.state.isHovered
      ? { visibility: 'visible' }
      : { visibility: 'hidden' };

    return (
      <Hoverable onHoverChange={this.handleHoverChange}>
        <div
          className={cn(trackStyles.row, { [trackStyles.rowActive]: isActiveTrack })}>
          <span className={trackStyles.actionCapsule}>
            <Play
              onClick={() => onClick(id)}
              style={actionStyle}
              width={20} height={20} />
          </span>
          <span className={trackStyles.title}>{title}</span>
          <span className={trackStyles.actionCapsule}>
            <Close
              style={actionStyle}
              width={20} height={20} />
          </span>
        </div>
      </Hoverable>
    )
  }
}


const trackStyles = cssInJS({
  row: {
    fontSize: 14,
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: '1em',
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
  title: {
    userSelect: 'none',
  },
  actionCapsule: {
    ':hover': { cursor: 'pointer' }
  }
});


class Queue extends Component {
  render() {
    const {
      isQueueOpen, closeQueue, playQueue, activeTrackId, playTrackInQueue
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
                     onClick={playTrackInQueue}
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
    padding: '0 1em',
    fontWeight: 200,
    color: '#333',
  },
  chevron: {
    marginRight: 16,
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
  }
)(Queue);
