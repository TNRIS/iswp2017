
import React from 'react';
import {Route, NotFoundRoute} from 'react-router';

import App from './App';
import NotFound from './components/NotFound';
import Theme from './components/Theme';
import PlaceData from './components/PlaceData';

export default (
  <Route handler={App}>
    <Route name="theme" path=":theme/:year/:type/:typeId" handler={Theme}/>
    <Route name="placedata" path=":type/:typeId/:year" handler={PlaceData}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);
