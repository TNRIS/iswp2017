
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Tr, Td} from 'reactable';
import {Link} from 'react-router';
import titleize from 'titleize';
import format from 'format-number';

import PropTypes from '../utils/CustomPropTypes';
import DecadeChoiceStore from '../stores/DecadeChoiceStore';
import constants from '../constants';

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      selectedDecade: DecadeChoiceStore.getState().selectedDecade,
      selectedTheme: R.nth(0, R.keys(constants.THEME_TITLES))
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

    const themeKeys = R.keys(constants.THEME_TITLES);

    //TODO: Extract themeSelector to component.
    //  It is also used in ThemeTypesByDecadeChart.jsx
    return (
      <div>
        <h4>Raw Data - {decade}</h4>
        <div className="u-cf selector theme-selector">
        {
          themeKeys.map((theme, i) => {
            const themeTitle = constants.THEME_TITLES[theme];
            const isActive = this.state.selectedTheme === theme;
            if (isActive) {
              return (
                <button key={i} className="active button-primary">{themeTitle}</button>
              );
            }
            return (
              <button key={i} className="button" onClick={this.selectTheme.bind(this, theme)}>{themeTitle}</button>
            );
          })
        }
        </div>
        <div className="data-table-container">
          <Table className="data-table u-full-width"
            sortable itemsPerPage={20} pageButtonLimit={5}
          >
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
                  <Td column={`${decade} Value`} value={row[`Value_${decade}`]}>
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

