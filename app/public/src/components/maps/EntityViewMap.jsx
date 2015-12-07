/*global L*/

import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import history from '../../history';
import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import CdbUtil from '../../utils/CdbUtil';

//TODO: Adjust this based on device size

export default React.createClass({
  propTypes: {
    entityData: PropTypes.EntityData
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    this.map = L.map(ReactDOM.findDOMNode(this.refs.map),
      constants.VIEW_MAP_OPTIONS
    );

    L.control.zoom({position: 'topright'}).addTo(this.map);
    L.control.defaultExtent({
      position: 'topright',
      text: '',
      title: 'Zoom to Texas'
    }).addTo(this.map);

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
        this.utfGrid.on('mousemove', this.showCountyLabel);
        this.utfGrid.on('mouseout', this.hideCountyLabel);
      });
  },

  componentDidUpdate() {
    if (!this.props.entityData.entity) {
      return;
    }

    const entity = this.props.entityData.entity;

    if (this.entityLayer && this.map.hasLayer(this.entityLayer)) {
      this.map.removeLayer(this.entityLayer);
    }

    this.entityLayer = L.circleMarker([entity.Latitude, entity.Longitude],
      constants.ENTITY_LAYER_STYLE,
    );

    this.map.addLayer(this.entityLayer);

    this.map.fitBounds(this.entityLayer.getBounds(), {
      paddingTopLeft: constants.VIEW_MAP_PADDING,
      maxZoom: 8
    });
  },

  componentWillUnmount() {
    if (this.utfGrid) {
      this.utfGrid.off('click', this.navigateToCounty);
      this.utfGrid.off('mousemove', this.showCountyLabel);
      this.utfGrid.off('mouseout', this.hideCountyLabel);
    }
  },

  navigateToCounty({data}) {
    if (data) {
      history.pushState(null, `/county/${data.name}`);
    }
  },

  showCountyLabel(event) {
    if (!this.label) {
      this.label = new L.Label({className: 'label-county'});
    }
    this.label.setContent(event.data.name);
    this.label.setLatLng(event.latlng);
    if (!this.map.hasLayer(this.label)) {
      this.map.addLayer(this.label);
    }
  },

  hideCountyLabel() {
    if (this.label && this.map.hasLayer(this.label)) {
      this.map.removeLayer(this.label);
      this.label = null;
    }
  },

  render() {
    return (
      <div ref="map" className="view-map"></div>
    );
  }
});
