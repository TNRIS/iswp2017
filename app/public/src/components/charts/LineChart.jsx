
import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Chartist from 'chartist';
import format from 'format-number';
import classnames from 'classnames';
import classList from 'dom-classlist';

import utils from '../../utils';

export default React.createClass({
  propTypes: {
    chartData: React.PropTypes.object,
    chartOptions: React.PropTypes.object,
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      tooltip: {
        style: {
          visibility: 'hidden'
        }
      }
    };
  },

  componentDidMount() {
    this.updateChart();
    window.addEventListener('scroll', this.hideTooltip);
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
    window.removeEventListener('scroll', this.hideTooltip);
  },

  onMouseOver(event) {
    // use library to check classList because IE doesn't implement classList on SVG elements
    const isOverPoint = classList(event.target).contains('ct-point');

    if (isOverPoint) {
      const me = event.target;
      const matrix = me.getScreenCTM().translate(
        +me.getAttribute('x1'), +me.getAttribute('y2')
      );
      const parent = me.parentNode;
      const tooltip = ReactDOM.findDOMNode(this.refs.tooltip);
      // use constant height adjustment because the offsetHeight cannot
      // be reliably obtained when the tooltip is hidden
      const heightAdjust = 68;

      const meta = parent.attributes['ct:meta'] ?
        parent.attributes['ct:meta'].value : 'default';

      // bug in chartist results in 0s not being attached via ct:value
      // ref: https://github.com/gionkunz/chartist-js/issues/464
      const val = event.target.attributes['ct:value'].value || 0;

      this.setState({
        tooltip: {
          className: `tooltip-${utils.slugify(meta.toLowerCase())}`,
          value: format()(val),
          style: {
            top: matrix.f - heightAdjust,
            left: matrix.e - tooltip.offsetWidth / 2,
            visibility: 'visible'
          }
        }
      });
    }
    else {
      this.hideTooltip();
    }
  },

  hideTooltip() {
    this.setState({
      tooltip: {
        style: {
          visibility: 'hidden'
        }
      }
    });
  },

  updateChart() {
    if (!this.props.chartData) { return; }

    const defaultOptions = {
      fullWidth: true,
      lineSmooth: false,
      width: '100%',
      chartPadding: {
        left: 20,
        right: 30
      },
      axisY: {
        labelInterpolationFnc: format()
      }
    };

    const chartOptions = R.merge(defaultOptions, this.props.chartOptions);

    if (this.chart) {
      this.chart.update(this.props.chartData, chartOptions);
    }
    else {
      this.chart = new Chartist.Line(ReactDOM.findDOMNode(this.refs.chart),
        this.props.chartData, chartOptions
      );
    }
  },

  render() {
    const tooltipStyle = this.state.tooltip.style;

    return (
      <div style={{position: 'relative'}}>
        <div ref="chart" className="ct-chart" onMouseOver={this.onMouseOver}></div>
        <div ref="tooltip" className={classnames('ct-tooltip', this.state.tooltip.className)}
          style={tooltipStyle}>
          {this.state.tooltip.value}
        </div>
      </div>
    );
  }

});