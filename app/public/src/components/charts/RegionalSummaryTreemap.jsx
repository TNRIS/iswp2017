
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import titleize from 'titleize';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import Treemap from './Treemap';
import utils from '../../utils';

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
    const units = selectedTheme === 'population' ? "people" : "acre-feet/year";
    const selectedData = this.props.viewData[selectedTheme].regionalSummary[selectedDecade];

    const treemapData = {
      name: 'Statewide',
      children: selectedData.map((entry) => {
        return {
          name: `Region ${entry.REGION}`,
          className: `region-${entry.REGION.toLowerCase()}`,
          children: constants.USAGE_TYPES.map((type) => {
            return {
              name: titleize(type),
              value: entry[type] || 0,
              className: `region-${entry.REGION.toLowerCase()} type-${utils.slugify(type).toLowerCase()}`
            };
          })
        };
      })
    };

    return (
      <div>
        <h4>
          Treemap of Regional Summary - {selectedDecade} - {themeTitle}
          <span className="units">({units})</span>
        </h4>
        <Treemap treemapData={treemapData} />
      </div>
    );
  }
});