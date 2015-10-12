/*global $:false*/
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Chartist from 'chartist';
import format from 'format-number';

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
      this.chart = new Chartist.Bar(this.getDOMNode(), this.props.chartData, this.props.chartOptions);
      //TODO: animate maybe
      const $chart = $(this.getDOMNode());
      const $tooltip = $chart.append('<div class="tooltip"></div>')
        .find('.tooltip')
        .hide();

      let currClass = '';

      $chart.on('mouseenter', '.ct-bar', function showTooltip() {
        const $point = $(this);
        const value = $point.attr('ct:value');
        const seriesName = $point.parent().attr('ct:series-name');
        currClass = `tooltip-${seriesName}`;
        $tooltip.addClass(currClass);
        $tooltip.html(format()(value)).show();
      });

      $chart.on('mouseleave', '.ct-bar', () => {
        $tooltip.hide();
        $tooltip.removeClass(currClass);
      });

      //TODO: FIXME: tooltip position
      $chart.on('mousemove', (event) => {
        $tooltip.css({
          left: event.offsetX - $tooltip.width() / 2,
          top: event.offsetY
        });
      });
    }
  },

  render() {
    return (
      <div className="ct-chart"></div>
    );
  }

});