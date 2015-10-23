
import React from 'react';
import {State} from 'react-router';
import Helmet from 'react-helmet';

// import constants from '../constants';
import PlaceDataActions from '../actions/PlaceDataActions';
import PlaceDataStore from '../stores/PlaceDataStore';
import PlaceMap from './maps/PlaceMap';
import PlaceSummary from './PlaceSummary';
// import ThemeTotalsByDecadeChart from './charts/ThemeTotalsByDecadeChart';
// import ThemeTypesByDecadeChart from './charts/ThemeTypesByDecadeChart';
// import DataByTypeCharts from './charts/DataByTypeCharts';
// import ThemeMaps from './maps/ThemeMaps';
// import DataTable from './DataTable';

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
    const params = this.props.params;
    PlaceDataActions.fetchPlaceData({
      type: params.type, typeId: params.typeId
    });
  },

  render() {
    const params = this.props.params;
    const placeData = this.state.placeData;

    return (
      <div className="statewide-view">
        <Helmet title="Statewide" />
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

          </div>
        </section>
      </div>
    );
  }

});