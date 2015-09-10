
import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Chartist from 'chartist';

// TODO: Perhaps replicate how CensusReporter makes bar charts:
// Ref: https://github.com/censusreporter/censusreporter/blob/d45c0e7d420e6c0baf26211ea9df8116ae8707aa/censusreporter/apps/census/static/js/charts.js#L286

// TODO: Tooltips on bars
export default React.createClass({
  propTypes: {
    theme: React.PropTypes.string,
    dataRows: React.PropTypes.array
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    this.updateChart();
  },

  componentDidUpdate() {
    this.updateChart();
  },

  componentWillUnmount() {
    if (this.chart) {
      try {
        this.chart.detach();
      }
      catch (err) {
        console.error(err);
      }
    }
  },

  updateChart() {
    if (!this.props.dataRows) { return; }

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
      height: '300px',
      classNames: {
        chart: `ct-chart-bar chart-${this.props.theme}`
      },
      axisX: {
        showGrid: true
      },
      axisY: {
        showGrid: true
      }
    };

    if (this.chart) {
      this.chart.update(chartData, chartOptions);
    }
    else {
      this.chart = new Chartist.Bar(this.getDOMNode(), chartData, chartOptions);

      this.chart.on('draw', (data) => {
        if (data.type === 'bar') {
          data.element.animate({
            y2: {
              from: data.y1,
              to: data.y2,
              dur: 1000,
              easing: Chartist.Svg.Easing.easeOutExpo
            }
          });
        }
      });
    }
  },

  // TODO: Would be cool if the chart morphed/animated to next values
  // instead of re-rendering. Would have to break the render cycle as
  // done in ThemeMap.jsx
  render() {
    return (
      <div className="ct-chart"></div>
    );
  }
});