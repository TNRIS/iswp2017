/*global L:false*/
/*global OverlappingMarkerSpiderfier:false*/

import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import scale from 'scale-number-range';
import format from 'format-number';
import {Link} from 'react-router-dom';

import CdbUtil from '../../utils/CdbUtil';
import constants from '../../constants';
import history from '../../history';
import CustomPropTypes from '../../utils/CustomPropTypes';
import {getColorForValue, create} from '../../utils/NeedsLegend';
import ThemeMapStateActions from '../../actions/ThemeMapStateActions';
import ThemeMapStateStore from '../../stores/ThemeMapStateStore';

export default class ThemeMap extends React.Component {
    constructor(props) {
        super(props);
        const themeMapStateStore = ThemeMapStateStore.getState();
        this.state = themeMapStateStore;
    }

    componentDidMount = () => {
        const map = this.map = L.map(this.mapDiv, {
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
            map.openPopup(popup);
        });

        map.on('popupopen', function(event) {
            const nodes = event.target._popup._contentNode.childNodes;
            const id = nodes[nodes.length - 2].id;
            L.DomEvent.addListener(L.DomUtil.get(id), 'click', function(e) {
                history.push({
                    pathname: `/${id.split("_")[0]}/${id.split("_")[1]}`
                });
            });
        });

        map.fitBounds(constants.DEFAULT_MAP_BOUNDS);

        L.control.zoom({position: 'topright'}).addTo(this.map);
        L.control.defaultExtent({position: 'topright', text: '', title: 'Zoom to Texas'}).addTo(this.map);

        const toggleLockButton = L.easyButton({
            position: 'topright',
            states: [
                {
                    stateName: 'unlocked',
                    title: 'Lock',
                    icon: 'icon-unlocked',
                    onClick: (btn/* , map */) => {
                        btn.state('locked');
                        ThemeMapStateActions.lockMap();
                    }
                }, {
                    stateName: 'locked',
                    title: 'Unlock',
                    icon: 'icon-locked',
                    onClick: (btn/* , map */) => {
                        btn.state('unlocked');
                        ThemeMapStateActions.unlockMap();
                    }
                }
            ]
        });

        toggleLockButton.addTo(this.map);

        const baseLayer = L.tileLayer(constants.BASE_MAP_LAYER.url, constants.BASE_MAP_LAYER.options);

        map.addLayer(baseLayer);
        CdbUtil.createCountiesLayer().then((result) => {
            this.map.addLayer(L.tileLayer(result.tilesUrl));
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
        ThemeMapStateActions.unlockMap();
        ThemeMapStateActions.hidePrj();
    }

    onMapStateChange = (state) => {
        this.setState(state);
    }

    updateMap = (props) => {
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

            if (valueSum > maxVal) {
                maxVal = valueSum;
            }
            if (valueSum < minVal) {
                minVal = valueSum;
            }

            const npdProps = constants.DECADES.map((d) => `NPD${d}`);

            const entityProperties = R.assoc('ValueSum', valueSum, R.pick(R.concat([
                'EntityId', 'EntityName', 'ValueSum'
            ], npdProps), entity));

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
        //clean source layer if previously used
        if (this.sourceLayer && this.map.hasLayer(this.sourceLayer)) {
            this.map.removeLayer(this.sourceLayer);
        }

        if (this.projectLayer && this.map.hasLayer(this.projectLayer)) {
            this.map.removeLayer(this.projectLayer);
        }

        if (this.legendControl) {
            this.map.removeControl(this.legendControl);
            this.legendControl = null;
        }

        if (!props.boundary && (!entityFeatures || entityFeatures.length === 0)) {
            return;
        }

        //sort the features in reverse so that entities with larger values are
        // rendered beneath those with smaller values
        const sortedFeatures = R.reverse(R.sortBy(R.path(['properties', 'ValueSum']))(entityFeatures));
        const zeroSum = x => x.properties.ValueSum != 0;
        const filteredFeatures = R.filter(zeroSum, sortedFeatures);
        this.entitiesLayer = L.geoJson(filteredFeatures, {
            pointToLayer: (feat, latlng) => {
                let radius;
                if (minVal === maxVal) {
                    //don't need/can't scale -> just use min radius
                    radius = constants.MIN_ENTITY_POINT_RADIUS;
                } else {
                    radius = scale(feat.properties.ValueSum, minVal, maxVal, constants.MIN_ENTITY_POINT_RADIUS, constants.MAX_ENTITY_POINT_RADIUS);
                }

                const markerOpts = {
                    radius: radius,
                    className: `entity-marker-${props.theme}`
                };

                if (props.theme === 'needs') {
                    const npdVal = feat.properties[`NPD${props.decade}`];
                    const color = getColorForValue(npdVal);
                    markerOpts.color = color;
                }

                if (props.theme === 'supplies') {
                    markerOpts.color = '#848484';
                }

                const marker = L.circleMarker(latlng, markerOpts);
                this.spiderfier.addMarker(marker);
                return marker;
            }
        });

        if (props.theme === 'needs') {
            this.legendControl = create();
            this.map.addControl(this.legendControl);
        }

        let bounds = this.entitiesLayer.getBounds();

        if (this.boundaryLayer && this.map.hasLayer(this.boundaryLayer)) {
            this.map.removeLayer(this.boundaryLayer);
        }

        if (props.boundary && !R.isEmpty(props.data.rows)) {
            this.boundaryLayer = L.geoJson(props.boundary, {
                style: constants.THEME_BOUNDARY_LAYER_STYLE,
                pointToLayer: (feature, latlng) => {
                    return L.circleMarker(latlng, constants.THEME_BOUNDARY_LAYER_STYLE)
                }
            });

            this.map.addLayer(this.boundaryLayer);
            bounds = bounds.extend(this.boundaryLayer.getBounds());
        } else if (props.boundary && R.isEmpty(props.data.rows)) {
            bounds = this.map.getBounds();
        }

        if (props.theme === 'strategies' && props.projects != undefined) {
            //handle decade online, only display those coming online before or during the selected decade
            const decades = x => parseInt(x.OnlineDecade) <= parseInt(props.decade);
            const decadeProjects = R.filter(decades, props.projects)

            const projectFeatures = R.map((prj) => {
                const displayCost = prj.CapitalCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                const projectProperties = {
                    'ProjectName': prj.ProjectName,
                    'OnlineDecade': prj.OnlineDecade,
                    'ProjectSponsors': prj.ProjectSponsors,
                    'CapitalCost': "$" + displayCost,
                    'WmsProjectId': prj.WmsProjectId,
                    'DisplayProjectInMap': prj.DisplayProjectInMap
                };

                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [prj.LongCoord, prj.LatCoord]
                    },
                    properties: projectProperties
                };
            })(decadeProjects);

            const icon = L.divIcon({className: 'triangle-marker', html: '<div class="triangle-marker-inner"></div>'});

            this.projectLayer = L.geoJson(projectFeatures, {
                pointToLayer: (feature, latlng) => {
                    const marker = L.marker(latlng, {icon: icon});
                    this.spiderfier.addMarker(marker);
                    return marker;
                },
                filter: (feature) => {
                    return feature.properties.DisplayProjectInMap !== 'N';
                }
            });

            if (this.state.showProjects == "Hide") {
                this.map.addLayer(this.projectLayer);
                bounds = bounds.extend(this.projectLayer.getBounds());
            }
        }

        this.map.addLayer(this.entitiesLayer);

        // use the data rows to organize a list of unique map source IDs. handle logic for which themes to do this.
        try {
            props.boundary.features[0].properties.sourceid != undefined
                ? this.applyBounds(bounds)
                : this.displaySourceLayer(props, bounds);
        } catch (e) {
            this.displaySourceLayer(props, bounds);
        }

    }

