/*global L*/

import React from 'react';

import {getMapPadding} from '../../utils';
import history from '../../history';
import constants from '../../constants';
import CdbUtil from '../../utils/CdbUtil';

export default class StatewideViewMap extends React.PureComponent {
  componentDidMount = () => {
    this.map = L.map(this.mapDiv, constants.VIEW_MAP_OPTIONS);
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

    const regionsUrl = CdbUtil.createRegionsLayer();
    this.map.addLayer(L.tileLayer(regionsUrl.tilesUrl));
    this.utfGrid = L.utfGrid(regionsUrl.gridUrl, {
      useJsonP: false
    });
    this.map.addLayer(this.utfGrid);
    this.utfGrid.on('click', this.navigateToRegion);

    const regionsLabelsUrl = CdbUtil.createRegionsLabelsLayer();
    const regionsLabelsLayer = this.regionsLabelsLayer = L.tileLayer(regionsLabelsUrl.tilesUrl);
    this.map.addLayer(regionsLabelsLayer);
  }

  componentWillUnmount = () => {
    this.utfGrid.off('click', this.navigateToRegion);
  }

  navigateToRegion = ({data}) => {
    if (data) {
      history.push({pathname: `/region/${data.letter}`});
    }
  }

  render() {
    return (
      <div ref={(mapDiv) => {this.mapDiv = mapDiv;}} className="view-map"></div>
    );
  }
}
