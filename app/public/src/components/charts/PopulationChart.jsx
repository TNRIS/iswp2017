
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import PropTypes from '../../utils/CustomPropTypes';
import constants from '../../constants';
import LineChart from './LineChart';
import ChartDataTable from '../ChartDataTable';

const chartOptions = {
  height: '100px'
};

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData
  },

  mixins: [PureRenderMixin],

  render() {
    const placeData = this.props.placeData;

    if (!placeData || !placeData.data) {
      return (
        <div />
      );
    }

    const popChartData = {
      labels: constants.DECADES,
      series: [{
        className: 'series-population',
        data: constants.DECADES.map((year) => {
          return R.path(['data', 'population', 'decadeTotals', year], placeData) || 0;
        }),
        meta: 'population',
        name: 'Population'
      }]
    };

    return (
      <div>
        <div className="chart-header">
          <h4>Population</h4>
        </div>
        <LineChart chartData={popChartData} chartOptions={chartOptions} />
        <ChartDataTable className="u-full-width" chartData={popChartData} />
      </div>
    );
  }

});