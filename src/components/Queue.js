import React, { Component } from 'react';
import Dock from 'react-dock';
import { Scrollbars } from 'react-custom-scrollbars';
import Button from '../components/Button.js';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import QueueTrack from './QueueTrack.js';

export default class Queue extends Component {
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
              <QueueTrack key={track.id}
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
