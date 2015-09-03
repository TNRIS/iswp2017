
import R from 'ramda';
import L from 'leaflet';
import React from 'react';

import MapStateStore from '../stores/MapStateStore';
import MapStateActions from '../actions/MapStateActions';

export default React.createClass({
  propTypes: {
    entities: React.PropTypes.array
  },

  getInitialState() {
    return MapStateStore.getState();
  },

  componentDidMount() {
    this.map = L.map(this.getDOMNode(), {
      center: this.state.center || [31.2, -99],
      zoom: this.state.zoom || 5
    });

    const layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    this.map.addLayer(layer);

    this.map.on('zoomend', this.setMapState);
    this.map.on('moveend', this.setMapState);

    MapStateStore.listen(this.onChange);
  },

  componentWillReceiveProps(nextProps) {
    console.log("in componentWillReceiveProps");
    const entities = nextProps.entities;
    if (!entities) { return; }
    const entityFeatures = entities.map((entity) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [entity.Longitude, entity.Latitude]
        },
        properties: R.pick(['EntityId', 'EntityName'], entity)
      };
    });

    if (this.entitiesLayer && this.map.hasLayer(this.entitiesLayer)) {
      this.map.removeLayer(this.entitiesLayer);
    }
    this.entitiesLayer = L.geoJson(entityFeatures, {
      pointToLayer: (feat, latlng) => {
        return L.circleMarker(latlng, {
          radius: 6
        });
      }
    });
    this.map.addLayer(this.entitiesLayer);
  },

  shouldComponentUpdate() {
    return false;
  },

  componentWillUnmount() {
    this.map.off('zoomend', this.setMapState);
    this.map.off('moveend', this.setMapState);

    MapStateStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  setMapState() {
    MapStateActions.updateMapState({
      center: [this.map.getCenter().lat, this.map.getCenter().lng],
      zoom: this.map.getZoom()
    });
  },

  render() {
    console.log("in map render");
    return (
      <div id={this.props.id}></div>
    );
  }
});
