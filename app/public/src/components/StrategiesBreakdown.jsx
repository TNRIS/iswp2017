
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';
import PieChart from './charts/PieChart';
import PropTypes from '../utils/CustomPropTypes';
import {slugify} from '../utils';
import titleize from 'titleize';

const chartOptions = {
  height: '240px'
};

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired
  },

  mixins: [PureRenderMixin],

  render() {
    const viewData = this.props.viewData;

    if (!viewData) {
      return <div/>;
    }

    const decade = this.props.decade;
    const sourceTotals = viewData.strategies.strategySourceTotals;
    const stratTypeTotals = viewData.strategies.strategyTypeTotals;

    //TODO: classNames and associated styling
    //TODO: tooltips

    const sourceTypeChartData = {
      series: R.keys(sourceTotals).map((key) => {
        return {
          name: titleize(key),
          // className: `source-type-${slugify(key).toLowerCase()}`,
          value: sourceTotals[key][decade]
        };
      })
    };

    const stratTypeChartData = {
      series: R.keys(stratTypeTotals).map((key) => {
        return {
          name: titleize(key),
          // className: `source-type-${slugify(key).toLowerCase()}`,
          value: stratTypeTotals[key][decade]
        };
      })
    };

    return (
      <div>
        <h4>Strategy Supplies Breakdown - {decade}</h4>
        <div className="row">
          <div className="five columns">
            Pie of Strategy Source Type
            <PieChart chartData={sourceTypeChartData} chartOptions={chartOptions} />
          </div>
          <div className="seven columns">
            Table of Strategies by Type
            <PieChart chartData={stratTypeChartData} chartOptions={chartOptions} />
          </div>
        </div>
      </div>
    );
  }
});
