
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';
import titleize from 'titleize';
import format from 'format-number';
import {Table, Tr, Td} from 'reactable';
import round from 'round-precision';

import constants from '../constants';
import PieChart from './charts/PieChart';
import PropTypes from '../utils/CustomPropTypes';
import Units from './Units';
import {slugify} from '../utils';

const chartOptions = {
  height: '240px'
};

function toPieSeries(totals, decade) {
  const keys = R.keys(totals);
  const onlyOne = keys.length === 1;
  return R.map((key) => {
    return {
      name: titleize(key),
      meta: key.toLowerCase(),
      className: classnames(
        `series-${slugify(key).toLowerCase()}`, {'single-slice': onlyOne}
      ),
      value: totals[key][decade]
    };
  }, keys)
  .filter((x) => x.value !== 0)
  .sort((a, b) => b.value - a.value);
}

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired
  },

  mixins: [PureRenderMixin],

  render() {
    const viewData = this.props.viewData;

    if (!viewData) {
      return <div/>;
    }

    const decade = this.props.decade;
    const sourceTotals = viewData.strategies.strategySourceTotals;
    const stratTypeTotals = viewData.strategies.strategyTypeTotals;

    if (R.isEmpty(sourceTotals)) {
      return (
        <div className="strategies-breakdown-container">
          <h4>Strategy Supplies Breakdown - {decade}</h4>
          <p>There are no recommended water management strategies.</p>
        </div>
      );
    }

    const sourceTypeChartData = {
      series: toPieSeries(sourceTotals, decade)
    };

    const stratTotal = R.sum(R.pluck(decade)(R.values(stratTypeTotals)));

    return (
      <div className="strategies-breakdown-container">
        <h4>
          Strategy Supplies Breakdown - {decade}
          <Units />
        </h4>
        <div className="row">
          <div className="six columns strategies-by-source-type-container">
            <h5>Share by Water Resource</h5>
            <PieChart chartData={sourceTypeChartData} chartOptions={chartOptions} />
          </div>
          <div className="six columns strategies-by-type-container">
            <h5>Share by Strategy Type</h5>
            <div className="strategies-by-type-table-container">
              <Table className="table-condensed u-full-width strategies-by-type-table"
                sortable
                defaultSort={{column: 'Amount', direction: 'desc'}}>
                {
                  R.keys(stratTypeTotals).map((type) => {
                    const val = stratTypeTotals[type][decade];
                    const pct = round(val / stratTotal * 100, 1);
                    return (
                      <Tr key={`{type}{decade}`}>
                        <Td column="Strategy Type" value={type}>
                          {titleize(type)}
                        </Td>
                        <Td column="Amount" value={val}>
                          {`${pct}% (${format()(val)})`}
                        </Td>
                      </Tr>
                    );
                  })
                }
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
