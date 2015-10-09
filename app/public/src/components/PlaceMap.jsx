
import R from 'ramda';
import L from 'leaflet';
import React from 'react';

import MapStateStore from '../stores/MapStateStore';
// import MapStateActions from '../actions/MapStateActions';
import entityMapStyles from '../utils/EntityMapStyles';

export default React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    type: React.PropTypes.string,
    typeId: React.PropTypes.string,
    placeData: React.PropTypes.object
  },

  getInitialState() {
    return MapStateStore.getState();
  },

  componentDidMount() {
    this.map = L.map(this.getDOMNode(), {
      center: this.state.center || [31.2, -99],
      zoom: this.state.zoom || 5,
      scrollWheelZoom: false
    });

    const layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    this.map.addLayer(layer);

    MapStateStore.listen(this.onChange);
  },

  componentDidUpdate() {
    if (!this.props.placeData.data) { return; }

    // dataRows can have multiple rows for the same EntityId
    // so group them and sum their current year value to make
    // mappable entities features

    //TODO: Just using demands entities temporarily
    const groupedById = R.groupBy(R.prop('EntityId'))(this.props.placeData.data.demands.rows);
    const entityFeatures = R.map((group) => {
      // Use the first entity in each group to get the base entity properties
      const entity = R.nth(0, group);
      const valueSum = R.sum(R.pluck('Value_2020')(group));
      const props =  R.assoc('ValueSum', valueSum,
        R.pick(['EntityId', 'EntityName', 'ValueSum'], entity)
      );
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [entity.Longitude, entity.Latitude]
        },
        properties: props
      };
    })(R.values(groupedById));

    if (this.entitiesLayer && this.map.hasLayer(this.entitiesLayer)) {
      this.map.removeLayer(this.entitiesLayer);
    }
    this.entitiesLayer = L.geoJson(entityFeatures, {
      pointToLayer: (feat, latlng) => {
        return L.circleMarker(latlng, entityMapStyles('demands'));
      },
      onEachFeature: (feat, layer) => {
        layer.bindPopup(feat.properties.EntityName + '<br>Sum 2020: ' + feat.properties.ValueSum);
      }
    });


    let bounds = this.entitiesLayer.getBounds();

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }

    if (this.props.placeData.boundary) {
      this.boundaryLayer = L.geoJson(this.props.placeData.boundary, {
        style: {
          fillOpacity: 0,
          color: '#000000',
          weight: 2
        }
      });
      bounds = bounds.extend(this.boundaryLayer.getBounds());
      this.map.addLayer(this.boundaryLayer);
    }

    this.map.addLayer(this.entitiesLayer); // Must be added after the boundary to get click events
    this.map.fitBounds(bounds, {paddingTopLeft: [500, 0]});
  },

  componentWillUnmount() {
    // this.map.off('zoomend', this.setMapState);
    // this.map.off('moveend', this.setMapState);

    MapStateStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  // setMapState() {
  //   MapStateActions.updateMapState({
  //     center: [this.map.getCenter().lat, this.map.getCenter().lng],
  //     zoom: this.map.getZoom()
  //   });
  // },

  render() {
    return (
      <div id={this.props.id}></div>
    );
  }
});