
import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import classnames from 'classnames';
import format from 'format-number';
import ToggleDisplay from 'react-toggle-display';

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    chartData: React.PropTypes.object.isRequired
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      showTable: false
    };
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

    const toTh = (x, i) => (<th key={i}>{x}</th>);
    const toTd = (x, i) => (<td key={i}>{format()(x)}</td>);

    const toggleText = this.state.showTable ? "Hide data" : "Show data";

    return (
      <div className={classnames("chart-table-container", this.props.className)}>
        <a href="#" className="u-pull-right" onClick={this.toggleTableClick}>
          <small>{toggleText}</small>
        </a>
        <ToggleDisplay show={this.state.showTable}>
          <table className="u-full-width" >
            <thead>
              <th></th>
              {chartData.labels.map(toTh)}
            </thead>
            <tbody>
              {chartData.series.map((ser, i) => {
                return (
                  <tr className={ser.className} key={i}>
                    <td className="row-label">{ser.name}</td>
                    {ser.data.map(toTd)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ToggleDisplay>
      </div>
    );
  }
});