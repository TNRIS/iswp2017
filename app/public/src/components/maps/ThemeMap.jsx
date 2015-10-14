/*global L:false*/

import React from 'react';
import {PureRenderMixin} from 'react/addons';

import constants from '../../constants';

export default React.createClass({
  propTypes: {
    theme: React.PropTypes.string,
    data: React.PropTypes.object
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    console.log(this.props.data);
    this.map = L.map(React.findDOMNode(this.refs.map), {
      center: constants.DEFAULT_MAP_CENTER,
      zoom: constants.DEFAULT_MAP_ZOOM,
      scrollWheelZoom: false
    });

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);
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