
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';

import constants from '../../constants';
import LineChart from './LineChart';
import ChartLegend from '../ChartLegend';
import ChartDataTable from '../ChartDataTable';

const chartOptions = {
  height: '200px'
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

    const series = constants.THEMES.map((theme) => {
      return {
        name: theme,
        className: `series-${theme}`,
        data: constants.DECADES.map((year) => {
          return this.props.placeData.data[theme].decadeTotals[year];
        })
      };
    });

    const chartData = {
      labels: constants.DECADES,
      series
    };

    const legendEntries = constants.THEMES.map((theme) => {
      return {
        className: `series-${theme}`,
        display: constants.THEME_TITLES[theme]
      };
    });

    //TODO: Legend - place next to end of h4 in .chart-header
    return (
      <div className="row">
        <div className="twelve columns">
          <div className="chart-header">
            <h4>Data Totals</h4>
            <ChartLegend entries={legendEntries} className="u-pull-right" />
          </div>
          <LineChart chartData={chartData} chartOptions={chartOptions} />
          <ChartDataTable className="u-pull-right" />
        </div>
      </div>
    );
  }

});