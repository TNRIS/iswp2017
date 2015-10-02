
import React from 'react';
import {State, Link} from 'react-router';

import PlaceDataActions from '../actions/PlaceDataActions';
import PlaceDataStore from '../stores/PlaceDataStore';

export default React.createClass({
  mixins: [State],

  getInitialState() {
    return PlaceDataStore.getState();
  },

  componentDidMount() {
    PlaceDataStore.listen(this.onChange);

    this.fetchPlaceData();
  },

  componentWillReceiveProps() {
    // Route params are in this.props, and when route changes the theme data
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
      year: params.year, type: params.type, typeId: params.typeId
    });
  },

  render() {
    return (
      <div>place summary</div>
    );
  }

});