
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';
import titleize from 'titleize';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import Treemap from './Treemap';
import Units from '../Units';
import utils from '../../utils';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      selectedTreemap: 'region'
    };
  },

  selectTreemap(type) {
    this.setState({selectedTreemap: type});
  },

  formatData() {
    const selectedDecade = this.props.decade;
    const selectedTheme = this.props.theme;
    const isPopulation = selectedTheme === 'population';
    const selectedData = this.props.viewData[selectedTheme].regionalSummary[selectedDecade];

    const selectedTreemap = this.state.selectedTreemap;

    if (selectedTreemap === 'region') {
      return {
        label: 'Statewide',
        children: selectedData.map((entry) => {
          const child = {
            label: `Region ${entry.REGION}`,
            className: `region-${entry.REGION.toLowerCase()}`,
          };

          //just a one-level treemap with the MUNICIPAL value
          if (isPopulation) {
            child.value = entry.MUNICIPAL || 0;
          }
          else {
            //else go down another level for each region, showing the
            //usage types in that region
            child.children = constants.USAGE_TYPES.map((type) => {
              return {
                label: titleize(type),
                value: entry[type] || 0,
                className: `region-${entry.REGION.toLowerCase()}`
              };
            });
          }
          return child;
        })
      };
    }

    //else 'usagetype'
    const dataByRegion = R.groupBy(R.prop('REGION'), selectedData);

    return {
      label: 'Statewide',
      children: constants.USAGE_TYPES.map((type) => {
        return {
          label: titleize(type),
          className: `type-${utils.slugify(type).toLowerCase()}`,
          children: constants.REGIONS.map((region) => {
            const entry = R.nth(0, dataByRegion[region]);
            return {
              label: `Region ${region.toUpperCase()}`,
              className: `type-${utils.slugify(type).toLowerCase()}`,
              value: entry[type]
            };
          })
        };
      })
    };
  },

  render() {
    if (!this.props.viewData) {
      return (<div />);
    }

    const selectedDecade = this.props.decade;
    const selectedTheme = this.props.theme;
    const themeTitle = constants.THEME_TITLES[selectedTheme];
    const selectedTreemap = this.state.selectedTreemap;

    const treemapData = this.formatData();

    return (
      <div>
        <h4>
          Regional Summary Treemap - {selectedDecade} - {themeTitle}
          <Units theme={selectedTheme} />
        </h4>
        <div className="selector treemap-selector">
          <button
            onClick={this.selectTreemap.bind(this, 'region')}
            className={classnames("button", {"active": selectedTreemap === 'region'})}>
            By Region
          </button>
          <button
            onClick={this.selectTreemap.bind(this, 'usagetype')}
            className={classnames("button", {"active": selectedTreemap === 'usagetype'})}>
            By Usage Type
          </button>
        </div>
        <Treemap treemapData={treemapData} showPercent />
      </div>
    );
  }
});