
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Chartist from 'chartist';
import format from 'format-number';
import classnames from 'classnames';
import classList from 'dom-classlist';

import SeriesHighlightActions from '../../actions/SeriesHighlightActions';
import utils from '../../utils';

const tooltipClass = 'ct-tooltip';
const heightAdjust = 14;

export default React.createClass({
  propTypes: {
    chartData: React.PropTypes.object,
    chartOptions: React.PropTypes.object,
  },

  mixins: [PureRenderMixin],

  componentDidMount() {
    this.updateChart(this.props);
    window.addEventListener('scroll', this.clearInteraction);
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
    window.removeEventListener('scroll', this.clearInteraction);
  },

  onMouseOut() {
    this.clearInteraction();
  },

  onMouseOver(event) {
    // use library to check classList because IE doesn't implement classList on SVG elements
    const isOverPoint = classList(event.target).contains('ct-point');

    if (!isOverPoint) {
      this.clearInteraction();
      return;
    }

    const me = event.target;
    const matrix = me.getScreenCTM().translate(
      +me.getAttribute('x1'), +me.getAttribute('y2')
    );
    const parent = me.parentNode;
    const tooltip = this.refs.tooltip;

    const seriesName = parent.attributes['ct:meta'] ?
      parent.attributes['ct:meta'].value : 'default';

    SeriesHighlightActions.selectSeries(seriesName);

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
    tooltip.style.top = `${matrix.f - height - heightAdjust}px`;
    tooltip.style.left = `${matrix.e - width / 2}px`;
    tooltip.className = classnames(tooltipClass, `tooltip-${seriesName.toLowerCase()}`);
  },

  clearInteraction() {
    SeriesHighlightActions.clearSeries();
    this.hideTooltip();
  },

  hideTooltip() {
    this.refs.tooltip.className = classnames(tooltipClass, 'hide');
  },

  updateChart(props) {
    if (!props.chartData) { return; }

    const defaultOptions = {
      fullWidth: true,
      lineSmooth: false,
      width: '100%',
      chartPadding: {
        left: utils.getChartLeftPadding(props.chartData),
        right: 30
      },
      axisY: {
        labelInterpolationFnc: format()
      }
    };

    const chartOptions = R.merge(defaultOptions, props.chartOptions);

    //if the chart has no plugins, then it doesn't have an axis title
    // so reduce the left padding
    if (!chartOptions.plugins) {
      chartOptions.chartPadding.left -= 10;
    }

    if (this.chart) {
      this.chart.update(props.chartData, chartOptions);
    }
    else {
      this.chart = new Chartist.Line(this.refs.chart,
        props.chartData, chartOptions
      );
    }
  },

  render() {
    return (
      <div style={{position: 'relative'}}>
        <div ref="chart" className="ct-chart"
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}>
        </div>
        <div ref="tooltip" className={classnames(tooltipClass, 'hide')}></div>
      </div>
    );
  }

});