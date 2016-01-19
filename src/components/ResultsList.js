import React, { Component, PropTypes } from 'react';
import { playList } from '../actions/player.js';

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
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1,
        backgroundColor: '#f0f0f0', padding: '0 5px' }}>
        {isFetching && <div>Fetching results...</div>}
        {error && <div>Error: {error}</div>}

        {results.map(track =>
          <ResultItem
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


const ResultItem = ({
  id,
  title,
  artwork_url,
  activeTrackId,
  handlePlay
}) => {
  const activeStyle = (id === activeTrackId)
    ? { backgroundColor: 'orange', height: 50 }
    : {};

  const style = {
    display: 'flex',
    flexShrink: 1,
    padding: '.5em 1em',
    margin: '1px 0 0',
    backgroundColor: '#fff',
    height: 30,
  };

  return (
    <div style={{...style, ...activeStyle}} onClick={() => handlePlay(id)}>
      <img style={{ width: 20, height: 20, borderRadius: 10 }}
         src={artwork_url} />
       <span style={{ fontSize: 14, margin: '0 .5em' }}>{title}</span>
    </div>
  );
}
