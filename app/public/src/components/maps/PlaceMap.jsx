/*global L:false*/

import R from 'ramda';
import React from 'react';
import titleize from 'titleize';

import constants from '../../constants';
import MapStateStore from '../../stores/MapStateStore';
// import MapStateActions from '../../actions/MapStateActions';
// import entityMapStyles from '../../utils/EntityMapStyles';
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
    this.map = L.map(React.findDOMNode(this.refs.map), {
      center: this.state.center || constants.DEFAULT_MAP_CENTER,
      zoom: this.state.zoom || constants.DEFAULT_MAP_ZOOM,
      scrollWheelZoom: false
    });

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    this.map.addLayer(baseLayer);

    MapStateStore.listen(this.onChange);
  },

  componentDidUpdate() {
    if (!this.props.placeData.data) { return; }

    // dataRows can have multiple rows for the same EntityId
    // so group them and sum their current year value to make
    // mappable entities features

    //TODO: Just using demands entities temporarily
    // const groupedById = R.groupBy(R.prop('EntityId'))(this.props.placeData.data.demands.rows);
    // const entityFeatures = R.map((group) => {
    //   // Use the first entity in each group to get the base entity properties
    //   const entity = R.nth(0, group);
    //   const valueSum = R.sum(R.pluck('Value_2020')(group));
    //   const props =  R.assoc('ValueSum', valueSum,
    //     R.pick(['EntityId', 'EntityName', 'ValueSum'], entity)
    //   );
    //   return {
    //     type: 'Feature',
    //     geometry: {
    //       type: 'Point',
    //       coordinates: [entity.Longitude, entity.Latitude]
    //     },
    //     properties: props
    //   };
    // })(R.values(groupedById));

    // if (this.entitiesLayer && this.map.hasLayer(this.entitiesLayer)) {
    //   this.map.removeLayer(this.entitiesLayer);
    // }
    // this.entitiesLayer = L.geoJson(entityFeatures, {
    //   pointToLayer: (feat, latlng) => {
    //     return L.circleMarker(latlng, entityMapStyles('demands'));
    //   },
    //   onEachFeature: (feat, layer) => {
    //     layer.bindPopup(feat.properties.EntityName + '<br>Sum 2020: ' + feat.properties.ValueSum);
    //   }
    // });
    // let bounds = this.entitiesLayer.getBounds();

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }

    if (this.props.placeData.boundary) {
      this.boundaryLayer = L.geoJson(this.props.placeData.boundary, {
        style: {
          fillOpacity: 0.2,
          color: '#3F556D',
          weight: 2
        }
      });
      // bounds = bounds.extend(this.boundaryLayer.getBounds());
      this.map.addLayer(this.boundaryLayer);
      const name = R.path(['boundary', 'properties', 'Name'], this.props.placeData);
      if (this.props.type === 'region') {
        this.boundaryLayer.bindLabel(`Region ${name.toUpperCase()}`);
      }
      else if (this.props.type === 'county') {
        this.boundaryLayer.bindLabel(`${titleize(name)} County`);
      }
    }

    // this.map.addLayer(this.entitiesLayer); // Must be added after the boundary to get click events
    this.map.fitBounds(this.boundaryLayer.getBounds(), {
      paddingTopLeft: [500, 0] //TODO: Adjust this based on device size
    });
    // this.map.fitBounds(bounds, {paddingTopLeft: [500, 0]});
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
