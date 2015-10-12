
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

import constants from '../../constants';
import LineChart from './LineChart';
import ChartLegend from '../ChartLegend';
import ChartDataTable from '../ChartDataTable';

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
      series: constants.USAGE_TYPES.map((type) => {
        return {
          name: type,
          className: `series-${type.toLowerCase()}`,
          data: constants.DECADES.map((year) => {
            if (this.props.placeData.data[theme].typeTotals[type]) {
              return this.props.placeData.data[theme].typeTotals[type][`Total_${year}`];
            }
            return 0;
          })
        };
      })
    };

    const legendEntries = constants.USAGE_TYPES.map((type) => {
      return {
        className: `series-${type}`,
        display: titleize(type)
      };
    });

    return (
      <div className="row">
        <div className="twelve columns">
          <div className="chart-header">
            <h4>{themeTitle} by Usage Type</h4>
            <ChartLegend entries={legendEntries} className="u-pull-right" />
          </div>
          <div>Select Theme: Demands | Supplies | Needs | Strategy Supplies</div>
          <LineChart chartData={chartData} chartOptions={chartOptions} />
          <ChartDataTable className="u-pull-right" />
        </div>
      </div>
    );
  }
});