    displaySourceLayer = (props, bounds) => {
        if (props.theme === 'supplies' || props.theme === 'strategies') {
            const hasValue = props.data.rows.filter(record => record[`Value_${props.decade}`] > 0);
            const sourceById = R.groupBy(R.prop('MapSourceId'))(hasValue);

            //remove null map source ids
            const sources = R.without("null", R.keys(sourceById));
            //grab the source styles from constants file
            const groundwaterStyle = constants.GROUNDWATER_SOURCE;
            const surfacewaterStyle = constants.SURFACEWATER_SOURCE;
            const isnewStyle = constants.ISNEW_SOURCE;
            const riverwaterStyle = constants.RIVERWATER_SOURCE;
            //use the unique list of map source IDs to query the source dataset on Carto
            if (sources.length != 0) {
                CdbUtil.getSource(sources).then((results) => {
                    //create layer from source dataset response and wire events
                    //?????handle no data returned/bad query
                    this.sourceLayer = L.geoJson(results, {
                        style: function(feature) {
                            switch (feature.properties.sourcetype) {
                                case 'groundwater':
                                    return groundwaterStyle;
                                case 'river':
                                    return riverwaterStyle;
                                case 'indirect':
                                    return riverwaterStyle;
                                default:
                                    switch (feature.properties.isnew) {
                                        case 1:
                                            return isnewStyle;
                                        default:
                                            return surfacewaterStyle;
                                    }
                            }
                        },
                        onEachFeature: (feature, layer) => {
                            const sourceContent = `
                                <h3>${feature.properties.name}</h3>
                                <a id="source_${feature.properties.sourceid}">View Source Page</a>
                            `;
                            layer.bindPopup(sourceContent);
                        },
                        pointToLayer: (feature, latlng) => {
                            return L.circleMarker(latlng, {radius: 8});
                        }
                    });
                    this.sourceLayer.on("mousemove", this.showSourceLabel);
                    this.sourceLayer.on("mouseout", this.hideSourceLabel);
                    //add the layer to the map.
                    this.map.addLayer(this.sourceLayer);
                    this.entitiesLayer.bringToFront();

                    bounds = bounds.extend(this.sourceLayer.getBounds());
                    if (!this.state.isLocked) {
                        this.map.fitBounds(bounds);
                    }

                });
            } else {
                this.applyBounds(bounds);
            }

        } else {
            this.applyBounds(bounds);
        }
    }

