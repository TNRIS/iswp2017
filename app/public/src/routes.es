
import React from 'react';
import {Route, NotFoundRoute} from 'react-router';

import App from './App';
import NotFound from './components/NotFound';
import Theme from './components/Theme';

export default (
  <Route handler={App}>
    <Route name="theme" path=":theme/:year/:type/:typeId" handler={Theme}/>
  
    <NotFoundRoute handler={NotFound}/>
  </Route>
);
