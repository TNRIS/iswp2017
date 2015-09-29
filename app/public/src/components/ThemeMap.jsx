
import R from 'ramda';
import L from 'leaflet';
import React from 'react';

import MapStateStore from '../stores/MapStateStore';
// import MapStateActions from '../actions/MapStateActions';
import entityMapStyles from '../utils/EntityMapStyles';

export default React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    theme: React.PropTypes.string,
    type: React.PropTypes.string,
    year: React.PropTypes.string,
    typeId: React.PropTypes.string,
    dataRows: React.PropTypes.array,
    boundary: React.PropTypes.object
  },

  getInitialState() {
    return MapStateStore.getState();
  },

  componentDidMount() {
    this.map = L.map(this.getDOMNode(), {
      center: this.state.center || [31.2, -99],
      zoom: this.state.zoom || 5
    });

    const layer = L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    });

    this.map.addLayer(layer);

    // this.map.on('zoomend', this.setMapState);
    // this.map.on('moveend', this.setMapState);

    MapStateStore.listen(this.onChange);
  },

  componentDidUpdate() {
    if (!this.props.dataRows) { return; }

    const valueKey = `Value_${this.props.year}`;

    // dataRows can have multiple rows for the same EntityId
    // so group them and sum their current year value to make
    // mappable entities features
    const groupedById = R.groupBy(R.prop('EntityId'))(this.props.dataRows);
    const entityFeatures = R.map((group) => {
      // Use the first entity in each group to get the base entity properties
      const entity = R.nth(0, group);
      const valueSum = R.sum(R.pluck(valueKey)(group));
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
        return L.circleMarker(latlng, entityMapStyles(this.props.theme));
      },
      onEachFeature: (feat, layer) => {
        layer.bindPopup(feat.properties.EntityName + '<br>' + feat.properties.ValueSum);
      }
    });

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }

    let bounds = this.entitiesLayer.getBounds();

    if (this.props.boundary) {
      this.boundaryLayer = L.geoJson(this.props.boundary, {
        style: {
          fillOpacity: 0,
          color: '#000000',
          weight: 2
        }
      });
      bounds = bounds.extend(this.boundaryLayer.getBounds());
      this.map.addLayer(this.boundaryLayer);
    }

    this.map.addLayer(this.entitiesLayer);
    this.map.fitBounds(bounds);
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
