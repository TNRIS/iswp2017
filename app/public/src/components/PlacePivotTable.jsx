
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import format from 'format-number';
import hat from 'hat';
import PivotTable from 'babel!react-pivot'; //must use babel loader directly

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  render() {
    const viewData = this.props.viewData;
    if (!viewData) {
      return (
        <div />
      );
    }

    const selectedTheme = this.props.theme;
    const tableData = viewData[selectedTheme].rows;
    const decade = this.props.decade;
    const themeTitle = constants.THEME_TITLES[selectedTheme];

    const toAnchor = (href, text) => {
      return `<a href="${href}">${text}</a>`;
    };

    const dimensions = [
      {
        value: 'EntityName',
        title: 'Entity',
        template: (val, row) => toAnchor(`/entity/${row.entityId}`, val)
      },
      {
        value: 'WugCounty',
        title: 'County',
        template: (val) => toAnchor(`/county/${val}`, val)
      },
      {
        value: 'WugRegion',
        title: 'Region',
        template: (val) => toAnchor(`/region/${val}`, val)
      }
    ];

    const reduce = (row, memo) => {
      memo.valueTotal = (memo.valueTotal || 0) + row[`Value_${decade}`];
      memo.entityId = row.EntityId; //save the EntityId so a link can be made
      return memo;
    };

    const calculations = [
      {
        title: `${decade} ${themeTitle}`,
        value: 'valueTotal',
        template: (val) => format()(val)
      }
    ];

    const units = selectedTheme === 'population' ? "people" : "acre-feet/year";

    return (
      <div>
        <h4>
          Raw Data - {decade} - {themeTitle}
          <span className="units">({units})</span>
        </h4>
        <div className="data-table-container">
          <PivotTable
            //assign a unique key to force rerender of table
            // otherwise it will not react to prop changes
            key={hat()}
            rows={tableData}
            dimensions={dimensions}
            reduce={reduce}
            calculations={calculations}
            sortBy={'Entity'}
            activeDimensions={['Region', 'County', 'Entity']}
            nPaginateRows={50}
          />
        </div>
      </div>
    );
  }
});

