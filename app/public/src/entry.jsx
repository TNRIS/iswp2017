/*!
 * Interactive Texas State Water Plan 2017
 * TNRIS | TWDB
 */

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect} from 'react-router';

import App from './App';
import history from './history';
import NotFound from './components/NotFound';
import PlaceView from './components/PlaceView';
import EntityView from './components/EntityView';
import StatewideView from './components/StatewideView';

import './vendor/css/normalize.css';
import './vendor/css/skeleton.css';
import 'chartist/dist/chartist.min.css';
import 'react-select/dist/react-select.min.css';

import './vendor/js/leaflet.utfgrid.js';
import './vendor/js/leaflet.defaultextent.js';

import './sass/main.scss';

ReactDOM.render((
  <Router history={history}>
    <Route component={App}>
      <Route name="stateview" path="statewide" component={StatewideView}/>
      <Route name="entityview" path="entity/:entityId" component={EntityView}/>
      <Route name="placeview" path=":type/:typeId" component={PlaceView}/>
      <Redirect from="/" to="/statewide" />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('reactApp'));