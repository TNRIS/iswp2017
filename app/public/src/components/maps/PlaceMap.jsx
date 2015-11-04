/*global L*/
/*global cartodb*/

import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import titleize from 'titleize';

import constants from '../../constants';
import MapStateStore from '../../stores/MapStateStore';
// import MapStateActions from '../../actions/MapStateActions';
import PropTypes from '../../utils/CustomPropTypes';

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    type: React.PropTypes.string,
    typeId: React.PropTypes.string,
    placeData: PropTypes.PlaceData
  },

  getInitialState() {
    return MapStateStore.getState();
  },

  componentDidMount() {
    this.map = L.map(ReactDOM.findDOMNode(this.refs.map), {
      center: this.state.center || constants.DEFAULT_MAP_CENTER,
      zoom: this.state.zoom || constants.DEFAULT_MAP_ZOOM,
      scrollWheelZoom: false,
      zoomControl: false
    });

    L.control.zoom({position: 'topright'}).addTo(this.map);

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);

    cartodb.createLayer(this.map, 'https://tnris.cartodb.com/api/v2/viz/11bad656-8275-11e5-928e-0e5db1731f59/viz.json')
      .addTo(this.map)
      .on('done', (layer) => {
        console.log(layer);
        console.log(layer._url);
        // setTimeout(() => {
        //   console.log(layer._url);
        //   this.map.addLayer(L.tileLayer(layer._url));
        // }, 2000);
        //TODO: layer is not added to map
      })
      .on('error', (err) => {
        console.log(err);
      });

    MapStateStore.listen(this.onChange);
  },

  componentDidUpdate() {
    if (!this.props.placeData.data) { return; }

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }

    if (this.props.placeData.boundary) {
      this.boundaryLayer = L.geoJson(this.props.placeData.boundary, {
        style: constants.BOUNDARY_LAYER_STYLE
      });

      // this.map.addLayer(this.boundaryLayer);
      const name = R.path(['boundary', 'properties', 'Name'], this.props.placeData);
      if (this.props.type === 'region') {
        this.boundaryLayer.bindLabel(`Region ${name.toUpperCase()}`);
      }
      else if (this.props.type === 'county') {
        this.boundaryLayer.bindLabel(`${titleize(name)} County`);
      }
    }

    this.map.fitBounds(this.boundaryLayer.getBounds(), {
      paddingTopLeft: [500, 0] //TODO: Adjust this based on device size
    });
  },

  componentWillUnmount() {
    // this.map.off('zoomend', this.setMapState);
    // this.map.off('moveend', this.setMapState);

    MapStateStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  // setMapState() {
  //   MapStateActions.updateMapState({
  //     center: [this.map.getCenter().lat, this.map.getCenter().lng],
  //     zoom: this.map.getZoom()
  //   });
  // },

  render() {
    return (
      <div ref="map" className={this.props.className}></div>
    );
  }
});
