/*global L*/

import React from 'react';

import {getMapPadding} from '../../utils';
import history from '../../history';
import constants from '../../constants';
import CustomPropTypes from '../../utils/CustomPropTypes';
import CdbUtil from '../../utils/CdbUtil';

export default class SourceViewMap extends React.Component {
  componentDidMount() {
    this.map = L.map(this.mapDiv,
      constants.VIEW_MAP_OPTIONS
    );

    this.map.attributionControl.setPrefix('');

    L.control.zoom({position: 'topright'}).addTo(this.map);
    L.control.defaultExtent({
      position: 'topright',
      text: '',
      title: 'Zoom to Texas'
    }).addTo(this.map);

    this.map.fitBounds(constants.DEFAULT_MAP_BOUNDS, {
      paddingTopLeft: getMapPadding()
    });

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);

    const countiesUrl = CdbUtil.createCountiesLayer();
    const countiesLayer = this.countiesLayer = L.tileLayer(countiesUrl.tilesUrl);
    const countiesLabelsUrl = CdbUtil.createCountiesLabelsLayer();
    const countiesLabelsLayer = this.countiesLabelsLayer = L.tileLayer(countiesLabelsUrl.tilesUrl);

    this.map.addLayer(countiesLayer);
    this.utfGrid = L.utfGrid(countiesUrl.gridUrl, {
      useJsonP: false
    });
    this.map.addLayer(this.utfGrid);
    this.utfGrid.on('click', this.navigateToCounty);
    this.utfGrid.on('mousemove', this.showCountyLabel);
    this.utfGrid.on('mouseout', this.hideCountyLabel);
    this.map.on('zoomend', () => {
        if (this.map.getZoom() < 7) {
            this.map.removeLayer(countiesLabelsLayer);
        }
        else {
            this.map.addLayer(countiesLabelsLayer);
        }
    });
  }

    componentDidUpdate = () => {
    if (!this.props.sourceData || !this.props.sourceData.boundary) {
      return;
    }

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }

    this.boundaryLayer = L.geoJson(this.props.sourceData.boundary, {
      style: constants.BOUNDARY_LAYER_STYLE,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, constants.BOUNDARY_LAYER_STYLE)
      },
      clickable: false
    });

    this.map.addLayer(this.boundaryLayer);

    try {
      this.map.fitBounds(this.boundaryLayer.getBounds(), {
        paddingTopLeft: getMapPadding()
      });
    } catch(err) {
      return;
    }

  }


  componentWillUnmount = () => {
    if (this.utfGrid) {
      this.utfGrid.off('click', this.navigateToCounty);
      this.utfGrid.off('mousemove', this.showCountyLabel);
      this.utfGrid.off('mouseout', this.hideCountyLabel);
    }
  }

  navigateToCounty = ({data}) => {
    if (data) {
      history.push({pathname: `/county/${data.name}`});
    }
  }

  showCountyLabel = (event) => {
    if (!this.label) {
      this.label = new L.Label({className: 'label-county'});
    }
    this.label.setContent(event.data.name);
    this.label.setLatLng(event.latlng);
    if (!this.map.hasLayer(this.label)) {
      this.map.addLayer(this.label);
    }
  }

  hideCountyLabel = () => {
    if (this.label && this.map.hasLayer(this.label)) {
      this.map.removeLayer(this.label);
      this.label = null;
    }
  }

  render() {
    return (
      <div ref={(mapDiv) => {this.mapDiv = mapDiv;}} className="view-map"></div>
    );
  }
}

SourceViewMap.propTypes = {
  sourceData: CustomPropTypes.SourceData
}