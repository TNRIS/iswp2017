/*global L:false*/
/*global OverlappingMarkerSpiderfier:false*/

import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import scale from 'scale-number-range';
import format from 'format-number';

import CdbUtil from '../../utils/CdbUtil';
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
    const map = this.map = L.map(this.refs.map, {
      scrollWheelZoom: false,
      zoomControl: false
    });

    this.map.attributionControl.setPrefix('');

    this.spiderfier = new OverlappingMarkerSpiderfier(map, {
      keepSpiderfied: true,
      nearbyDistance: 5
    });

    this.spiderfier.addListener('spiderfy', () => {
      map.closePopup();
    });

    const popup = L.popup();
    this.spiderfier.addListener('click', (marker) => {
      const props = marker.feature.properties;
      const content = `
        <h3>${props.EntityName}</h3>
        <p>Total Value: ${format()(props.ValueSum)}</p>
        <a href="/entity/${props.EntityId}">View Entity Page</a>
      `;
      popup.setContent(content);
      popup.setLatLng(marker.getLatLng());
      map.openPopup(popup);
    });

    map.fitBounds(constants.DEFAULT_MAP_BOUNDS);

    L.control.zoom({position: 'topright'}).addTo(this.map);
    L.control.defaultExtent({
      position: 'topright',
      text: '',
      title: 'Zoom to Texas'
    }).addTo(this.map);

    const toggleLockButton = L.easyButton({
      position: 'topright',
      states: [{
        stateName: 'unlocked',
        title: 'Lock',
        icon: 'icon-unlocked',
        onClick: (btn /*, map*/) => {
          btn.state('locked');
          ThemeMapStateActions.lockMap();
        }
      }, {
        stateName: 'locked',
        title: 'Unlock',
        icon: 'icon-locked',
        onClick: (btn /*, map*/) => {
          btn.state('unlocked');
          ThemeMapStateActions.unlockMap();
        }
      }]
    });

    toggleLockButton.addTo(this.map);

    const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url,
      constants.BASE_MAP_LAYER.options
    );

    map.addLayer(baseLayer);
    CdbUtil.createCountiesLayer()
      .then((result) => {
        this.map.addLayer(L.tileLayer(result.tilesUrl));
      });

    this.updateMap(this.props);

    ThemeMapStateStore.listen(this.onMapStateChange);
  },

  componentWillReceiveProps(nextProps) {
    this.updateMap(nextProps);
  },

  componentWillUnmount() {
    ThemeMapStateStore.unlisten(this.onMapStateChange);
    this.spiderfier.clearListeners('click');
    this.spiderfier.clearListeners('spiderfy');
    //unlock map state so that the lock button for the next ThemeMap is not in a weird state
    ThemeMapStateActions.unlockMap();
  },

  onMapStateChange(state) {
    this.setState(state);
  },

  updateMap(props) {
    this.map.closePopup();
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

      const npdProps = constants.DECADES.map((d) => `NPD${d}`);

      const entityProperties =  R.assoc('ValueSum', valueSum,
        R.pick(R.concat(['EntityId', 'EntityName', 'ValueSum'], npdProps),
        entity
      ));
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
      this.spiderfier.clearMarkers();
    }

    if (!entityFeatures || entityFeatures.length === 0) {
      return;
    }

    //sort the features in reverse so that entities with larger values are
    // rendered beneath those with smaller values
    const sortedFeatures = R.reverse(
      R.sortBy(R.path(['properties', 'ValueSum']))(entityFeatures)
    );

    //clean source layer if previously used
    if (this.sourceLayer && this.map.hasLayer(this.sourceLayer)) {
      this.map.removeLayer(this.sourceLayer);
    }
    // use the data rows to organize a list of unique map source IDs. handle logic for which themes to do this.
    if (props.theme === 'supplies' || props.theme === 'strategies') {
      const sourceById = R.groupBy(R.prop('MapSourceId'))(props.data.rows);
      //remove null map source ids
      const sources = R.without("null", R.keys(sourceById));
      //use the unique list of map source IDs to query the source dataset on Carto
      if (sources.length != 0) {
        CdbUtil.getSource(sources)
        .then((results) => {
          //create layer from source dataset response and wire events
          //?????handle no data returned/bad query
          this.sourceLayer = L.geoJson(results, {
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "#0033ff",
                color: "#0033ff",
                weight: 5,
                opacity: .5,
                fillOpacity: 0.2
              });
            }
          });
          this.sourceLayer.on("mousemove", this.showSourceLabel);
          this.sourceLayer.on("mouseout", this.hideSourceLabel);
          //add the layer to the map. 
          this.map.addLayer(this.sourceLayer);
          this.entitiesLayer.bringToFront();
        });
      }
    }

    this.entitiesLayer = L.geoJson(sortedFeatures, {
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

        const markerOpts = {
          radius: radius,
          className: `entity-marker-${props.theme}`
        };

        if (props.theme === 'needs') {
          const npdVal = feat.properties[`NPD${props.decade}`];
          const color = NeedsLegend.getColorForValue(npdVal);
          markerOpts.color = color;
        }

        const marker = L.circleMarker(latlng, markerOpts);
        this.spiderfier.addMarker(marker);
        return marker;
      }
    });

    if (this.legendControl) {
      this.map.removeControl(this.legendControl);
      this.legendControl = null;
    }

    if (props.theme === 'needs') {
      this.legendControl = NeedsLegend.create();
      this.map.addControl(this.legendControl);
    }

    let bounds = this.entitiesLayer.getBounds();

    if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
      this.map.removeLayer(this.boundaryLayer);
    }
    if (props.boundary) {
      this.boundaryLayer = L.geoJson(props.boundary, {
        style: constants.BOUNDARY_LAYER_STYLE
      });

      this.map.addLayer(this.boundaryLayer);
      bounds = bounds.extend(this.boundaryLayer.getBounds());
    }

    this.map.addLayer(this.entitiesLayer);

    if (!this.state.isLocked) {
      this.map.fitBounds(bounds);
    }
  },

  //live handle tooltip/label of source features
  showSourceLabel(event) {
    if (!this.label) {
      this.label = new L.Label();
    }
    this.label.setContent(event.layer.feature.properties.name);
    this.label.setLatLng(event.latlng);
    if (!this.map.hasLayer(this.label)) {
      this.map.addLayer(this.label);
    }
  },

  hideSourceLabel() {
    if (this.label && this.map.hasLayer(this.label)) {
      this.map.removeLayer(this.label);
      this.label = null;
    }
  },

  render() {
    return (
      <div>
        <div className="theme-map" ref="map"></div>
        <p className="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>
      </div>
    );
  }
});