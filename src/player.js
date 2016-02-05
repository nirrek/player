/* @flow */
import SC from 'soundcloud';

// All this stateful stuff needs to be in a store.
// Mutative actions are in thunks
// Some of these that compute things for a given view are

// tracks :: [Track]
// Track objects. Metadata about track, returned by Soundcloud.
let tracks = [];

// sounds :: { Id: Sound }
// Sound objects that stream audio.
let sounds = {};

// activeTrackId :: Id
let activeTrackId;

// isPlaying :: Bool
// Is the active track currently playing?
let isPlaying = false;

// activeTrack :: undefined -> Track
export const activeTrack = () =>
  tracks.find(track => track.id === activeTrackId);

// isTrackPlaying :: undefined -> Bool
// Is there an active track currently playing?
export const isTrackPlaying = () => isPlaying;

// play :: Id -> Promise
// plays a sound (fetching remotely if required), returns a promise that
// resolves once the track is playing.
const play = (trackId, options = { fromStart: true }) => {
  const sound = sounds[trackId];
  if (sound) {
    if (options.fromStart) sound.seek(0);
    sound.play();
    return Promise.resolve();
  }

  return SC.stream(`/tracks/${trackId}`)
    .then(player => {
      sounds[trackId] = player
      sounds[trackId].play();
    })
    .catch(err => console.log(err));
};

// playTracks :: [Tracks] -> Promise
// Given a list of tracks, begins playback of the entire list. Produces a
// promise once playng has begun.
export const playTracks = (tracklist) => {
  pause();

  // TODO need to wipe corresponding sounds? memory leak...
  tracks = tracklist;
  activeTrackId = tracks[0].id; // start playing from the first track.
  return play(activeTrackId);
}

// pause :: undefined -> undefined
// pauses the current active track, if there is one, and its playing.
const pause = () => {
  if (activeTrackId && isPlaying)
    sounds[activeTrackId].pause();
}

// playOrPause :: undefined -> Promise.
// If the currently active track is playing, pauses it, otherwise plays it.
// Produces a promise that resolves once the action has been performed.
export const playOrPause = () => {
  if (!activeTrackId) return;
  if (isPlaying) {
    isPlaying = false;
    sounds[activeTrackId].pause();
    return Promise.resolve();
  } else {
    isPlaying = true;
    return play(activeTrackId);
  }
}

// next :: undefined -> Promise
// plays the next track in the tracklist (if one exists). Produces a promise
// that resolves once the next track is playing.
export const next = () => {
  pause();
  const nextTrack = nextTrack(tracks, activeTrackId);
  if (!nextTrack)
    return Promise.reject('No next track');
  activeTrackId = nextTrack.id;
  return play(activeTrackId);
}

// nextTrack :: ([Track], Id) -> Track | null
// Produces the subsequent track to the track with the specified ID, in the
// provided list. If there is no subsequent track, produces null.
const nextTrack = (tracks, trackId) => {
  const idx = tracks.findIndex((t) => t.id === trackId);
  if (idx === tracks.length || idx === -1) return null;
  return tracks[idx + 1];
}
