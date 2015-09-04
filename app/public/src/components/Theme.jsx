
import React from 'react';
import {State, Link} from 'react-router';

import constants from '../constants';
import ThemeDataStore from '../stores/ThemeDataStore';
import ThemeDataActions from '../actions/ThemeDataActions';
import ThemeChart from './ThemeChart';
import ThemeMap from './ThemeMap';
import ThemeTable from './ThemeTable';

export default React.createClass({
  // TODO: More validation on properties
  propTypes: {
    params: React.PropTypes.shape({
      theme: React.PropTypes.string.isRequired,
      year: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      typeId: React.PropTypes.string
    }).isRequired
  },

  // State mixin is for components that need the active params from react router
  mixins: [State],

  getInitialState() {
    return ThemeDataStore.getState();
  },

  componentDidMount() {
    ThemeDataStore.listen(this.onChange);

    this.fetchThemeData();
  },

  componentWillReceiveProps() {
    // Route params are in this.props, and when route changes the theme data
    // need to be fetched again
    this.fetchThemeData();
  },

  componentWillUnmount() {
    ThemeDataStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  fetchThemeData() {
    const params = this.getParams();
    ThemeDataActions.fetchThemeData({
      theme: params.theme, year: params.year, type: params.type, typeId: params.typeId
    });
  },

  render() {
    const params = this.getParams();
    let title = `${params.theme} - ${params.year} - ${params.type}`;
    if (params.typeId) {
      title += ` - ${params.typeId}`;
    }

    // TODO: REMOVE: temporary view switching by picking random year
    let yearStr = '';
    do {
      yearStr = constants.DECADES[Math.floor(Math.random() * constants.DECADES.length)];
    } while (yearStr === params.year)

    return (
      <div className={`theme-container theme-${params.theme}`}>
        <h3>{title.toUpperCase()}</h3>
        <Link to="theme" params={{theme: 'demands', year: yearStr, 'type': 'region', typeId: 'g'}}>change</Link>
        <div className="row">
          <div className="six columns">
            <div className="chart-container">
              <ThemeChart dataRows={this.state.themeData.dataRows} />
            </div>
          </div>
          <div className="six columns">
            <div className="map-container">
              <ThemeMap id="main-map" theme={params.theme} entities={this.state.themeData.entities} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="twelve columns">
            <div className="table-container">
              <ThemeTable dataRows={this.state.themeData.dataRows} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});