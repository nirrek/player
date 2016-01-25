import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Slider from '../components/Controls/Slider.js';
import Palette from '../components/Palette.js';
import Player from '../components/Player.js';

const App = () => (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={Player} />
    <Route path="slider" component={Slider} />
    <Route path="palette" component={Palette} />
  </Router>
);

export default App;
