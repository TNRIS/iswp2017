import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';

import constants from '../constants';
import LineChart from './LineChart';
import ChartLegend from './ChartLegend';

//TODO: maybe shade area between demands and existing supplies in red
//TODO: normalize to all be on the y-axis?
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

    const seriesByType = {};
    constants.USAGE_TYPES.forEach((type) => {
      seriesByType[type] = constants.THEMES.map((theme) => {
        return {
          name: theme,
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

    const everyTwoTypes = R.splitEvery(2, constants.USAGE_TYPES);

    return (
      <div className="row">
        <div className="twelve columns">
          <div className="chart-header">
            <h4>Data by Usage Type</h4>
            <ChartLegend />
          </div>
          {everyTwoTypes.map(([groupOne, groupTwo], i) => {
            return (
              <div className="row" key={i}>
                <div className="six columns">
                  <h5>{groupOne}</h5>
                  <LineChart
                    chartData={{labels: constants.DECADES, series: seriesByType[groupOne]}}
                    chartOptions={chartOptions} />
                </div>
                <div className="six columns">
                  <h5>{groupTwo}</h5>
                  <LineChart
                    chartData={{labels: constants.DECADES, series: seriesByType[groupTwo]}}
                    chartOptions={chartOptions} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
});