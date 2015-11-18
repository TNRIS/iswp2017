/*global L*/

import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import history from '../../history';
import constants from '../../constants';
import CartodbLayers from '../../utils/CartodbLayers';

//TODO: Adjust this based on device size

export default React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount() {
    this.map = L.map(ReactDOM.findDOMNode(this.refs.map), {
      scrollWheelZoom: false,
      zoomControl: false,
    });

    L.control.zoom({position: 'topright'}).addTo(this.map);

    this.map.fitBounds(constants.DEFAULT_MAP_BOUNDS, {
      paddingTopLeft: constants.VIEW_MAP_PADDING
    });

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);

    CartodbLayers.createRegionsLayer()
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
      history.pushState(null, `/region/${data.letter}`);
    }
  },

  render() {
    return (
      <div ref="map" className="view-map"></div>
    );
  }
});
