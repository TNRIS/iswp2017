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
import PlaceView from './components/views/PlaceView';
import UsageTypeView from './components/views/UsageTypeView';
import EntityView from './components/views/EntityView';
import StatewideView from './components/views/StatewideView';

import './vendor/css/normalize.css';
import './vendor/css/skeleton.css';
import 'chartist/dist/chartist.min.css';
import 'react-select/dist/react-select.min.css';

import './vendor/js/d3.custom.js';
import './vendor/js/leaflet.oms.js';
import './vendor/js/leaflet.utfgrid.js';
import './vendor/js/leaflet.defaultextent.js';
import './vendor/js/leaflet.easybutton.js';

import './sass/main.scss';

history.listen((loc) => {
  if (window && window.ga) {
    window.ga('send', 'pageview', loc);
  }
});

ReactDOM.render((
  <Router history={history}>
    <Route component={App}>
      <Route name="stateview" path="statewide" component={StatewideView}/>
      <Route name="entityview" path="entity/:entityId" component={EntityView}/>
      <Route name="usagetypeview" path="usagetype/:typeId" component={UsageTypeView}/>
      <Route name="placeview" path=":type/:typeId" component={PlaceView}/>
      <Redirect from="/" to="/statewide" />
    </Route>
  </Router>
), document.getElementById('reactApp'));