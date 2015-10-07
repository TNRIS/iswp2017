
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';

import constants from '../constants';
import LineChart from './LineChart';

const chartOptions = {
  fullWidth: true,
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
      series: series
    };

    return (
      <div className="row">
        <div className="ten columns">
          <h4>Data by Year</h4>
          <LineChart chartData={chartData} chartOptions={chartOptions} />
        </div>
        <div className="two columns">
          <h4>Legend</h4>
        </div>
      </div>
    );
  }

});