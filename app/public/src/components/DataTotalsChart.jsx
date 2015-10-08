
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';

import constants from '../constants';
import LineChart from './LineChart';

const chartOptions = {
  fullWidth: true,
  height: '200px',
  chartPadding: {
    right: 30
  }
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

    //TODO: Legend
    return (
      <div className="row">
        <div className="twelve columns">
          <h4>Data Totals</h4>
          <LineChart chartData={chartData} chartOptions={chartOptions} />
          <p>Legend: Demands Existing Supplies Needs (Potential Shortages) Strategy Supplies</p>
        </div>
      </div>
    );
  }

});