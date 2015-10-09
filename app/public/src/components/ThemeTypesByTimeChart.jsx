
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';

import constants from '../constants';
import LineChart from './LineChart';
import ChartLegend from './ChartLegend';

const chartOptions = {
  height: '240px'
};

export default React.createClass({
  propTypes: {
    placeData: React.PropTypes.object
  },

  mixins: [PureRenderMixin],

  render() {
    if (!this.props.placeData || !this.props.placeData.data) {
      return (
        <Spinner spinnerName="double-bounce" />
      );
    }

    const theme = 'demands';
    const themeTitle = constants.THEME_TITLES[theme];

    const chartData = {
      labels: constants.DECADES,
      series: constants.DECADES.map((year) => {
        return constants.USAGE_TYPES.map((type) => {
          if (this.props.placeData.data[theme].typeTotals[type]) {
            return this.props.placeData.data[theme].typeTotals[type][`Total_${year}`];
          }
          return 0;
        });
      })
    };

    return (
      <div className="row">
        <div className="twelve columns">
          <div className="chart-header">
            <h4>{themeTitle} by Usage Type</h4>
            <ChartLegend />
          </div>
          <div>Select Theme: Demands | Supplies | Needs | Strategy Supplies</div>
          <LineChart
            chartData={chartData}
            chartOptions={chartOptions} />
        </div>
      </div>
    );
  }
});