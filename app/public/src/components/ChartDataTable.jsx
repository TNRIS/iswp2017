
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';
import format from 'format-number';
import ToggleDisplay from 'react-toggle-display';

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    alwaysVisible: React.PropTypes.bool,
    chartData: React.PropTypes.object.isRequired,
    showTotals: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      showTable: this.props.alwaysVisible || false
    };
  },

  toggleTableClick(event) {
    event.preventDefault();
    this.setState({showTable: !this.state.showTable});
  },

  makeTotalsTds() {
    const chartData = this.props.chartData;
    return chartData.labels.map((decade, colIndex) => {
      const vals = chartData.series.map((series) => {
        return R.nth(colIndex, series.data);
      });
      return (<td key={colIndex}>{format()(R.sum(vals))}</td>);
    });
  },

  render() {
    const chartData = this.props.chartData;
    if (!chartData || R.isEmpty(chartData)) {
      return (<div/>);
    }

    const toTh = (x, i) => (<th key={i}>{x}</th>);
    const toTd = (x, i) => (<td key={i}>{format()(x)}</td>);

    const toggleText = this.state.showTable ? "Hide data" : "Show data";

    return (
      <div className={classnames("chart-table-container", this.props.className)}>
        {() => {
          if (!this.props.alwaysVisible) {
            return (
              <button className="button-small u-pull-right" onClick={this.toggleTableClick}>
                <small>{toggleText}</small>
              </button>
            );
          }
        }()}
        <ToggleDisplay show={this.state.showTable}>
          <table className="u-full-width" >
            <thead>
              <tr>
                <th></th>
                {chartData.labels.map(toTh)}
              </tr>
            </thead>
            <tbody>
              {chartData.series.map((series, i) => {
                return (
                  <tr className={series.className} key={i}>
                    <td className="row-label">{series.name}</td>
                    {series.data.map(toTd)}
                  </tr>
                );
              })}
              {
                this.props.showTotals &&
                <tr className="totals-row">
                  <td className="row-label">Total</td>
                  {this.makeTotalsTds()}
                </tr>
              }
            </tbody>
          </table>
        </ToggleDisplay>
      </div>
    );
  }
});