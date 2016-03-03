
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Tr, Td, Tfoot} from 'reactable';
import {Link} from 'react-router';
import format from 'format-number';
import classnames from 'classnames';
import titleize from 'titleize';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import Units from './Units';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  render() {
    if (!this.props.viewData) {
      return (<div />);
    }

    const selectedDecade = this.props.decade;
    const selectedTheme = this.props.theme;
    const themeTitle = constants.THEME_TITLES[selectedTheme];
    const selectedData = this.props.viewData[selectedTheme].regionalSummary[selectedDecade];

    // - styling (more condensed, asc/desc column markers, align numbers right, totals row and col)

    const typeTotals = constants.USAGE_TYPES.map((type) => {
      return R.sum(R.pluck(type, selectedData));
    });
    const totalTotal = R.sum(R.pluck('TOTAL', selectedData));

    //If isPopulation, don't show cells for usageTypes or typeTotals
    const isPopulation = selectedTheme === 'population';

    return (
      <div>
        <h4>
          Regional Summary Data - {selectedDecade} - {themeTitle}
          <Units theme={selectedTheme} />
        </h4>
        <div className="twelve columns">
          <div className="table-container">
            <Table
              className={classnames({'u-full-width': !isPopulation}, "table-condensed regional-summary-table")}
              defaultSort={{column: 'Region', direction: 'asc'}}
              sortable>
              {selectedData.map((row, i) => {
                return (
                  <Tr key={`${i}${selectedTheme}${selectedDecade}`}>
                    <Td column="Region" value={row.REGION}>
                      <Link to={`/region/${row.REGION}`}>{row.REGION}</Link>
                    </Td>
                    {!isPopulation && constants.USAGE_TYPES.map((type, j) => {
                      return (
                        <Td key={`${j}${type}`} column={titleize(type)} value={row[type]}>
                          {format()(row[type])}
                        </Td>
                      );
                    })}
                    <Td className="totals-col" column="Total" value={row.TOTAL}>
                      {format()(row.TOTAL)}
                    </Td>
                  </Tr>
                );
              })}
              <Tfoot>
                <tr className="totals-row">
                  <td className="row-label">Total</td>
                  {!isPopulation && typeTotals.map((val, i) => {
                    return (<td key={`${i}-${val}`}>{format()(val)}</td>);
                  })}
                  <td className="grand-total">{format()(totalTotal)}</td>
                </tr>
              </Tfoot>
            </Table>
          </div>
        </div>
      </div>
    );
  }
});