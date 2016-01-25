import React from 'react';
import { Provider } from 'react-redux';
import App from '../components/App.js';

const Root = ({ store }) => (
  <Provider store={store}>
    <div> {/* Ensure consistent structure in dev and prod */}
      <App />
    </div>
  </Provider>
);

export default Root;
