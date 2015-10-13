
import React from 'react';
import {State, Link} from 'react-router';

import constants from '../constants';
import PlaceDataActions from '../actions/PlaceDataActions';
import PlaceDataStore from '../stores/PlaceDataStore';

import PlaceMap from './maps/PlaceMap';
import PlaceSummary from './PlaceSummary';
import ThemeTotalsByTimeChart from './charts/ThemeTotalsByTimeChart';
import ThemeTypesByTimeChart from './charts/ThemeTypesByTimeChart';
import DataByTypeCharts from './charts/DataByTypeCharts';
import ThemeMaps from './maps/ThemeMaps';
import DataTable from './DataTable';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      type: React.PropTypes.string.isRequired,
      typeId: React.PropTypes.string
    }).isRequired
  },

  mixins: [State],

  getInitialState() {
    return PlaceDataStore.getState();
  },

  componentDidMount() {
    PlaceDataStore.listen(this.onChange);

    this.fetchPlaceData();
  },

  componentWillReceiveProps() {
    // Route params are in this.props, and when route changes the data
    // need to be fetched again
    this.fetchPlaceData();
  },

  componentWillUnmount() {
    PlaceDataStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  fetchPlaceData() {
    const params = this.getParams();
    PlaceDataActions.fetchPlaceData({
      type: params.type, typeId: params.typeId
    });
  },

  render() {
    const params = this.getParams();

    // TODO: REMOVE: temporary view switching by picking random region
    const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const sampleNotVal = (arr, val) => {
      let sampleVal = '';
      do {
        sampleVal = sample(arr);
      } while (sampleVal === val)
      return sampleVal;
    };
    const randRegion = sampleNotVal(constants.REGIONS, params.typeId);
    // end TODO

    return (
      <div className="place-view">
        <div className="place-view-top">
          <PlaceMap id="main-map"
            type={params.type}
            typeId={params.typeId}
            placeData={this.state.placeData} />
          <div className="place-summary-wrapper wrapper">
            <PlaceSummary
              type={params.type}
              typeId={params.typeId}
              placeData={this.state.placeData} />
          </div>
        </div>
        <div className="container">
          <Link to="placeview" params={{type: 'region', typeId: randRegion}}>random region</Link>
          <div className="row data-section-row">
            <div className="twelve columns">
              <ThemeTotalsByTimeChart placeData={this.state.placeData} />
            </div>
          </div>
          <div className="row data-section-row">
            <div className="twelve columns">
              <ThemeMaps placeData={this.state.placeData} />
            </div>
          </div>
          <div className="row data-section-row">
            <div className="twelve columns">
              <ThemeTypesByTimeChart placeData={this.state.placeData} />
            </div>
          </div>
          <div className="row data-section-row">
            <div className="twelve columns">
              <DataByTypeCharts placeData={this.state.placeData} />
            </div>
          </div>
          <div className="row data-section-row">
            <div className="twelve columns">
              <div className="table-container">
                <DataTable placeData={this.state.placeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});