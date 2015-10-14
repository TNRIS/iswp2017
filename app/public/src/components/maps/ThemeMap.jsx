/*global L:false*/

import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';

import entityMapStyles from '../../utils/EntityMapStyles';
import constants from '../../constants';

export default React.createClass({
  propTypes: {
    theme: React.PropTypes.string,
    data: React.PropTypes.object
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    this.map = L.map(React.findDOMNode(this.refs.map), {
      center: constants.DEFAULT_MAP_CENTER,
      zoom: constants.DEFAULT_MAP_ZOOM,
      scrollWheelZoom: false
    });

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);

    // dataRows can have multiple rows for the same EntityId
    // so group them and sum their current year value to make
    // mappable entities features

    //TODO: Just using 2020 values temporarily
    const groupedById = R.groupBy(R.prop('EntityId'))(this.props.data.rows);
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
        return L.circleMarker(latlng, entityMapStyles(this.props.theme));
      },
      onEachFeature: (feat, layer) => {
        layer.bindPopup(feat.properties.EntityName + '<br>Sum 2020: ' + feat.properties.ValueSum);
      }
    });
    // // let bounds = this.entitiesLayer.getBounds();

    this.map.addLayer(this.entitiesLayer);
    this.map.fitBounds(this.entitiesLayer.getBounds());
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