import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import format from 'format-number';
import Emitter from 'wildemitter';
import PivotTable from 'react-pivot';
import hat from 'hat';

import constants from '../constants';
import {formatCountyName} from '../utils/CountyNames';
import CustomPropTypes from '../utils/CustomPropTypes';
import Units from './Units';
import ViewStateStore from '../stores/ViewStateStore';

const themesAndPopulation = R.append('population', constants.THEMES);

function toAnchor(href, text) {
    return `<a href="${href}">${text}</a>`;
}

/**
 * Function to check for mapSourceId and return anchor or plain text
 * @param  {int | none} mapSourceId       ID of mapSource if exists
 * @param  {string}     mapSourceName     name of the map source
 * @return {func | string}                returns the anchor function or name of source
 */
function mapSourceAnchor(MapSourceId, MapSourceName) {
    if (MapSourceId && MapSourceName !== 'DIRECT REUSE') {
        return toAnchor(`/source/${MapSourceId}`, MapSourceName)
    }
    return (MapSourceName)
}

/**
 * Function to return anchor for wmsID
 * @param  {int | none} wmsId             ID of mapSource if exists
 * @param  {string}     wmsName           name of the wms
 * @return {func | string}                returns the anchor function or name of wms
 */
function strategyAnchor(WmsId, WmsName) {
    if (WmsId) {
        return toAnchor(`/wms/${WmsId}`, WmsName)
    }
    return (WmsName)
}

const commonDimensions = [
    {
        value: 'EntityName',
        title: 'Entity',
        template: (val, row) => toAnchor(`/entity/${row.entityId}`, val)
    }, {
        value: 'WugCounty',
        title: 'County',
        template: (val) => toAnchor(`/county/${formatCountyName(val)}`, val)
    }, {
        value: 'WugRegion',
        title: 'Region',
        template: (val) => toAnchor(`/region/${val}`, val)
    }
];

export default class PlacePivotTable extends React.PureComponent {

    constructor(props) {
        super(props);
        const viewState = ViewStateStore.getState().viewState;
        this.state = {
            viewState: viewState,
            activeDimensions: this.getViewDefaultActiveDimensions(viewState),
            sortBy: 'Entity', // TODO: get default based on viewState?
            sortDir: 'asc'
        }
    }

    componentWillMount = () => {
        this.eventBus = new Emitter;
    }

    componentDidMount = () => {
        this.eventBus.on('activeDimensions', (dims) => {
            //if the current SortBy dimension is not in the new activeDimensions,
            // then sortBy the first item in the new activeDimensions
            const currSortBy = this.state.sortBy;
            if (dims.indexOf(currSortBy) < 0) {
                this.setState({
                    sortBy: dims[0] || null,
                    sortDir: 'asc'
                });
            }
        });
        this.eventBus.on('activeDimensions', (val) => {
            this.setState({activeDimensions: val})
        });
        this.eventBus.on('sortBy', (val) => this.setState({sortBy: val}));
        this.eventBus.on('sortDir', (val) => this.setState({sortDir: val}));

        ViewStateStore.listen(this.onViewStateChange);
    }

    componentWillReceiveProps = (newProps) => {
        let newActive = R.clone(this.state.activeDimensions);

        const isSameTheme = newProps.theme === this.props.theme;
        const additionalDimensions = this.getAdditionalDimensions();
        const hasNewAdditional = !!additionalDimensions[newProps.theme];
        const hasOldAdditional = !!additionalDimensions[this.props.theme];

        if (isSameTheme) {
            //do nothing
            return;
        }

        //else if the theme has changed...

        // and there are previous additional dimensions, then remove them
        if (hasOldAdditional) {
            const oldTheme = this.props.theme;
            newActive = R.without(R.pluck('title', additionalDimensions[oldTheme]), newActive);
        }

        // and after removal, if there are new additional dimensions, then add them
        if (hasNewAdditional) {
            newActive = R.concat(newActive, R.pluck('title', additionalDimensions[newProps.theme]));
        }

        // finally save the newActive dimensions into state
        this.setState({activeDimensions: newActive});
    }

    componentWillUnmount = () => {
        ViewStateStore.unlisten(this.onViewStateChange);
    }

    onViewStateChange = (storeState) => {
        this.setState({viewState: storeState.viewState});
    }

