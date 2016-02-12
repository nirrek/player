import React, { Component, PropTypes } from 'react';
import { playList } from '../actions/player.js';
import ResultsItem from './ResultsItem.js';
import Spinner from 'react-spinkit';

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
    const { results, isFetching, error } = this.context.store.getState().search;
    const { activeTrackId } = this.context.store.getState().player;

    return (
      <div style={{ padding: '7px 0', width: '100%', height: '100%' }}>
        {isFetching &&
          <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Spinner spinnerName="double-bounce" noFadeIn />
              <span style={{ color: '#869EAF', marginTop: 5 }}>Fetching results...</span>
            </div>
          </div>
        }
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
