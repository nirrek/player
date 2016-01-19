import React from 'react';
import { padStart } from 'lodash';

// toMinutesAndSeconds :: Number -> String
// Converts a time in milliseconds to a string of the form `mm:ss`.
const toMinutesAndSeconds = (ms) => {
  const minutes = Math.floor((ms / 1000) / 60);
  const seconds = Math.round((ms / 1000) % 60);
  const secondsStr = padStart('' + seconds, 2, '0');
  return `${minutes}:${secondsStr}`;
}

export default ({ time }) => (
  <div style={{ fontSize: 12 }}>
    {toMinutesAndSeconds(time)}
  </div>
);
