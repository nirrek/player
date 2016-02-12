import React from 'react';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Slider from '../components/Slider.js';
import Palette from '../components/Palette.js';
import PlayerContainer from '../containers/PlayerContainer.js';

const App = () => (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={PlayerContainer} />
    <Route path="slider" component={Slider} />
    <Route path="palette" component={Palette} />
  </Router>
);

export default App;
