import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/rootReducer.js';

const finalCreateStore = compose(
  applyMiddleware(
    thunkMiddleware
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers/rootReducer.js', () =>
      store.replaceReducer(require('../reducers/rootReducer.js').default)
    );
  }

  return store;
}
