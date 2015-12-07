
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Tr, Td} from 'reactable';

import PropTypes from '../utils/CustomPropTypes';
import DecadeChoiceStore from '../stores/DecadeChoiceStore';
import constants from '../constants';

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData
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
    //TODO: Sorting - see https://github.com/facebook/fixed-data-table/blob/master/site/examples/SortExample.js
    //TODO: Switcher to change the year of data
    //TODO: Show all themes in the table?
    const placeData = this.props.placeData;
    if (!placeData || !placeData.data) {
      return (
        <div />
      );
    }

    const tableData = placeData.data[this.state.selectedTheme].rows;
    const decade = this.state.selectedDecade;

    const themeKeys = R.keys(constants.THEME_TITLES);

    //TODO: Extract themeSelector to component.
    //  It is also used in ThemeTypesByDecadeChart.jsx

    //TODO: Table styling (more compact)

    const columns = [
      {key: 'EntityName', label: 'Entity'},
      {key: 'WugRegion', label: 'Region'},
      {key: 'WugCounty', label: 'County'},
      {key: `Value_${decade}`, label: `${decade} Value`}
    ];

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
            sortable
            data={tableData}
            columns={columns}
          />
        </div>
      </div>
    );
  }
});

