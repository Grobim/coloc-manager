import React from 'react';
import { render } from 'react-dom';

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import createBrowserHistory from 'history/lib/createBrowserHistory';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';

import firebase from 'firebase';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';

import 'typeface-roboto';

import './index.css';
import app from './reducers';
import registerServiceWorker from './registerServiceWorker';
import Routes from './Routes';

const firebaseConfig = {
  apiKey: 'AIzaSyA-InvnhvUaS7UzHoBQOwpbon5DiNMEcTs',
  authDomain: 'coloc-manager.firebaseapp.com',
  databaseURL: 'https://coloc-manager.firebaseio.com',
  projectId: 'coloc-manager',
  storageBucket: 'coloc-manager.appspot.com',
  messagingSenderId: '3636953393'
};

const reduxFirebaseConfig = {
  userProfile: 'users', // where profiles are stored in database
  presence: 'presence', // where list of online users is stored in database
  sessions: false
};

firebase.initializeApp(firebaseConfig);

const historyConfig = { basename: process.env.PUBLIC_URL };
const browserHistory = useRouterHistory(createBrowserHistory)(historyConfig);

const composers = [
  applyMiddleware(thunk, routerMiddleware(browserHistory)),
  reactReduxFirebase(firebase, reduxFirebaseConfig)
];

  // eslint-disable-next-line no-underscore-dangle
if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  // eslint-disable-next-line no-underscore-dangle
  composers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const createStoreWithFirebase = compose(...composers)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  app,
  routing: routerReducer
});
const initialState = {};
const store = createStoreWithFirebase(rootReducer, initialState);

const history = syncHistoryWithStore(browserHistory, store);

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(combineReducers({
        firebase: firebaseReducer,
        app,
        routing: routerReducer
      }));
    });
  }
}

render(
  <Provider store={store}>
    <Routes history={history} />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker(store);

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./Routes', () => {
    render(
      <Provider store={store}>
        <Routes history={history} />
      </Provider>,
      document.getElementById('root')
    );
  });
}
