/*global L*/

import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

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

    //TODO: UTFGrid hover to show label
    //TODO: styling according to water plan
    CartodbLayers.createRegionsLayer()
      .then((result) => {
        this.map.addLayer(L.tileLayer(result.tilesUrl));

        // const utfGrid = new L.UtfGrid(layerDefinition.grids[0][0], {
        //   useJsonP: false
        // });
        // this.map.addLayer(utfGrid);
        // utfGrid.on('mouseover', (e) => {
        //   if (e.data) {
        //     console.log(e.data);
        //   }
        // });
      });
  },

  render() {
    return (
      <div ref="map" className="view-map"></div>
    );
  }
});
