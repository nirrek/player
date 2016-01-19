import React, { Component, PropTypes } from 'react';
import { searchQuery, search, playList, togglePlayPause,
  next, prev, seek, volume } from '../actions/player.js';
import Search from './Search.js';
import Controls from './Controls/Controls.js';
import ResultsList from './ResultsList.js';

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
  }

  componentWillMount() {
    this.context.store.subscribe(() => this.forceUpdate());
  }

  handleQueryChange(query) {
    const { store } = this.context;
    store.dispatch(searchQuery(query));
  }

  handleSearch() {
    const { store } = this.context;
    store.dispatch(search());
  }

  render() {
    const { store } = this.context;
    const { query, isFetching, error, results, activeTrackId } = store.getState();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ flexShrink: 1 }}>
          <Search query={query}
            onSearch={this.handleSearch}
            onChange={this.handleQueryChange} />
        </div>
        <div style={{ display: 'flex', flexGrow: 1, overflow: 'scroll' }}>
          <ResultsList />
        </div>
        <div style={{ height: 70, width: '100%',
          backgroundColor: '#efefef', flexShrink: 1 }}>
          <Controls />
        </div>
      </div>
    );
  }
}

Player.contextTypes = {
  store: PropTypes.object
};
