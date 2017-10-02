/*
 * Interactive Texas State Water Plan 2017
 * TNRIS | TWDB
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router-dom';

import App from './App';
import history from './history';

import ViewStateActions from './actions/ViewStateActions';

import './vendor/css/normalize.css';
import './vendor/css/skeleton.css';
import 'chartist/dist/chartist.min.css';
import 'react-select/dist/react-select.min.css';

import './vendor/js/d3.custom.js';
import './vendor/js/leaflet.oms.js';
import './vendor/js/leaflet.utfgrid.js';
import './vendor/js/leaflet.defaultextent.js';
import './vendor/js/leaflet.label.js';
import './vendor/js/leaflet.easybutton.js';

import './sass/main.scss';

// setup listener so Google Analytics can send pageviews on location change
history.listen((loc) => {
  if (window && window.ga) {
    window.ga('send', 'pageview', loc);
  }
});

// setup listener to update the ViewState based on location
history.listen((loc) => {
  ViewStateActions.updateViewState(loc.pathname);
});

ReactDOM.render((
  <Router history={history}>
    <Route component={App} />
  </Router>
), document.getElementById('reactApp'));
