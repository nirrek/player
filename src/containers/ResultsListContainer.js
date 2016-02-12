import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import { playList } from '../actions/player.js';
import ResultsItem from '../components/ResultsItem.js';

class ResultsList extends Component {
  render() {
    const { results, isFetching, error, activeTrackId, playList } = this.props;

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
            handlePlay={playList}
            {...track} />
        )}
      </div>
    );
  }
}

ResultsList.contextTypes = {
  store: PropTypes.object
};

export default connect(
  (state) => ({
    results: state.search.results,
    isFetching: state.search.isFetching,
    error: state.search.error,
    activeTrackId: state.player.activeTrackId,
  }),
  {
    playList,
  }
)(ResultsList);
