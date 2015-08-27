
import React from 'react';
import {Route} from 'react-router';

import App from './App';

export default (
  <Route name="app" path="/" handler={App}>
    <Route name="theme" path=":theme" handler={Map} />
  </Route>
);
