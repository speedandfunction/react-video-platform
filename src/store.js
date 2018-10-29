import {createStore, applyMiddleware, compose} from 'redux';
import {createBrowserHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';

import logger from 'redux-logger';
import {autoRehydrate} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducer';
import sagas from './sagas';

const _history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const middleware = [
  applyMiddleware(routerMiddleware(_history)),
  applyMiddleware(sagaMiddleware),
  autoRehydrate({log: __DEV__})
];

if (__DEV__) {
  middleware.push(applyMiddleware(logger));
}
if (window.devToolsExtension) {
  middleware.push(window.devToolsExtension());
}

const _store = createStore(
  connectRouter(_history)(reducers),
  {},
  compose(...middleware)
);
sagaMiddleware.run(sagas);

export const store = _store;
export const history = _history;
