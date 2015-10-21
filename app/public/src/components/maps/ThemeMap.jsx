/*global L:false*/

import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import scale from 'scale-number-range';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import NeedsLegend from '../../utils/NeedsLegend';

export default React.createClass({
  propTypes: {
    theme: React.PropTypes.string.isRequired,
    data: React.PropTypes.object.isRequired,
    decade: React.PropTypes.string,
    boundary: PropTypes.Feature
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      decade: '2020'
    };
  },

  componentDidMount() {
    //TODO: Graduated colors for Needs entities
    //TODO: Order entities so that larger are on bottom
    //TODO: Use spiderfier Leaflet plugin

    this.map = L.map(React.findDOMNode(this.refs.map), {
      center: constants.DEFAULT_MAP_CENTER,
      zoom: constants.DEFAULT_MAP_ZOOM,
      scrollWheelZoom: false,
      zoomControl: false
    });

    L.control.zoom({position: 'topright'}).addTo(this.map);

    if (this.props.theme === 'needs') {
      const legendControl = NeedsLegend.create();
      this.map.addControl(legendControl);
    }

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);

    // dataRows can have multiple rows for the same EntityId
    // so group them and sum their current year value to make
    // mappable entities features

    const groupedById = R.groupBy(R.prop('EntityId'))(this.props.data.rows);

    let maxVal = -Infinity;
    let minVal = Infinity;

    const entityFeatures = R.map((group) => {
      // Use the first entity in each group to get the base entity properties
      const entity = R.nth(0, group);
      const valueSum = R.sum(R.pluck(`Value_${this.props.decade}`)(group));

      if (valueSum > maxVal) { maxVal = valueSum; }
      if (valueSum < minVal) { minVal = valueSum; }

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
        const scaledRadius = scale(feat.properties.ValueSum,
          minVal, maxVal,
          constants.MIN_ENTITY_POINT_RADIUS, constants.MAX_ENTITY_POINT_RADIUS
        );

        return L.circleMarker(latlng, {
          radius: scaledRadius,
          className: `entity-marker-${this.props.theme}`
        });
      },
      onEachFeature: (feat, layer) => {
        layer.bindPopup(feat.properties.EntityName +
          `<br>Sum ${this.props.decade}: ` +
          feat.properties.ValueSum
        );
      }
    });

    let bounds = this.entitiesLayer.getBounds();

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }
    if (this.props.boundary) {
      this.boundaryLayer = L.geoJson(this.props.boundary, {
        style: constants.BOUNDARY_LAYER_STYLE
      });
      this.map.addLayer(this.boundaryLayer);
      bounds = bounds.extend(this.boundaryLayer.getBounds());
    }

    this.map.addLayer(this.entitiesLayer);
    this.map.fitBounds(bounds);
  },

  render() {
    return (
      <div>
        <h5>{constants.THEME_TITLES[this.props.theme]}</h5>
        <div className="theme-map" ref="map"></div>
      </div>
    );
  }
});