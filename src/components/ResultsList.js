import React, { Component, PropTypes } from 'react';
import { playList } from '../actions/player.js';
import ResultsItem from './ResultsItem.js';

export default class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.handlePlay = this.handlePlay.bind(this);
  }

  componentWillMount() {
    this.context.store.subscribe(() => this.forceUpdate());
  }

  handlePlay(startTrackId) {
    const { store } = this.context;
    store.dispatch(playList(startTrackId));
  }

  render() {
    const { results, isFetching, error, activeTrackId } = this.context.store.getState();

    return (
      <div style={{ padding: '7px 0' }}>
        {isFetching && <div>Fetching results...</div>}
        {error && <div>Error: {error}</div>}

        {results.map(track =>
          <ResultsItem
            key={track.id}
            activeTrackId={activeTrackId}
            handlePlay={this.handlePlay}
            {...track} />
        )}
      </div>
    );
  }
}

ResultsList.contextTypes = {
  store: PropTypes.object
};
