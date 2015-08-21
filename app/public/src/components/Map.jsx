import React from 'react';
import L from 'leaflet';

export default React.createClass({
  getInitialState() {
    return null;
  },

  componentDidMount() {
    this.map = L.map('mainMap', {
      center: [31.2, -99],
      zoom: 5
    });

    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    this.map.addLayer(layer);
  },

  componentWillUnmount() {

  },

  render() {
    return (
      <div id="mainMap">map div</div>
    );
  }
})

