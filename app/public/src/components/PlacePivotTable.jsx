
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import format from 'format-number';
import hat from 'hat';
import PivotTable from 'babel!react-pivot'; //must use babel loader directly

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import ViewChoiceStore from '../stores/ViewChoiceStore';
import ThemeSelector from './ThemeSelector';

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [LinkedStateMixin, PureRenderMixin],

  getInitialState() {
    return {
      selectedDecade: ViewChoiceStore.getState().selectedDecade,
      selectedTheme: R.nth(0, constants.THEMES),
      tableFilter: ''
    };
  },

  componentDidMount() {
    ViewChoiceStore.listen(this.onDecadeChange);
  },

  componentWillUnmount() {
    ViewChoiceStore.unlisten(this.onDecadeChange);
  },

  onDecadeChange(storeState) {
    this.setState({selectedDecade: storeState.selectedDecade});
  },

  selectTheme(theme) {
    this.setState({selectedTheme: theme});
  },

  render() {
    //TODO: Show all decades for selected theme in the table?
    const viewData = this.props.viewData;
    if (!viewData) {
      return (
        <div />
      );
    }

    const tableData = viewData[this.state.selectedTheme].rows;
    const decade = this.state.selectedDecade;
    const themeTitle = constants.THEME_TITLES[this.state.selectedTheme];

    const toAnchor = (href, text) => {
      return `<a href="${href}">${text}</a>`;
    };

    const dimensions = [
      {
        value: 'EntityName',
        title: 'Entity Name',
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

    return (
      <div>
        <h4>Raw Data - {decade}</h4>
        <ThemeSelector onSelect={this.selectTheme} value={this.state.selectedTheme} includePopulation />
        <div className="data-table-container">
          <PivotTable
            //assign a unique key to force rerender of table
            // otherwise it will not react to prop changes
            key={hat()}
            rows={tableData}
            dimensions={dimensions}
            reduce={reduce}
            calculations={calculations}
            sortBy={'Entity Name'}
            activeDimensions={['Region', 'County', 'Entity Name']}
            nPaginateRows={50}
          />
        </div>
      </div>
    );
  }
});

