
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import titleize from 'titleize';


import BarChart from './BarChart';
import ChartLegend from '../ChartLegend';
import ChartDataTable from '../ChartDataTable';
import UsageTypeIcon from '../UsageTypeIcon';
import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import TitlePlugin from '../../utils/ChartistAxisTitlePlugin';
import Units from '../Units';
import {slugify} from '../../utils';

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

    const seriesByType = {};

    constants.USAGE_TYPES.forEach((type) => {
      seriesByType[type] = constants.THEMES.map((theme) => {
        return {
          name: constants.THEME_TITLES[theme],
          meta: theme,
          className: `series-${theme}`,
          data: constants.DECADES.map((year) => {
            if (R.path([theme, 'typeTotals', type], viewData)) {
              return viewData[theme].typeTotals[type][year];
            }
            return 0;
          })
        };
      });
    });

    const legendEntries = constants.THEMES.map((theme) => {
      return {
        className: `series-${theme}`,
        display: constants.THEME_TITLES[theme]
      };
    });

    const everyTwoTypes = R.splitEvery(2, constants.USAGE_TYPES);

    return (
      <div>
        <div className="chart-header">
          <h4>
            Data by Usage Type
            <Units />
          </h4>
          <ChartLegend rectangle className="u-pull-right" entries={legendEntries} />
        </div>
        <div className="clear-float u-full-width">
          {
            everyTwoTypes.map(([groupOne, groupTwo], i) => {
              const groupOneData = {labels: constants.DECADES, series: seriesByType[groupOne]};
              const groupTwoData = {labels: constants.DECADES, series: seriesByType[groupTwo]};
              return (
                <div className="row" key={i}>
                  <div className="six columns wide type-chart-container">
                    <UsageTypeIcon type={groupOne} />
                    <h5 className={`heading-${slugify(groupOne.toLowerCase())}`}>
                      {titleize(groupOne)}
                    </h5>
                    <BarChart
                      chartData={groupOneData}
                      chartOptions={chartOptions} />
                    <ChartDataTable className="u-full-width" chartData={groupOneData} />
                  </div>
                  <div className="six columns wide type-chart-container">
                    <UsageTypeIcon type={groupTwo} />
                    <h5 className={`heading-${slugify(groupTwo.toLowerCase())}`}>
                      {titleize(groupTwo)}
                    </h5>
                    <BarChart
                      chartData={groupTwoData}
                      chartOptions={chartOptions} />
                    <ChartDataTable className="u-full-width" chartData={groupTwoData} />
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
});
