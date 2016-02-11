import { createStore, applyMiddleware, compose } from 'redux';
import saga from 'redux-saga';
import rootReducer from '../reducers/rootReducer.js';
import rootSaga from '../sagas/rootSaga.js';

const finalCreateStore = compose(
  applyMiddleware(
    saga(rootSaga),
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
