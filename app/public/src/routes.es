
import React from 'react';
import {Route, NotFoundRoute} from 'react-router';

import App from './App';
import NotFound from './components/NotFound';
import PlaceView from './components/PlaceView';

export default (
  <Route handler={App}>
    <Route name="placeview" path=":type/:typeId" handler={PlaceView}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);
