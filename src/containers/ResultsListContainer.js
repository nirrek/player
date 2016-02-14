import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import cn from 'classnames';
import { playList } from '../actions/player.js';
import ResultsItem from '../components/ResultsItem.js';

class ResultsList extends Component {
  render() {
    const {
      results, query, isFetching, hasFetched, error, activeTrackId, playList,
    } = this.props;

    let notification;
    if (error) {
      notification = { type: 'error', content: `Error: ${error}` };
    }
    else if (isFetching) {
      notification = {
        type: 'isFetching',
        content: (
          <div className={styles.notificationInner}>
            <Spinner spinnerName="double-bounce" noFadeIn />
            <span className={styles.loadingText}>Fetching results...</span>
          </div>
        ),
      }
    }
    else if (hasFetched && !isFetching && !results.length) {
      notification = { type: 'noResults', content: 'No results found.' };
    }

    return (
      <div className={styles.resultsList}>
        {notification &&
          <div className={cn(
              styles.notificationOuter,
              { [styles.error]: notification.type === 'error' }
            )}>
            {notification.content}
          </div>
        }

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

const styles = cssInJS({
  resultsList: {
    padding: '7px 0',
    width: '100%',
    height: '100%',
  },
  notificationOuter: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loadingText: {
    color: '#869EAF',
    marginTop: 5 ,
  },
  notification: {

  }
});

export default connect(
  (state) => ({
    results: state.search.results,
    query: state.search.query,
    isFetching: state.search.isFetching,
    hasFetched: state.search.hasFetched,
    error: state.search.error,
    activeTrackId: state.player.activeTrackId,
  }),
  {
    playList,
  }
)(ResultsList);
