import L from 'leaflet';
import R from 'ramda';
import React from 'react';

import MapStateStore from '../stores/MapStateStore';
import MapStateActions from '../actions/MapStateActions';

import ThemeDataStore from '../stores/ThemeDataStore';
import EntityStore from '../stores/EntityStore';

import EntityActions from '../actions/EntityActions';

import ThemePropTypes from '../mixins/ThemePropTypes';

export default React.createClass({
  mixins: [ThemePropTypes],

  getInitialState() {
    return {
      mapState: MapStateStore.getState(),
      entityState: EntityStore.getState(),
      themeDataState: ThemeDataStore.getState()
    };
  },

  componentDidMount() {
    this.map = L.map(this.getDOMNode(), {
      center: this.state.mapState.center || [31.2, -99],
      zoom: this.state.mapState.zoom || 5
    });

    const layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    this.map.addLayer(layer);

    this.map.on('zoomend', this.setMapState);
    this.map.on('moveend', this.setMapState);

    ThemeDataStore.listen(this.onThemeDataChange);
    EntityStore.listen(this.onEntitiesChange);
    MapStateStore.listen(this.onMapStateChange);
  },

  componentWillUnmount() {
    this.map.off('zoomend', this.setMapState);
    this.map.off('moveend', this.setMapState);

    ThemeDataStore.unlisten(this.onThemeDataChange);
    EntityStore.unlisten(this.onEntitiesChange);
    MapStateStore.unlisten(this.onMapStateChange);
  },

  onThemeDataChange(newState) {
    // TODO: Call EntityActions.fetchEntities({entityIds: R.pluck('EntityId', newState.themeData)});
    // here?
    this.setState(R.assoc('themeDataState', newState, this.state));
  },

  onEntitiesChange(newState) {
    this.setState(R.assoc('entityState', newState, this.state));
  },

  onMapStateChange(newState) {
    this.setState(R.assoc('mapState', newState, this.state));
  },

  setMapState() {
    MapStateActions.updateMapState({
      center: [this.map.getCenter().lat, this.map.getCenter().lng],
      zoom: this.map.getZoom()
    });
  },

  render() {
    return (
      <div id="main-map"></div>
    );
  }
});
