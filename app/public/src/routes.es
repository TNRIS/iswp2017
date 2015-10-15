
import React from 'react';
import {Route, Redirect, NotFoundRoute} from 'react-router';

import App from './App';
import NotFound from './components/NotFound';
import PlaceView from './components/PlaceView';

//TODO: Remove temporary redirect from "/"
export default (
  <Route handler={App}>
    <Route name="placeview" path=":type/:typeId" handler={PlaceView}/>
    <Redirect from="/" to="/region/K" />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);
