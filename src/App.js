import React, { Component } from 'react';
import SC from 'soundcloud';
import * as player from './player.js';

const getTrack = (tracks, trackId) =>
  tracks.find(track => track.id === trackId);

const Track = ({
  id,
  title,
  artwork_url,
  handleClick,
  currentTrack
}) => {
  const bgColor = (id === currentTrack) ? 'red' : 'white';

  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: bgColor }}
         onClick={() => handleClick(id)}>
      <img src={artwork_url}
           style={{ width: 50, borderRadius: 25 }}/>
      {title}
    </div>
  );
}

class Tracklist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      current: undefined,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    SC.get('/tracks', { q: 'ofenbach' })
      .then(tracks => {
        console.log(tracks[0]); // so we can look at the API easily
        return tracks;
      })
      .then(tracks => this.setState({ tracks }))
      .catch(err => console.log(err));
  }

  handleClick(trackId) {
    const { tracks } = this.state;
    const idx = tracks.findIndex(track => track.id === trackId);
    const playlist = tracks.slice(idx);
    player.playTracks(playlist)
      .then(this.forceUpdate());
  }

  render() {
    const { tracks } = this.state;
    const current = player.activeTrack();
    return (
      <div>
        {tracks.map(
          track => <Track key={track.id}
                          currentTrack={current && current.id}
                          handleClick={this.handleClick}
                          {...track} />
        )}
      </div>
    );
  }
}

const Controls = () => {
  return (
    <div>
      <button>prev</button>
      <button>pause</button>
      <button onClick={() => player.next()}>next</button>
    </div>
  );
}

export class App extends Component {
  render() {
    return (
      <div>
        <Controls />
        <Tracklist />
      </div>
    );
  }
}
