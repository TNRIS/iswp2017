
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {Link} from 'react-router';
import titleize from 'titleize';
import format from 'format-number';
import PivotTable from 'babel!react-pivot'; //must use babel loader directly

import utils from '../utils';
import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import DecadeChoiceStore from '../stores/DecadeChoiceStore';
import ThemeSelector from './ThemeSelector';

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [LinkedStateMixin, PureRenderMixin],

  getInitialState() {
    return {
      selectedDecade: DecadeChoiceStore.getState().selectedDecade,
      selectedTheme: R.nth(0, R.keys(constants.THEME_TITLES)),
      tableFilter: ''
    };
  },

  componentDidMount() {
    DecadeChoiceStore.listen(this.onDecadeChange);
  },

  componentWillUnmount() {
    DecadeChoiceStore.unlisten(this.onDecadeChange);
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
    // const themeTitle = constants.THEME_TITLES[this.state.selectedTheme];

    const dimensions = [
      {value: 'EntityName', title: 'Entity Name'}, //can use template prop to make links
      {value: 'WugCounty', title: 'County'},
      {value: 'WugRegion', title: 'Region'}
    ];

    const reduce = (row, memo) => {
      memo.valueTotal = (memo.valueTotal || 0) + row[`Value_${2020}`];
      return memo;
    };

    const calculations = [
      {
        title: `${decade} Total`,
        value: 'valueTotal',
        template: (val) => format()(val)
      }
    ];

    return (
      <div>
        <h4>Raw Data - {decade}</h4>
        <ThemeSelector onSelect={this.selectTheme} value={this.state.selectedTheme} />
        <div className="data-table-container">
          <PivotTable
            //assign a unique key to force rerender of table
            // otherwise it will not react to prop changes
            key={utils.uuid()}
            rows={tableData}
            dimensions={dimensions}
            reduce={reduce}
            calculations={calculations}
            activeDimensions={['Region', 'County', 'Entity Name']}
            nPaginateRows={50}
          />
        </div>
      </div>
    );
  }
});

