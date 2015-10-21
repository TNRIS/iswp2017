import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

import PropTypes from '../../utils/CustomPropTypes';
import constants from '../../constants';
import BarChart from './BarChart';
import ChartLegend from '../ChartLegend';
import ChartDataTable from '../ChartDataTable';

//TODO: maybe shade area between demands and existing supplies in red
//TODO: normalize to all be on the y-axis?
const chartOptions = {
  height: '200px'
};

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData
  },

  mixins: [PureRenderMixin],

  render() {
    if (!this.props.placeData || !this.props.placeData.data) {
      return (
        <Spinner spinnerName="double-bounce" />
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
            if (this.props.placeData.data[theme].typeTotals[type]) {
              return this.props.placeData.data[theme].typeTotals[type][`Total_${year}`];
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
          <h4>Data by Usage Type</h4>
          <ChartLegend className="u-pull-right" entries={legendEntries} />
        </div>
        {everyTwoTypes.map(([groupOne, groupTwo], i) => {
          const groupOneData = {labels: constants.DECADES, series: seriesByType[groupOne]};
          const groupTwoData = {labels: constants.DECADES, series: seriesByType[groupTwo]};
          return (
            <div className="row" key={i}>
              <div className="six columns">
                <h5>{titleize(groupOne)}</h5>
                <BarChart
                  chartData={groupOneData}
                  chartOptions={chartOptions} />
                <ChartDataTable className="u-full-width" chartData={groupOneData} />
              </div>
              <div className="six columns">
                <h5>{titleize(groupTwo)}</h5>
                <BarChart
                  chartData={groupTwoData}
                  chartOptions={chartOptions} />
                <ChartDataTable className="u-full-width" chartData={groupTwoData} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
});