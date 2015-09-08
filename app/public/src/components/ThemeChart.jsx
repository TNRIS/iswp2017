
import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';
import ChartistGraph from 'react-chartist';

export default React.createClass({
  propTypes: {
    dataRows: React.PropTypes.array
  },

  mixins: [PureRenderMixin],

  // TODO: Would be cool if the chart morphed/animated to next values
  // instead of re-rendering. Would have to break the render cycle as
  // done in ThemeMap.jsx
  render() {
    if (this.props.dataRows) {
      const groupTypes = R.groupBy(R.prop('WugType'));
      const toTypePairs = R.compose(R.toPairs, groupTypes);
      const dataByType = toTypePairs(this.props.dataRows);

      const types = R.map(R.nth(0))(dataByType);
      const sums = R.map(R.compose(R.sum, R.pluck('Value'), R.nth(1)))(dataByType);

      const chartData = {
        labels: types,
        series: [sums] // array of arrays
      };

      const chartOptions = {
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