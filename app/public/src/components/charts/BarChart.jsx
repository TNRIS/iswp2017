
import React from 'react/addons';
import Chartist from 'chartist';
import format from 'format-number';
import classnames from 'classnames';

export default React.createClass({
  propTypes: {
    chartData: React.PropTypes.object,
    chartOptions: React.PropTypes.object,
  },

  mixins: [React.addons.PureRenderMixin],

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
    const isOverBar = event.target.classList.contains('ct-bar');

    if (isOverBar) {
      const parent = event.target.parentNode;
      const targetRect = event.target.getBoundingClientRect();
      const chartRect = React.findDOMNode(this.refs.chart).getBoundingClientRect();
      const tooltipRect = React.findDOMNode(this.refs.tooltip).getBoundingClientRect();
      const meta = parent.attributes['ct:meta'] ?
        parent.attributes['ct:meta'].value : 'default';

      // bug in chartist results in 0s not being attached via ct:value
      // ref: https://github.com/gionkunz/chartist-js/issues/464
      const val = event.target.attributes['ct:value'].value || 0;

      this.setState({
        tooltip: {
          className: `tooltip-${meta.toLowerCase()}`,
          value: format()(val),
          bottom: chartRect.bottom - targetRect.top + 16,
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

    if (this.chart) {
      this.chart.update(this.props.chartData, this.props.chartOptions);
    }
    else {
      this.chart = new Chartist.Bar(React.findDOMNode(this.refs.chart),
        this.props.chartData, this.props.chartOptions
      );
      //TODO: tooltips
      //TODO: animate maybe
    }
  },

  render() {
    return (
      <div style={{position: 'relative'}}>
        <div ref="chart" className="ct-chart" onMouseOver={this.onMouseOver}></div>
        <div ref="tooltip" className={classnames('ct-tooltip', this.state.tooltip.className)}
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