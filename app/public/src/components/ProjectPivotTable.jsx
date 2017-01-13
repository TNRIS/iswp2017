
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import format from 'format-number';
import Emitter from 'wildemitter';
import PivotTable from 'react-pivot';
import hat from 'hat';

import constants from '../constants';
import {formatCountyName} from '../utils/CountyNames';
import PropTypes from '../utils/CustomPropTypes';
import ViewStateStore from '../stores/ViewStateStore';

function toAnchor(href, text) {
  return `<a href="${href}">${text}</a>`;
}

const commonDimensions = [
  {
    value: 'EntityName',
    title: 'Entity',
    template: (val, row) => toAnchor(`/entity/${row.entityId}`, val)
  },
  {
    value: 'WUGCounty',
    title: 'County',
    template: (val) => toAnchor(`/county/${formatCountyName(val)}`, val)
  },
  {
    value: 'WUGRegion',
    title: 'Region',
    template: (val) => toAnchor(`/region/${val}`, val)
  }
];

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(constants.PRJ_THEMES).isRequired
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

  componentWillUnmount() {
    ViewStateStore.unlisten(this.onViewStateChange);
  },

  onViewStateChange(storeState) {
    this.setState({viewState: storeState.viewState});
  },

  getViewDefaultActiveDimensions(viewState) {
    const activeDimensions = ['Region', 'County', 'Entity'];
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

    const availableDimensions = R.clone(commonDimensions);

    const activeDimensions = this.state.activeDimensions;
    const sortBy = this.state.sortBy;
    const sortDir = this.state.sortDir;

    const reduce = (row, memo) => {
      memo.valueTotal = (memo.valueTotal || 0) + row[`P${decade}`];
      memo.entityId = row.EntityId; //save the EntityId so a link can be made
      return memo;
    };

    const calculations = [
      {
        title: `${decade} Population Benefiting`,
        value: 'valueTotal',
        template: (val) => format()(val)
      }
    ];

    let table = null;
    if (R.isEmpty(tableData)) {
      table = <p> Sorry, there is no population data.</p>;
    } else {
      table = 
        <div className="table-container">
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
        </div>;
    }

    return (
      <div>
        <h4>
          Raw Data - {decade} - Population Benefiting
        </h4>
        {table}
      </div>
    );
  }
});

