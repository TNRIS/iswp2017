
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import format from 'format-number';
import hat from 'hat';
import PivotTable from 'babel!react-pivot'; //must use babel loader directly

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import ViewChoiceStore from '../stores/ViewChoiceStore';

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [LinkedStateMixin, PureRenderMixin],

  getInitialState() {
    return ViewChoiceStore.getState();
  },

  componentDidMount() {
    ViewChoiceStore.listen(this.onChoiceChange);
  },

  componentWillUnmount() {
    ViewChoiceStore.unlisten(this.onChoiceChange);
  },

  onChoiceChange(state) {
    this.setState(state);
  },

  render() {
    //TODO: Show all decades for selected theme in the table?
    const viewData = this.props.viewData;
    if (!viewData) {
      return (
        <div />
      );
    }

    const selectedTheme = this.state.selectedTheme;
    const tableData = viewData[this.state.selectedTheme].rows;
    const decade = this.state.selectedDecade;
    const themeTitle = constants.THEME_TITLES[this.state.selectedTheme];

    const toAnchor = (href, text) => {
      return `<a href="${href}">${text}</a>`;
    };

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
            // otherwise it will not react to prop changes
            key={hat()}
            rows={tableData}
            dimensions={dimensions}
            reduce={reduce}
            calculations={calculations}
            sortBy={'Entity'}
            activeDimensions={['Region', 'County', 'Entity']}
            nPaginateRows={50}
          />
        </div>
      </div>
    );
  }
});

