
import React from 'react/addons';
import {State, Link} from 'react-router';
import Helmet from 'react-helmet';
import titleize from 'titleize';

import constants from '../constants';
import PlaceDataActions from '../actions/PlaceDataActions';
import PlaceDataStore from '../stores/PlaceDataStore';
import PlaceMap from './maps/PlaceMap';
import PlaceSummary from './PlaceSummary';
import ThemeTotalsByDecadeChart from './charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from './charts/ThemeTypesByDecadeChart';
import DataByTypeCharts from './charts/DataByTypeCharts';
import ThemeMaps from './maps/ThemeMaps';
import DataTable from './DataTable';
import DecadeSelector from './DecadeSelector';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      type: React.PropTypes.string.isRequired,
      typeId: React.PropTypes.string
    }).isRequired
  },

  mixins: [React.addons.LinkedStateMixin, State],

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
    const placeData = this.state.placeData;

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

    let title;
    switch (params.type.toLowerCase()) {
    case 'region':
      title = `Region ${params.typeId.toUpperCase()}`;
      break;
    case 'county':
      title = `${titleize(params.typeId)} County`;
      break;
    default:
      title = `${titleize(params.typeId)}`;
    }

    return (
      <div className="place-view">
        <Helmet title={title} />
        <section className="main-content">
          <div className="place-view-top">
            <PlaceMap className="place-map"
              type={params.type}
              typeId={params.typeId}
              placeData={placeData} />
            <div className="place-summary-wrapper wrapper">
              <PlaceSummary
                type={params.type}
                typeId={params.typeId}
                placeData={placeData} />
            </div>
          </div>
          <div className="container">
            <Link to="placeview" params={{type: 'region', typeId: randRegion}}>random region</Link>

            <div className="row panel-row">
              <div className="twelve columns">
                <ThemeTotalsByDecadeChart placeData={placeData} />
              </div>
            </div>

            <div className="row panel-row">
              <div className="twelve columns">
                <ThemeTypesByDecadeChart placeData={placeData} />
              </div>
            </div>

            <div className="row panel-row">
              <div className="twelve columns">
                <DataByTypeCharts placeData={placeData} />
              </div>
            </div>
          </div>

          <div className="decade-dependent-wrap">
            <div className="container">
              <div className="row panel-row">
                <DecadeSelector valueLink={this.linkState("selectedDecade")} />
              </div>

              <div className="row panel-row">
                <div className="twelve columns">
                  <ThemeMaps placeData={placeData} decade={this.state.selectedDecade} />
                </div>
              </div>

              <div className="row panel-row">
                <div className="twelve columns">
                  <DataTable placeData={placeData} decade={this.state.selectedDecade} />
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    );
  }

});