    getViewDefaultActiveDimensions = (viewState) => {
        const view = viewState.view;
        let activeDimensions = [];
        switch (view) {
            case 'region':
                activeDimensions = ['County', 'Entity'];
                break;
            case 'county':
                activeDimensions = ['Region', 'Entity'];
                break;
            case 'usagetype':
                activeDimensions = ['Entity'];
                break;
            default:
                activeDimensions = ['Region', 'County', 'Entity'];
        }

        //add additional dimensions to the active dimensions list
        const theme = this.props.theme;
        const additionalDimensions = this.getAdditionalDimensions();

        if (additionalDimensions[theme]) {
            activeDimensions = R.concat(R.pluck('title', additionalDimensions[theme]), activeDimensions);
        }

        return activeDimensions;
    }

    getAdditionalDimensions = () => {
        if (this.props.view === 'wmsType') {
            return {
                supplies: [
                    {
                        value: 'SourceName',
                        title: 'Source',
                        // added mapSourceId to row through reduce (memo)
                        template: (val, row) => mapSourceAnchor(row.mapSourceId, val)
                    }
                ],
                strategies: [
                    {
                        value: 'WmsType',
                        title: 'WMS Type',
                        template: (val) => toAnchor(`/wmstype/${val}`, val)
                    }, {
                        value: 'WmsName',
                        title: 'Strategy',
                        // added wmsId to row through reduce (memo)
                        template: (val, row) => strategyAnchor(row.WmsId, val)
                    }, {
                        value: 'SourceName',
                        title: 'Source',
                        // added mapSourceId to row through reduce (memo)
                        template: (val, row) => mapSourceAnchor(row.MapSourceId, val)
                    }
                ]
            };
        } else {
            return {
                supplies: [
                    {
                        value: 'SourceName',
                        title: 'Source',
                        // added mapSourceId to row through reduce (memo)
                        template: (val, row) => mapSourceAnchor(row.MapSourceId, val)
                    }
                ],
                strategies: [
                    {
                        value: 'WmsName',
                        title: 'Strategy',
                        // added wmsId to row through reduce (memo)
                        template: (val, row) => strategyAnchor(row.WmsId, val)
                    }, {
                        value: 'WmsType',
                        title: 'WMS Type',
                        template: (val) => toAnchor(`/wmstype/${val}`, val)
                    }, {
                        value: 'SourceName',
                        title: 'Source',
                        // added mapSourceId to row through reduce (memo)
                        template: (val, row) => mapSourceAnchor(row.MapSourceId, val)
                    }
                ]
            };
        }
    }

    render() {
        const viewData = this.props.viewData;
        if (!viewData) {
            return (<div/>);
        }

        const selectedTheme = this.props.theme;
        const tableData = viewData[selectedTheme].rows;
        const decade = this.props.decade;
        const themeTitle = constants.THEME_TITLES[selectedTheme];

        const availableDimensions = R.clone(commonDimensions);

        const activeDimensions = this.state.activeDimensions;
        const sortBy = this.state.sortBy;
        const sortDir = this.state.sortDir;
        const additionalDimensions = this.getAdditionalDimensions();

        if (additionalDimensions[selectedTheme]) {
            additionalDimensions[selectedTheme].forEach((d) => {
                availableDimensions.push(d);
            });
        }

        const reduce = (row, memo) => {
            memo.valueTotal = (memo.valueTotal || 0) + row[`Value_${decade}`];
            memo.entityId = row.EntityId; //save the EntityId so a link can be made
            memo.MapSourceId = row.MapSourceId
            memo.WmsId = row.WmsId
            return memo;
        };

        const calculations = [
            {
                title: `${decade} ${themeTitle}`,
                value: 'valueTotal',
                template: (val) => format()(val)
            }
        ];

        let table = null;
        if (R.isEmpty(tableData)) {
            table = <p>
                Sorry, there is no {themeTitle} data.
            </p>;
        } else {
            table = <div className="table-container">
                <PivotTable
                    // assign a unique key to force rerender of table

                    // when decade or theme are changed

                    // otherwise it will not react to prop changes
                    key={hat()} eventBus={this.eventBus} rows={tableData} dimensions={availableDimensions} activeDimensions={activeDimensions} reduce={reduce} calculations={calculations} sortBy={sortBy} sortDir={sortDir} nPaginateRows={50}/>
            </div>;
        }

        return (<div>
            <h4>
                Raw Data{" "}-{" "}{decade}{" "}-{" "}{themeTitle}
                <Units theme={selectedTheme}/>
            </h4>
            {table}
        </div>);
    }
}

PlacePivotTable.propTypes = {
    view: PropTypes.string,
    viewData: CustomPropTypes.ViewData,
    decade: PropTypes.oneOf(constants.DECADES).isRequired,
    theme: PropTypes.oneOf(themesAndPopulation).isRequired
}
