
import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import Chartist from 'chartist';
import format from 'format-number';
import classnames from 'classnames';
import classList from 'dom-classlist';
import round from 'round-precision';

const tooltipClass = 'ct-tooltip';
const heightAdjust = 9;

export default class PieChart extends React.PureComponent{
  componentDidMount() {
    this.updateChart(this.props);
    window.addEventListener('scroll', this.clearInteraction);
  }

  componentWillUpdate(nextProps) {
    if (nextProps !== this.props) {
      this.updateChart(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      try {
        this.chart.detach();
      }
      catch (err) {
        console.error(err);
      }
    }
    window.removeEventListener('scroll', this.clearInteraction);
  }

  onMouseOut() {
    this.clearInteraction();
  }

  onMouseOver(event) {
    // use library to check classList because IE doesn't implement classList on SVG elements
    const isOverBar = classList(event.target).contains('ct-slice-pie');
    if (!isOverBar) {
      this.clearInteraction();
      return;
    }
    //else
    const tooltip = this.tooltip;

    // bug in chartist results in 0s not being attached via ct:value
    // ref: https://github.com/gionkunz/chartist-js/issues/464
    const val = event.target.attributes['ct:value'].value || 0;

    //first set the innerHTML to the formatted value
    // and place the tooltip offscreen so that its
    // height and width can be calculated
    tooltip.innerHTML = format()(val);
    tooltip.className = classnames(tooltipClass, 'offscreen');
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;

    //use those heights and widths to calculate the placement in relation
    // to the hovered chart element
    tooltip.style.top = `${event.clientY - height - heightAdjust}px`;
    tooltip.style.left = `${event.clientX - width / 2}px`;
    tooltip.className = classnames(tooltipClass);
  }

  clearInteraction() {
    this.hideTooltip();
  }

  hideTooltip() {
    this.tooltip.className = classnames(tooltipClass, 'hide');
  }

  updateChart(props) {
    if (!props.chartData) { return; }

    const total = R.sum(R.pluck('value', props.chartData.series));

    const defaultOptions = {
      width: '100%',
      startAngle: 270,
      labelInterpolationFnc: (value, index) => {
        const pct = round(value / total * 100, 1);
        return `${props.chartData.series[index].name} (${pct}%)`;
      }
    };

    const chartOptions = R.merge(defaultOptions, props.chartOptions || {});

    if (this.chart) {
      this.chart.update(props.chartData, chartOptions);
    }
    else {
      this.chart = new Chartist.Pie(this.chart,
        props.chartData, chartOptions);
    }
  }

  render() {
    return (
      <div className="pie-chart-container">
        <div ref={(chart) => {this.chart = chart;}} className="ct-chart"
          onMouseMove={this.onMouseOver}
          onMouseOut={this.onMouseOut}>
        </div>
        <div ref={(tooltip) => {this.tooltip = tooltip;}} 
        className={classnames(tooltipClass, 'hide')}></div>
      </div>
    );
  }
}

PieChart.propTypes = {
  chartData: PropTypes.object,
  chartOptions: PropTypes.object
}