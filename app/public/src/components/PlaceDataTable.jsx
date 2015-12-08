
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {Table, Tr, Td} from 'reactable';
import {Link} from 'react-router';
import titleize from 'titleize';
import format from 'format-number';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import DecadeChoiceStore from '../stores/DecadeChoiceStore';
import ThemeSelector from './ThemeSelector';

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [LinkedStateMixin, PureRenderMixin],

  getInitialState() {
    return {
      selectedDecade: DecadeChoiceStore.getState().selectedDecade,
      selectedTheme: R.nth(0, R.keys(constants.THEME_TITLES)),
      tableFilter: ''
    };
  },

  componentDidMount() {
    DecadeChoiceStore.listen(this.onDecadeChange);
  },

  componentWillUnmount() {
    DecadeChoiceStore.unlisten(this.onDecadeChange);
  },

  onDecadeChange(storeState) {
    this.setState({selectedDecade: storeState.selectedDecade});
  },

  selectTheme(theme) {
    this.setState({selectedTheme: theme});
  },

  render() {
    //TODO: Show all decades for selected theme in the table?
    const viewData = this.props.viewData;
    if (!viewData) {
      return (
        <div />
      );
    }

    const tableData = viewData[this.state.selectedTheme].rows;
    const decade = this.state.selectedDecade;
    const themeTitle = constants.THEME_TITLES[this.state.selectedTheme];

    // hide pagination controls if there are fewer than DATA_TABLE_ITEMS_PER_PAGE
    const itemsPerPage = tableData.length <= constants.DATA_TABLE_ITEMS_PER_PAGE ? 0
      : constants.DATA_TABLE_ITEMS_PER_PAGE;

    return (
      <div>
        <h4>Raw Data - {decade}</h4>
        <ThemeSelector onSelect={this.selectTheme} value={this.state.selectedTheme} />
        <div className="data-table-container">
          <div className="data-table-filter">
            <label htmlFor="dataTableFilter">Filter: </label>
            <input id="dataTableFilter" type="text"
              valueLink={this.linkState('tableFilter')} />
          </div>
          <Table className="data-table u-full-width"
            sortable defaultSort={{column: 'Entity', direction: 'asc'}}
            itemsPerPage={itemsPerPage} pageButtonLimit={5}
            noDataText="No matching records found."
            filterable={['Entity', 'County']} filterBy={this.state.tableFilter} hideFilterInput>
            {tableData.map((row, i) => {
              return (
                <Tr key={i}>
                  <Td column="Entity" value={row.EntityName}>
                    <Link to={`/entity/${row.EntityId}`}>{row.EntityName}</Link>
                  </Td>
                  <Td column="Region" value={row.WugRegion}>
                    <Link to={`/region/${row.WugRegion}`}>{row.WugRegion}</Link>
                  </Td>
                  <Td column="County" value={row.WugCounty}>
                    <Link to={`/county/${titleize(row.WugCounty)}`}>{row.WugCounty}</Link>
                  </Td>
                  <Td column={`${decade} ${themeTitle}`} value={row[`Value_${decade}`]}>
                    {format()(row[`Value_${decade}`])}
                  </Td>
                </Tr>
              );
            })}
          </Table>
        </div>
      </div>
    );
  }
});

