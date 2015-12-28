
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Tr, Td, Tfoot} from 'reactable';
import {Link} from 'react-router';
import format from 'format-number';
import titleize from 'titleize';

import constants from '../constants';
import ViewChoiceStore from '../stores/ViewChoiceStore';
import PropTypes from '../utils/CustomPropTypes';

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return ViewChoiceStore.getState();
  },

  componentDidMount() {
    ViewChoiceStore.listen(this.onChoiceChange);
  },

  componentWillUnmount() {
    ViewChoiceStore.unlisten(this.onChoiceChange);
  },

  onChoiceChange(state) {
    this.setState(state);
  },

  render() {
    if (!this.props.viewData) {
      return (<div />);
    }

    const selectedDecade = this.state.selectedDecade;
    const selectedTheme = this.state.selectedTheme;
    const themeTitle = constants.THEME_TITLES[selectedTheme];

    const units = selectedTheme === 'population' ? "people" : "acre-feet/year";

    const selectedData = this.props.viewData[selectedTheme].regionalSummary[selectedDecade];

    // - styling (more condensed, asc/desc column markers, align numbers right, totals row and col)

    const typeTotals = constants.USAGE_TYPES.map((type) => {
      return R.sum(R.pluck(type, selectedData));
    });
    const totalTotal = R.sum(R.pluck('TOTAL', selectedData));

    return (
      <div>
        <h4>
          Regional Summary - {selectedDecade} - {themeTitle}
          <span className="units">({units})</span>
        </h4>
        <div className="twelve columns">
          <div className="regional-summary-table-container">
            <Table className="regional-summary-table"
              defaultSort={{column: 'Region', direction: 'asc'}}
              sortable>
              {selectedData.map((row, i) => {
                return (
                  <Tr key={`${i}${selectedTheme}${selectedDecade}`}>
                    <Td column="Region" value={row.REGION}>
                      <Link to={`/region/${row.REGION}`}>{row.REGION}</Link>
                    </Td>
                    {constants.USAGE_TYPES.map((type, j) => {
                      return (
                        <Td key={`${j}${type}`} column={titleize(type)} value={row[type]}>
                          {format()(row[type])}
                        </Td>
                      );
                    })}
                    <Td className="total-col" column="Total" value={row.TOTAL}>
                      {format()(row.TOTAL)}
                    </Td>
                  </Tr>
                );
              })}
              <Tfoot>
                <tr className="total-row">
                  <td className="row-label">Total</td>
                  {typeTotals.map((val, i) => {
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