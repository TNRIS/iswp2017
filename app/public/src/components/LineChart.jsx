
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Chartist from 'chartist';

export default React.createClass({
  propTypes: {
    chartData: React.PropTypes.object,
    chartOptions: React.PropTypes.object,
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
    if (!this.props.chartData) { return; }

    if (this.chart) {
      this.chart.update(this.props.chartData, this.props.chartOptions);
    }
    else {
      this.chart = new Chartist.Line(this.getDOMNode(), this.props.chartData, this.props.chartOptions);
      //TODO: tooltips (without jquery)
      //TODO: animate maybe
    }
  },

  render() {
    return (
      <div className="ct-chart"></div>
    );
  }

});