/*global L*/

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getMapPadding} from '../../utils';
import history from '../../history';
import constants from '../../constants';
import CdbUtil from '../../utils/CdbUtil';

export default React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount() {
    this.map = L.map(this.refs.map,
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

    CdbUtil.createRegionsLayer()
      .then((result) => {
        this.map.addLayer(L.tileLayer(result.tilesUrl));

        this.utfGrid = L.utfGrid(result.gridUrl, {
          useJsonP: false
        });
        this.map.addLayer(this.utfGrid);
        this.utfGrid.on('click', this.navigateToRegion);
      });
  },

  componentWillUnmount() {
    this.utfGrid.off('click', this.navigateToRegion);
  },

  navigateToRegion({data}) {
    if (data) {
      history.push({pathname: `/region/${data.letter}`});
    }
  },

  render() {
    return (
      <div ref="map" className="view-map"></div>
    );
  }
});
