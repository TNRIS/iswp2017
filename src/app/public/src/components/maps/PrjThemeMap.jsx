/*global L:false*/
/*global OverlappingMarkerSpiderfier:false*/

import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import format from 'format-number';

import CdbUtil from '../../utils/CdbUtil';
import constants from '../../constants';
import history from '../../history';
import ThemeMapStateActions from '../../actions/ThemeMapStateActions';
import ThemeMapStateStore from '../../stores/ThemeMapStateStore';

export default class PrjThemeMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = ThemeMapStateStore.getState();
  }

  componentDidMount = () => {
    this.map = L.map(this.mapDiv, {
      scrollWheelZoom: false,
      zoomControl: false,
      maxZoom: 11
    });

    this.map.attributionControl.setPrefix('');

    this.spiderfier = new OverlappingMarkerSpiderfier(this.map, {
      keepSpiderfied: true,
      nearbyDistance: 5
    });

    this.spiderfier.addListener('spiderfy', () => {
      this.map.closePopup();
    });

    const popup = L.popup();
    this.spiderfier.addListener('click', (marker) => {
      const props = marker.feature.properties;
      const entityContent = `
        <h3>${props.EntityName}</h3>
        <p>Total Value: ${format()(props.ValueSum)}</p>
        <a id="entity_${props.EntityId}">View Entity Page</a>
      `;
      const projectContent = `
        <h3>${props.ProjectName}</h3>
        <p>Decade Online: ${props.OnlineDecade}</p>
        <p>Sponsor: ${props.ProjectSponsors}</p>
        <p>Capital Cost: ${props.CapitalCost}</p>
        <a id="project_${props.WmsProjectId}">View Project Page</a>
      `;
      const content = props.EntityId ? entityContent : projectContent;
      popup.setContent(content);
      popup.setLatLng(marker.getLatLng());
      this.map.openPopup(popup);
    });

    this.map.on('popupopen', function(event) {
      const nodes = event.target._popup._contentNode.childNodes;
      const id = nodes[nodes.length - 2].id;
      L.DomEvent.addListener(L.DomUtil.get(id), 'click', function(e) {
        history.push({pathname: `/${id.split("_")[0]}/${id.split("_")[1]}`});
      });
    });

    this.map.fitBounds(constants.DEFAULT_MAP_BOUNDS);

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
    this.map.addLayer(baseLayer);
    
    const countiesUrl = CdbUtil.createCountiesLayer();
    const countiesLayer = this.countiesLayer = L.tileLayer(countiesUrl.tilesUrl);
    const countiesLabelsUrl = CdbUtil.createCountiesLabelsLayer();
    const countiesLabelsLayer = this.countiesLabelsLayer = L.tileLayer(countiesLabelsUrl.tilesUrl);

    this.map.addLayer(countiesLayer);
    this.map.on('zoomend', () => {
        if (this.map.getZoom() < 7) {
            this.map.removeLayer(countiesLabelsLayer);
        }
        else {
            this.map.addLayer(countiesLabelsLayer);
        }
    });

    this.updateMap(this.props);

    ThemeMapStateStore.listen(this.onMapStateChange);
  }

  componentWillReceiveProps = (nextProps) => {
    this.updateMap(nextProps);
  }

  componentWillUnmount = () => {
    ThemeMapStateStore.unlisten(this.onMapStateChange);
    this.spiderfier.clearListeners('click');
    this.spiderfier.clearListeners('spiderfy');
    //unlock map state so that the lock button for the next ThemeMap is not in a weird state
    ThemeMapStateActions.unlockMap();
  }

  onMapStateChange = (state) => {
    this.setState(state);
  }

  updateMap = (props) => {
    this.map.closePopup();

    if (this.entitiesLayer && this.map.hasLayer(this.entitiesLayer)) {
      this.map.removeLayer(this.entitiesLayer);
      this.spiderfier.clearMarkers();
    }

    if (this.projectLayer && this.map.hasLayer(this.projectLayer)) {
      this.map.removeLayer(this.projectLayer);
    }
    
    if (!props.project) {
      return;
    }

    let bounds;

      //handle decade online, only display those coming online before or during the selected decade
    if (parseInt(props.decade) >= parseInt(props.project.OnlineDecade)) {
      //build list of features for entities. limit based on decade-online and selected decade
      if (props.data.rows.length > 0) {
        const groupedById = R.groupBy(R.prop('EntityId'))(props.data.rows)
        const entityFeatures = R.map((group) => {
          const decadeField = `P${props.decade}`;
          const prjEntity = R.nth(0, group);
          const valueSum = R.sum(R.pluck(decadeField)(group));

          const entityProperties = {
            EntityName: prjEntity.EntityName,
            EntityId: prjEntity.EntityId,
            ValueSum: valueSum
          };

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [prjEntity.EntityLongCoord, prjEntity.EntityLatCoord]
            },
            properties: entityProperties
          };
        })(R.values(groupedById));

        this.entitiesLayer = L.geoJson(entityFeatures, {
          pointToLayer: (feat, latlng) => {
            const markerOpts = {
              radius: 4,
              className: `entity-marker-${props.theme}`
            };

            const marker = L.circleMarker(latlng, markerOpts);
            this.spiderfier.addMarker(marker);
            return marker;
          }
        });

        bounds = this.entitiesLayer.getBounds();
        this.map.addLayer(this.entitiesLayer);
      }

    
      const prj = props.project;
      const displayCost = prj.CapitalCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      const projectProperties = {
        'ProjectName': prj.ProjectName,
        'OnlineDecade': prj.OnlineDecade,
        'ProjectSponsors': prj.ProjectSponsors,
        'CapitalCost': "$" + displayCost,
        'WmsProjectId': prj.WmsProjectId
      };

      const projectFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [prj.LongCoord, prj.LatCoord]
        },
        properties: projectProperties
      };

      const icon = L.divIcon({
        className: 'triangle-marker',
        html: '<div class="triangle-marker-inner"></div>'
      });

      this.projectLayer = L.geoJson(projectFeature, {
        pointToLayer: (feature, latlng) => {
          const marker = L.marker(latlng, {
            icon: icon
          });
          this.spiderfier.addMarker(marker);
          return marker;
        },
        filter: (feature) => {
          return feature.properties.DisplayProjectInMap !== 'N';
        }
      });

      this.map.addLayer(this.projectLayer);
      if (bounds) {
        bounds = bounds.extend(this.projectLayer.getBounds());
      } else {
        bounds = this.projectLayer.getBounds();
      }
    }

    if (!bounds) {
      this.map.fitBounds(constants.DEFAULT_MAP_BOUNDS);
    } else {
      this.applyBounds(bounds);
    }

  }

  applyBounds = (bounds) => {
    if (!this.state.isLocked) {
      if (bounds._southWest == undefined) {
        this.map.fitBounds(constants.DEFAULT_MAP_BOUNDS);
        return;
      }
      this.map.fitBounds(bounds);
      if (this.props.entity) {
        this.map.setZoom(12);
      }
    }
  }

  render() {
    return (
      <div>
        <div className="theme-map" ref={(mapDiv) => {this.mapDiv = mapDiv;}}></div>
        <p className="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>
        <p className="note">Red triangles indicate capital projects. If a water user group does not display with the selected project, the project is not currently assigned to a specific water user group.</p>
      </div>
    );
  }
}

PrjThemeMap.propTypes = {
  theme: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  decade: PropTypes.string,
  project: PropTypes.object
};

PrjThemeMap.defaultProps = {
  decade: '2020'
};