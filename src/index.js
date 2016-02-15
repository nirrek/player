import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Soundcloud from 'soundcloud';
import configureStore from './store/configureStore.js';
import { Provider } from 'react-redux';
import App from './components/App.js';

require('./styles/main.css');
require('./styles/bundle.css');

Soundcloud.initialize({
  client_id: 'ba20838472e3ce0703c257f22404c8ea'
});

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
