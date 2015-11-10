/*global L*/
/*global cartodb*/

import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import titleize from 'titleize';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import CartodbLayers from '../../utils/CartodbLayers';

//TODO: Adjust this based on device size
const mapPadding =  [500, 0];

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    type: React.PropTypes.string,
    typeId: React.PropTypes.string,
    placeData: PropTypes.PlaceData
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    this.map = L.map(ReactDOM.findDOMNode(this.refs.map), {
      scrollWheelZoom: false,
      zoomControl: false,
    });

    L.control.zoom({position: 'topright'}).addTo(this.map);

    this.map.fitBounds(constants.DEFAULT_MAP_BOUNDS, {
      paddingTopLeft: mapPadding
    });

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);

    CartodbLayers.createCountiesLayer()
      .then((countiesLayer) => {
        this.map.addLayer(countiesLayer);
      });
  },

  componentDidUpdate() {
    if (!this.props.placeData.data) { return; }

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }

    if (this.props.placeData.boundary) {
      this.boundaryLayer = L.geoJson(this.props.placeData.boundary, {
        style: constants.BOUNDARY_LAYER_STYLE
      });

      this.map.addLayer(this.boundaryLayer);
      const name = R.path(['boundary', 'properties', 'Name'], this.props.placeData);
      if (this.props.type === 'region') {
        this.boundaryLayer.bindLabel(`Region ${name.toUpperCase()}`);
      }
      else if (this.props.type === 'county') {
        this.boundaryLayer.bindLabel(`${titleize(name)} County`);
      }
    }

    this.map.fitBounds(this.boundaryLayer.getBounds(), {
      paddingTopLeft: mapPadding
    });
  },

  render() {
    return (
      <div ref="map" className="view-map"></div>
    );
  }
});
