import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  searchQuery, search, playList, togglePlayPause, next, prev, seek, volume
} from '../actions/player.js';
import Search from '../components/Search.js';
import ControlsContainer from './ControlsContainer.js';
import ResultsListContainer from '../containers/ResultsListContainer.js';
import QueueContainer from '../containers/QueueContainer.js';

export default class Player extends Component {
  render() {
    const { query, search, searchQuery } = this.props;
    return (
      <div className={styles.playerContainer}>
        <div className={styles.searchContainer}>
          <Search query={query}
                  onSearch={search}
                  onChange={searchQuery} />
        </div>
        <Scrollbars
          className={styles.scrollbars}
          renderView={({ style, ...rest}) => (
            <div style={{ ...style, height: 'auto' }} {...rest} />
          )}>
          <ResultsListContainer />
        </Scrollbars>
        <div className={styles.controlsContainer}>
          <ControlsContainer />
        </div>
        <QueueContainer />
      </div>
    );
  }
}

const styles = cssInJS({
  playerContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  searchContainer: {
    flexShrink: 1,
    zIndex: 1,
  },
  scrollbars: {
    flexGrow: 1,
    height: 'auto',
    display: 'flex',
  },
  controlsContainer: {
    height: 70,
    width: '100%',
    backgroundColor: '#efefef',
    flexShrink: 1,
  },
});

export default connect(
  ({ search }) => ({
    query: search.query,
  }),
  {
    search,
    searchQuery
  }
)(Player);
