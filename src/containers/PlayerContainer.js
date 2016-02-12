import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  searchQuery, search, playList, togglePlayPause, next, prev, seek, volume
} from '../actions/player.js';
import Search from '../components/Search.js';
import ControlsContainer from './ControlsContainer.js';
import ResultsListContainer from '../containers/ResultsListContainer.js';

export default class Player extends Component {
  render() {
    const { query, search, searchQuery } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ flexShrink: 1, zIndex: 1 }}>
          <Search query={query}
            onSearch={search}
            onChange={searchQuery} />
        </div>
        <Scrollbars
          style={{ flexGrow: 1, height: 'auto', display: 'flex' }}
          renderView={({ style, ...rest}) => (
            <div style={{ ...style, height: 'auto' }} {...rest} />
          )}>
          <ResultsListContainer />
        </Scrollbars>
        <div style={{ height: 70, width: '100%',
          backgroundColor: '#efefef', flexShrink: 1 }}>
          <ControlsContainer />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ search }) => ({
    query: search.query,
  }),
  {
    search,
    searchQuery
  }
)(Player);
