
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';
import format from 'format-number';
import ToggleDisplay from 'react-toggle-display';

import SeriesHighlightStore from '../stores/SeriesHighlightStore';

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    alwaysVisible: React.PropTypes.bool,
    chartData: React.PropTypes.object.isRequired,
    showTotals: React.PropTypes.bool,
    omitLabels: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      showTable: this.props.alwaysVisible || false,
      highlightSeries: SeriesHighlightStore.getState().selectedSeries
    };
  },

  componentDidMount() {
    SeriesHighlightStore.listen(this.onSeriesHighlightChange);
  },

  componentWillUnmount() {
    SeriesHighlightStore.unlisten(this.onSeriesHighlightChange);
  },

  onSeriesHighlightChange(storeState) {
    this.setState({highlightSeries: storeState.selectedSeries});
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

  toggleTableClick(event) {
    event.preventDefault();
    this.setState({showTable: !this.state.showTable});
  },

  render() {
    const chartData = this.props.chartData;
    if (!chartData || R.isEmpty(chartData)) {
      return (<div/>);
    }

    const toTh = (text, i) => (<th key={i}>{text}</th>);
    const toTd = (num, i) => (<td key={i}>{format()(num)}</td>);

    const toggleText = this.state.showTable ? "Hide data" : "Show data";

    return (
      <div className={classnames("chart-table-container", this.props.className)}>
        {() => {
          if (!this.props.alwaysVisible) {
            return (
              <div className="toggle-container">
                <button className="button-small" onClick={this.toggleTableClick}>
                  <small>{toggleText}</small>
                </button>
              </div>
            );
          }
        }()}
        <ToggleDisplay show={this.state.showTable}>
          <div className="table-scroll-container">
            <table className="u-full-width" >
              <thead>
                <tr>
                  {!this.props.omitLabels && <th></th>}
                  {chartData.labels.map(toTh)}
                </tr>
              </thead>
              <tbody>
                {chartData.series.map((series, i) => {
                  const isHighlighted = series.meta === this.state.highlightSeries;
                  return (
                    <tr className={classnames(series.className, {'highlight': isHighlighted})} key={i}>
                      {
                        !this.props.omitLabels &&
                        <td className="row-label">
                          <span>{series.name}</span>
                        </td>
                      }
                      {series.data.map(toTd)}
                    </tr>
                  );
                })}
                {
                  this.props.showTotals && !this.props.omitLabels &&
                  <tr className="totals-row">
                    <td className="row-label">Total</td>
                    {this.makeTotalsTds()}
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </ToggleDisplay>
      </div>
    );
  }
});