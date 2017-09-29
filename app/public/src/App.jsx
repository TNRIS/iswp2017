
import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import HeaderNav from './components/HeaderNav';
import PlaceView from './components/views/PlaceView';
import UsageTypeView from './components/views/UsageTypeView';
import SourceView from './components/views/SourceView';
import ProjectView from './components/views/ProjectView';
import EntityView from './components/views/EntityView';
import StatewideView from './components/views/StatewideView';

/**
 * Main application component
 */
export default class App extends React.Component {
  /**
   * Render the main app
   * @return {Component}
   */
  render() {
    return (
      <div>
        <Helmet titleTemplate="%s | 2017 Texas State Water Plan"/>
        <HeaderNav />
        <Switch>
          <Route name="stateview" path="/statewide" component={StatewideView}/>
          <Route name="entityview" path="/entity/:entityId" component={EntityView}/>
          <Route name="sourceview" path="/source/:sourceId" component={SourceView}/>
          <Route name="projectview" path="/project/:projectId" component={ProjectView}/>
          <Route name="usagetypeview" path="/usagetype/:typeId" component={UsageTypeView}/>
          <Route name="placeview" path="/:type/:typeId" component={PlaceView}/>
          <Redirect exact from='/' to="/statewide"/>
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object
};
