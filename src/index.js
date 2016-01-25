import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import SC from 'soundcloud';
import configureStore from './store/configureStore.js';
import Root from './containers/Root.js';

require('./main.css');
require('../dist/bundle.css');

SC.initialize({
  client_id: 'ba20838472e3ce0703c257f22404c8ea'
});

const store = configureStore();

render(
  <Root store={store} />,
  document.getElementById('root')
);
