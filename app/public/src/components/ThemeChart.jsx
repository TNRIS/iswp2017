
import {PureRenderMixin} from 'react/addons';
import React from 'react';
import Spinner from 'react-spinkit';
import ChartistGraph from 'react-chartist';

export default React.createClass({
  propTypes: {
    dataRows: React.PropTypes.array
  },

  mixins: [PureRenderMixin],

  render() {
    if (this.props.dataRows) {
      const chartData = {
        labels: ['MANUFACTURING', 'MINING', 'STEAM-ELECTRIC'],
        series: [
          [47000, 5000, 120000]
        ]
      };

      const chartOptions = {
        horizontalBars: true,
        height: '300px'
      };

      return (
        <ChartistGraph
          data={chartData}
          options={chartOptions}
          type={'Bar'}
        />
      );
    }

    return (
      <Spinner spinnerName="double-bounce" />
    );
  }
});