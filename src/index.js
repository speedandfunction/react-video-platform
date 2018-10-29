import ReactDOM from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';

import {AppContainer} from './containers';
import {store, history} from './store';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/" component={AppContainer}/>
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
