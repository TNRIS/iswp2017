
import R from 'ramda';
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

  getInitialState() {
    return {
      tooltip: {
        visibility: 'hidden'
      }
    };
  },

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

  onMouseOver(event) {
    const isOverPoint = event.target.classList.contains('ct-point');

    if (isOverPoint) {
      const parent = event.target.parentNode;
      const targetRect = event.target.getBoundingClientRect();
      const chartRect = React.findDOMNode(this.refs.chart).getBoundingClientRect();
      const tooltipRect = React.findDOMNode(this.refs.tooltip).getBoundingClientRect();
      const name = parent.attributes['ct:series-name'] ?
        parent.attributes['ct:series-name'].value : 'default';
      const val = event.target.attributes['ct:value'].value;

      this.setState({
        tooltip: {
          className: `tooltip-${name}`,
          value: format()(val),
          bottom: chartRect.bottom - targetRect.bottom + 20,
          left: targetRect.left - chartRect.left - tooltipRect.width / 2,
          visibility: 'visible'
        }
      });
    }
    else {
      this.setState({
        tooltip: {
          bottom: 0,
          left: 0,
          visibility: 'hidden',
        }
      });
    }
  },

  updateChart() {
    if (!this.props.chartData) { return; }

    const defaultOptions = {
      fullWidth: true,
      lineSmooth: false,
      width: '100%',
      chartPadding: {
        right: 30
      }
    };

    const chartOptions = R.merge(defaultOptions, this.props.chartOptions);

    if (this.chart) {
      this.chart.update(this.props.chartData, chartOptions);
    }
    else {
      this.chart = new Chartist.Line(React.findDOMNode(this.refs.chart),
        this.props.chartData, chartOptions
      );

      // const $chart = $(this.getDOMNode());
      // const $tooltip = $chart.append('<div class="tooltip"></div>')
      //   .find('.tooltip')
      //   .hide();

      // let currClass = '';

      // $chart.on('mouseenter', '.ct-point', function showTooltip() {
      //   const $point = $(this);
      //   const value = $point.attr('ct:value');
      //   const seriesName = $point.parent().attr('ct:series-name');
      //   currClass = `tooltip-${seriesName}`;
      //   $tooltip.addClass(currClass);
      //   $tooltip.html(format()(value)).show();
      // });

      // $chart.on('mouseleave', '.ct-point', () => {
      //   $tooltip.hide();
      //   $tooltip.removeClass(currClass);
      // });

      // $chart.on('mousemove', (event) => {
      //   console.log(event);
      //   $tooltip.css({
      //     left: event.pageX - $tooltip.width() / 2,
      //     top: event.pageY + 20
      //   });
      // });

      //TODO: animate maybe
    }
  },

  render() {
    return (
      <div style={{position: 'relative'}}>
        <div ref="chart" className="ct-chart" onMouseOver={this.onMouseOver}></div>
        <div ref="tooltip" className={'ct-tooltip ' + this.state.tooltip.className}
          style={{
            bottom: this.state.tooltip.bottom,
            left: this.state.tooltip.left,
            visibility: this.state.tooltip.visibility
          }}>
          {this.state.tooltip.value}
        </div>
      </div>
    );
  }

});