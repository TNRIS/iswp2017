/*global L*/

import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import history from '../../history';
import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import CdbUtil from '../../utils/CdbUtil';

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    type: React.PropTypes.string,
    typeId: React.PropTypes.string,
    placeData: PropTypes.PlaceData
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    this.map = L.map(ReactDOM.findDOMNode(this.refs.map),
      constants.VIEW_MAP_OPTIONS
    );

    L.control.zoom({position: 'topright'}).addTo(this.map);

    this.map.fitBounds(constants.DEFAULT_MAP_BOUNDS, {
      paddingTopLeft: constants.VIEW_MAP_PADDING
    });

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);

    CdbUtil.createCountiesLayer()
      .then((result) => {
        this.map.addLayer(L.tileLayer(result.tilesUrl));

        this.utfGrid = L.utfGrid(result.gridUrl, {
          useJsonP: false
        });
        this.map.addLayer(this.utfGrid);
        this.utfGrid.on('click', this.navigateToCounty);
      });
  },

  componentDidUpdate() {
    if (!this.props.placeData.data) { return; }

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }

    if (this.props.placeData.boundary) {
      this.boundaryLayer = L.geoJson(this.props.placeData.boundary, {
        style: constants.BOUNDARY_LAYER_STYLE,
        clickable: false
      });

      this.map.addLayer(this.boundaryLayer);
    }

    this.map.fitBounds(this.boundaryLayer.getBounds(), {
      paddingTopLeft: constants.VIEW_MAP_PADDING
    });
  },

  navigateToCounty({data}) {
    if (data) {
      history.pushState(null, `/county/${data.name}`);
    }
  },

  render() {
    return (
      <div ref="map" className="view-map"></div>
    );
  }
});
