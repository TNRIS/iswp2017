
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Chartist from 'chartist';
import format from 'format-number';

export default React.createClass({
  propTypes: {
    chartData: React.PropTypes.object,
    chartOptions: React.PropTypes.object
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    this.updateChart(this.props);
    // window.addEventListener('scroll', this.clearInteraction);
  },

  componentWillUpdate(nextProps) {
    if (nextProps !== this.props) {
      this.updateChart(nextProps);
    }
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
    // window.removeEventListener('scroll', this.clearInteraction);
  },

  updateChart(props) {
    if (!props.chartData) { return; }

    const defaultOptions = {
      width: '100%',
      // labelInterpolationFunc: format()
    };

    const chartOptions = R.merge(defaultOptions, props.chartOptions || {});

    if (this.chart) {
      this.chart.update(props.chartData, chartOptions);
    }
    else {
      this.chart = new Chartist.Pie(this.refs.chart,
        props.chartData, chartOptions);
    }
  },

  render() {
    return (
      <div className="pie-chart-container">
        <div ref="chart" className="ct-chart">
        </div>
      </div>
    );
  }
});
