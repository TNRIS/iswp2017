/*!
 * Interactive Texas State Water Plan 2017
 * TNRIS | TWDB
 */

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Redirect} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from './App';
import NotFound from './components/NotFound';
import PlaceView from './components/PlaceView';
import StatewideView from './components/StatewideView';

import './vendor/css/normalize.css';
import './vendor/css/skeleton.css';
import 'chartist/dist/chartist.min.css';

import './sass/main.scss';

const history = createBrowserHistory();

ReactDOM.render((
  <Router history={history}>
    <Route component={App}>
      <Route name="stateview" path="statewide" component={StatewideView}/>
      <Route name="placeview" path=":type/:typeId" component={PlaceView}/>
      <Redirect from="/" to="/region/K" />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('reactApp'));