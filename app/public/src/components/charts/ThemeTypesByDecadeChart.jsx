
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import titleize from 'titleize';

import PropTypes from '../../utils/CustomPropTypes';
import constants from '../../constants';
import LineChart from './LineChart';
import ChartLegend from '../ChartLegend';
import ChartDataTable from '../ChartDataTable';

const chartOptions = {
  height: '240px'
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

    //TODO: Make user-selectable
    const theme = 'demands';
    const themeTitle = constants.THEME_TITLES[theme];

    const chartData = {
      labels: constants.DECADES,
      // reverse USAGE_TYPES so that the lines z-indices are in official order
      series: R.reverse(constants.USAGE_TYPES).map((type) => {
        return {
          name: titleize(type),
          meta: type.toLowerCase(),
          className: `series-${type.toLowerCase()}`,
          data: constants.DECADES.map((year) => {
            if (placeData.data[theme].typeTotals[type]) {
              return placeData.data[theme].typeTotals[type][`Total_${year}`];
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
      <div>
        <div className="chart-header">
          <h4>{themeTitle} by Usage Type</h4>
          <ChartLegend entries={legendEntries} className="u-pull-right" />
        </div>
        <div className="u-cf">
          Select Theme: <strong>Demands</strong> | Existing Supplies | Needs (Potential Shortages) | Strategy Supplies
        </div>
        <LineChart chartData={chartData} chartOptions={chartOptions} />
        <ChartDataTable className="u-full-width" chartData={chartData} showTotals />
      </div>
    );
  }
});