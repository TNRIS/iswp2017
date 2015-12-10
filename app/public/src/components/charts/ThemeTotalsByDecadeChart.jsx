
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import PropTypes from '../../utils/CustomPropTypes';
import constants from '../../constants';
import BarChart from './BarChart';
import ChartLegend from '../ChartLegend';
import ChartDataTable from '../ChartDataTable';

const chartOptions = {
  height: '200px'
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
          <h4>Totals by Decade</h4>
          <ChartLegend entries={legendEntries} className="u-pull-right" />
        </div>
        <BarChart chartData={chartData} chartOptions={chartOptions} />
        <ChartDataTable className="u-full-width" chartData={chartData} alwaysVisible />
      </div>
    );
  }

});