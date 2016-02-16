
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import format from 'format-number';
import Emitter from 'wildemitter';
import PivotTable from 'react-pivot';
import hat from 'hat';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import ViewStateStore from '../stores/ViewStateStore';

const themesAndPopulation = R.append('population', constants.THEMES);

function toAnchor(href, text) {
  return `<a href="${href}">${text}</a>`;
}

const dimensions = [
  {
    value: 'EntityName',
    title: 'Entity',
    template: (val, row) => toAnchor(`/entity/${row.entityId}`, val)
  },
  {
    value: 'WugCounty',
    title: 'County',
    template: (val) => toAnchor(`/county/${val}`, val)
  },
  {
    value: 'WugRegion',
    title: 'Region',
    template: (val) => toAnchor(`/region/${val}`, val)
  }
];

const addlStrategyDimensions = [
  {
    value: 'WMSName',
    title: 'Strategy'
  },
  {
    value: 'SourceName',
    title: 'Source'
  }
];

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    const viewState = ViewStateStore.getState().viewState;
    return {
      viewState: viewState,
      activeDimensions: this.getViewDefaultActiveDimensions(viewState),
      sortBy: 'Entity', //TODO: get default based on viewState?
      sortDir: 'asc'
    };
  },

  componentWillMount() {
    this.eventBus = new Emitter;
  },

  componentDidMount() {
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
    this.eventBus.on('activeDimensions', (val) => this.setState({activeDimensions: val}));
    this.eventBus.on('sortBy', (val) => this.setState({sortBy: val}));
    this.eventBus.on('sortDir', (val) => this.setState({sortDir: val}));

    ViewStateStore.listen(this.onViewStateChange);
  },

  componentWillReceiveProps(newProps) {
    const activeDimensions = this.state.activeDimensions;

    //if we are changing to 'strategies' view, then add additional strategy dimensions
    // to activeDimensions
    if (newProps.theme === 'strategies' && this.props.theme !== 'strategies') {
      this.setState({
        activeDimensions: R.concat(activeDimensions, R.pluck('title', addlStrategyDimensions))
      });
    }
    //else remove additional strategy dimensions from activeDimensions
    else if (newProps.theme !== 'strategies') {
      this.setState({
        activeDimensions: R.without(R.pluck('title', addlStrategyDimensions), activeDimensions)
      });
    }
  },

  componentWillUnmount() {
    ViewStateStore.unlisten(this.onViewStateChange);
  },

  onViewStateChange(storeState) {
    this.setState({viewState: storeState.viewState});
  },

  getViewDefaultActiveDimensions(viewState) {
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

    //add additional strategy dimensions to the active dimensions list
    const theme = this.props.theme;
    if (theme === 'strategies') {
      activeDimensions = R.concat(R.pluck('title', addlStrategyDimensions), activeDimensions);
    }

    return activeDimensions;
  },

  render() {
    const viewData = this.props.viewData;
    if (!viewData) {
      return (
        <div />
      );
    }

    const selectedTheme = this.props.theme;
    const tableData = viewData[selectedTheme].rows;
    const decade = this.props.decade;
    const themeTitle = constants.THEME_TITLES[selectedTheme];

    const availableDimensions = R.clone(dimensions);

    const activeDimensions = this.state.activeDimensions;
    const sortBy = this.state.sortBy;
    const sortDir = this.state.sortDir;

    if (selectedTheme === 'strategies') {
      addlStrategyDimensions.forEach((d) => availableDimensions.push(d));
    }

    const reduce = (row, memo) => {
      memo.valueTotal = (memo.valueTotal || 0) + row[`Value_${decade}`];
      memo.entityId = row.EntityId; //save the EntityId so a link can be made
      return memo;
    };

    const calculations = [
      {
        title: `${decade} ${themeTitle}`,
        value: 'valueTotal',
        template: (val) => format()(val)
      }
    ];

    const units = selectedTheme === 'population' ? "people" : "acre-feet/year";

    return (
      <div>
        <h4>
          Raw Data - {decade} - {themeTitle}
          <span className="units">({units})</span>
        </h4>
        <div className="data-table-container">
          <PivotTable
            //assign a unique key to force rerender of table
            // when decade or theme are changed
            // otherwise it will not react to prop changes
            key={hat()}
            eventBus={this.eventBus}
            rows={tableData}
            dimensions={availableDimensions}
            activeDimensions={activeDimensions}
            reduce={reduce}
            calculations={calculations}
            sortBy={sortBy}
            sortDir={sortDir}
            nPaginateRows={50}
          />
        </div>
      </div>
    );
  }
});