    //live handle tooltip/label of source features
    showSourceLabel = (event) => {
        if (!this.label) {
            this.label = new L.Label();
        }
        this.label.setContent(event.layer.feature.properties.name);
        this.label.setLatLng(event.latlng);
        if (!this.map.hasLayer(this.label)) {
            this.map.addLayer(this.label);
        }
    }

    hideSourceLabel = () => {
        if (this.label && this.map.hasLayer(this.label)) {
            this.map.removeLayer(this.label);
            this.label = null;
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

    toggleProjects = () => {
        if (this.state.showProjects == 'Hide') {
            this.map.removeLayer(this.projectLayer);
            ThemeMapStateActions.showPrj();
        } else {
            this.map.addLayer(this.projectLayer);
            ThemeMapStateActions.hidePrj();
        }
    }

    render() {
        return (<div>
            <div className="theme-map" ref={(mapDiv) => {
                    this.mapDiv = mapDiv;
                }}></div>
            <p className="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>
            {
                this.props.theme === 'strategies' && <p className="note">Red triangles indicate capital projects associated with strategy supplies that have been assigned to a Water User Group.{" "}
                        <a className="pointerHover" onClick={this.toggleProjects}>{this.state.showProjects}{" "}Projects</a>
                    </p>
            }
        </div>);
    }
}

ThemeMap.propTypes = {
    theme: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    decade: PropTypes.string,
    boundary: CustomPropTypes.Feature,
    entity: PropTypes.object,
    projects: PropTypes.array
}

ThemeMap.defaultProps = {
    decade: '2020'
}
