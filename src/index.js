import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import SC from 'soundcloud';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/rootReducer.js';
import { Provider } from 'react-redux';
import Player from './components/Player.js';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Slider from './components/Controls/Slider.js';
import Palette from './components/Palette.js';

require('./main.css');
require('../dist/bundle.css');

SC.initialize({
  client_id: 'ba20838472e3ce0703c257f22404c8ea'
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

const store = createStoreWithMiddleware(rootReducer);
store.dispatch({ type: 'INIT' });

window.getState = store.getState;

render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <Route path="/" component={Player} />
      <Route path="slider" component={Slider} />
      <Route path="palette" component={Palette} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
