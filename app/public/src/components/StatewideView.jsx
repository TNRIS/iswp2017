
import React from 'react';
import Helmet from 'react-helmet';

import constants from '../constants';
import PlaceDataActions from '../actions/PlaceDataActions';
import PlaceDataStore from '../stores/PlaceDataStore';

import StatewideViewMap from './maps/StatewideViewMap';
import StatewideSummary from './StatewideSummary';
// import ThemeTotalsByDecadeChart from './charts/ThemeTotalsByDecadeChart';
// import ThemeTypesByDecadeChart from './charts/ThemeTypesByDecadeChart';
// import DataByTypeCharts from './charts/DataByTypeCharts';
// import ThemeMaps from './maps/ThemeMaps';
// import DataTable from './DataTable';

export default React.createClass({

  // getInitialState() {
  //   return PlaceDataStore.getState();
  // },

  // componentDidMount() {
  //   PlaceDataStore.listen(this.onChange);

  //   this.fetchData();
  // },

  // componentWillReceiveProps() {
  //   this.fetchData();
  // },

  // componentWillUnmount() {
  //   PlaceDataStore.unlisten(this.onChange);
  // },

  // onChange(state) {
  //   this.setState(state);
  // },

  // fetchData() {
  //   //TODO: Fetch statewide data
  //   PlaceDataStore.fetch({type: 'statewide'});
  // },

  render() {
    // const placeData = this.state.placeData;

    return (
      <div className="statewide-view">
        <Helmet title="Statewide" />
        <section className="main-content">
          <div className="view-top statewide-view-top">
            <StatewideViewMap />
            <div className="summary-wrapper wrapper">
              <StatewideSummary />
            </div>
          </div>
          <div className="container">

          </div>
        </section>
      </div>
    );
  }

});