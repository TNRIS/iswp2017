import React from 'react';
import L from 'leaflet';

import ThemePropTypes from '../mixins/ThemePropTypes';

export default React.createClass({
  mixins: [ThemePropTypes],

  componentDidMount() {
    this.map = L.map('main-map', {
      center: [31.2, -99],
      zoom: 5
    });

    const layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    this.map.addLayer(layer);
  },

  render() {
    return (
      <div id="main-map">map div</div>
    );
  }
});
