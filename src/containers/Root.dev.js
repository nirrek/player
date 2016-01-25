import React from 'react';
import DevTools from './DevTools.js';
import { Provider } from 'react-redux';
import App from '../components/App.js';

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>
);

export default Root;
