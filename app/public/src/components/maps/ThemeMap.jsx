/*global L:false*/

import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import scale from 'scale-number-range';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import NeedsLegend from '../../utils/NeedsLegend';
import ThemeMapStateActions from '../../actions/ThemeMapStateActions';
import ThemeMapStateStore from '../../stores/ThemeMapStateStore';

export default React.createClass({
  propTypes: {
    theme: React.PropTypes.string.isRequired,
    data: React.PropTypes.object.isRequired,
    decade: React.PropTypes.string,
    boundary: PropTypes.Feature
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      decade: '2020'
    };
  },

  getInitialState() {
    return ThemeMapStateStore.getState();
  },

  componentDidMount() {
    //TODO: Graduated colors for Needs entities
    //TODO: Order entities so that larger are on bottom
    //TODO: Use spiderfier Leaflet plugin ?

    const map = this.map = L.map(ReactDOM.findDOMNode(this.refs.map), {
      scrollWheelZoom: false,
      zoomControl: false
    });

    map.fitBounds(constants.DEFAULT_MAP_BOUNDS);

    L.control.zoom({position: 'topright'}).addTo(this.map);

    if (this.props.theme === 'needs') {
      const legendControl = NeedsLegend.create();
      map.addControl(legendControl);
    }

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    map.addLayer(baseLayer);
    this.updateMap(this.props);

    this.enableMapListeners();
    ThemeMapStateStore.listen(this.onMapStateChange);
  },

  componentWillReceiveProps(nextProps) {
    this.updateMap(nextProps);
  },

  componentWillUpdate(nextProps, nextState) {
    //turn off the map listeners right before state changes
    this.disableMapListeners();

    if (!nextState.mapState.center || !nextState.mapState.zoom) {
      return;
    }

    if (this.map.getZoom() !== nextState.mapState.zoom) {
      //don't animate when zoom changes because the animation is a bit janky
      this.map.setView(nextState.mapState.center, nextState.mapState.zoom, {animate: false});
    }
    else {
      this.map.setView(nextState.mapState.center);
    }
  },

  componentDidUpdate() {
    //enable the map listeners after a change
    this.enableMapListeners();
  },

  componentWillUnmount() {
    this.disableMapListeners();
    ThemeMapStateStore.unlisten(this.onMapStateChange);
  },

  onMapViewChange() {
    const center = this.map.getCenter();
    const zoom = this.map.getZoom();
    ThemeMapStateActions.updateMapState({center, zoom});
  },

  onMapStateChange(state) {
    this.setState(state);
  },

  disableMapListeners() {
    this.map.off('zoomend', this.onMapViewChange);
    this.map.off('moveend', this.onMapViewChange);
  },

  enableMapListeners() {
    this.map.on('zoomend', this.onMapViewChange);
    this.map.on('moveend', this.onMapViewChange);
  },

  updateMap(props) {
    // dataRows can have multiple rows for the same EntityId
    // so group them and sum their current year value to make
    // mappable entities features
    const groupedById = R.groupBy(R.prop('EntityId'))(props.data.rows);

    let maxVal = -Infinity;
    let minVal = Infinity;

    const entityFeatures = R.map((group) => {
      // Use the first entity in each group to get the base entity properties
      const entity = R.nth(0, group);
      const valueSum = R.sum(R.pluck(`Value_${props.decade}`)(group));

      if (valueSum > maxVal) { maxVal = valueSum; }
      if (valueSum < minVal) { minVal = valueSum; }

      const entityProperties =  R.assoc('ValueSum', valueSum,
        R.pick(['EntityId', 'EntityName', 'ValueSum'], entity)
      );
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [entity.Longitude, entity.Latitude]
        },
        properties: entityProperties
      };
    })(R.values(groupedById));

    if (this.entitiesLayer && this.map.hasLayer(this.entitiesLayer)) {
      this.map.removeLayer(this.entitiesLayer);
    }

    if (!entityFeatures || entityFeatures.length === 0) {
      return;
    }

    this.entitiesLayer = L.geoJson(entityFeatures, {
      pointToLayer: (feat, latlng) => {
        let radius;
        if (minVal === maxVal) {
          //don't need/can't scale -> just use min radius
          radius = constants.MIN_ENTITY_POINT_RADIUS;
        }
        else {
          radius = scale(feat.properties.ValueSum,
            minVal, maxVal,
            constants.MIN_ENTITY_POINT_RADIUS, constants.MAX_ENTITY_POINT_RADIUS
          );
        }

        return L.circleMarker(latlng, {
          radius: radius,
          className: `entity-marker-${props.theme}`
        });
      },
      onEachFeature: (feat, layer) => {
        layer.bindPopup(feat.properties.EntityName +
          `<br>Sum ${props.decade}: ` +
          feat.properties.ValueSum
        );
      }
    });

    let bounds = this.entitiesLayer.getBounds();

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }
    if (props.boundary) {
      this.boundaryLayer = L.geoJson(props.boundary, {
        style: constants.BOUNDARY_LAYER_STYLE
      });
      console.log(props.boundary);
      console.log(bounds);
      this.map.addLayer(this.boundaryLayer);
      bounds = bounds.extend(this.boundaryLayer.getBounds());
    }

    this.map.addLayer(this.entitiesLayer);
    //TODO: Probably need to modify the fitBounds so that it works across all maps
    // currently all the maps have their bounds dictacted by the last map to render
    // which results in slightly incorrect bounds if the entities differ among the maps
    this.map.fitBounds(bounds);

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