
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import titleize from 'titleize';

import ChartDataTable from '../ChartDataTable';
import UsageTypeChartLegend from '../UsageTypeChartLegend';
import constants from '../../constants';
import LineChart from './LineChart';
import PropTypes from '../../utils/CustomPropTypes';
import ThemeSelector from '../ThemeSelector';
import TitlePlugin from '../../utils/ChartistAxisTitlePlugin';
import Units from '../Units';
import utils from '../../utils';

const chartOptions = {
  height: '240px',
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

  getInitialState() {
    return {
      selectedTheme: R.nth(0, constants.THEMES)
    };
  },

  selectTheme(theme) {
    this.setState({selectedTheme: theme});
  },

  render() {
    const viewData = this.props.viewData;

    if (!viewData) {
      return (
        <div />
      );
    }

    const chartData = {
      labels: constants.DECADES,
      // reverse USAGE_TYPES so that the lines z-indices are in official order
      series: R.reverse(constants.USAGE_TYPES).map((type) => {
        return {
          name: titleize(type),
          meta: type.toLowerCase(),
          className: `series-${utils.slugify(type.toLowerCase())}`,
          data: constants.DECADES.map((year) => {
            if (R.path([this.state.selectedTheme, 'typeTotals', type], viewData)) {
              return viewData[this.state.selectedTheme].typeTotals[type][year];
            }
            return 0;
          })
        };
      })
    };

    return (
      <div>
        <div className="chart-header">
          <h4>
            {constants.THEME_TITLES[this.state.selectedTheme]} by Usage Type
            <Units />
          </h4>
          <UsageTypeChartLegend className="u-pull-right legend-types-by-decade" />
        </div>
        <div className="u-cf u-full-width">
          <ThemeSelector onSelect={this.selectTheme} value={this.state.selectedTheme} />
        </div>
        <LineChart chartData={chartData} chartOptions={chartOptions} />
        <ChartDataTable className="u-full-width" chartData={chartData} showTotals />
      </div>
    );
  }
});