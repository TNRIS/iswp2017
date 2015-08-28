
import React from 'react';
import {Route} from 'react-router';

import App from './App';
import Theme from './components/Theme';

export default (
  <Route handler={App}>
    <Route name="theme" path=":theme/:year/:type/:typeId" handler={Theme}/>
  </Route>
);
