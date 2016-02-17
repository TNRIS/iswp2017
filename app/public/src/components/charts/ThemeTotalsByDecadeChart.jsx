
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import BarChart from './BarChart';
import ChartDataTable from '../ChartDataTable';
import ChartLegend from '../ChartLegend';
import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import TitlePlugin from '../../utils/ChartistAxisTitlePlugin';
import Units from '../Units';

const chartOptions = {
  height: '200px',
  plugins: [
    TitlePlugin({
      axisY: {
        axisTitle: 'acre-feet/year'
      }
    })
  ]
};

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [PureRenderMixin],

  render() {
    const viewData = this.props.viewData;

    if (!viewData) {
      return (
        <div />
      );
    }

    const series = constants.THEMES.map((theme) => {
      return {
        name: constants.THEME_TITLES[theme],
        meta: theme,
        className: `series-${theme}`,
        data: constants.DECADES.map((year) => {
          if (R.path([theme, 'decadeTotals'], viewData)) {
            return viewData[theme].decadeTotals[year];
          }
          return null;
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

    return (
      <div>
        <div className="chart-header">
          <h4>
            Totals by Decade
            <Units />
          </h4>
          <ChartLegend entries={legendEntries} rectangle className="u-pull-right" />
        </div>
        <BarChart chartData={chartData} chartOptions={chartOptions} />
        <ChartDataTable className="u-full-width" chartData={chartData} alwaysVisible />
      </div>
    );
  }

});