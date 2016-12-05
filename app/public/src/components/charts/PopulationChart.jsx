
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import format from 'format-number';

import constants from '../../constants';
import ChartDataTable from '../ChartDataTable';
import LineChart from './LineChart';
import PropTypes from '../../utils/CustomPropTypes';

const chartOptions = {
  height: '100px',
  lineSmooth: false,
  axisY: {
    low: 0,
    labelInterpolationFnc: format()
  }
};

export default React.createClass({
  propTypes: {
    viewData: PropTypes.SrcViewData
  },

  mixins: [PureRenderMixin],

  render() {
    const viewData = this.props.viewData;

    if (!viewData) {
      return (
        <div />
      );
    }

    const popChartData = {
      labels: constants.DECADES,
      series: [{
        className: 'series-population',
        data: constants.DECADES.map((year) => {
          return R.path(['population', 'decadeTotals', year], viewData) || 0;
        }),
        meta: 'population',
        name: 'Population'
      }]
    };

    return (
      <div>
        <div className="chart-header">
          <h5>Population</h5>
        </div>
        <LineChart chartData={popChartData} chartOptions={chartOptions} />
        <ChartDataTable className="u-full-width" chartData={popChartData} omitLabels />
      </div>
    );
  }

});