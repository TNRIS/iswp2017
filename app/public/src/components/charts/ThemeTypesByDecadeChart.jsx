
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import titleize from 'titleize';

import PropTypes from '../../utils/CustomPropTypes';
import constants from '../../constants';
import LineChart from './LineChart';
import ChartLegend from '../ChartLegend';
import ChartDataTable from '../ChartDataTable';

const chartOptions = {
  height: '240px'
};

function slugify(s) {
  return s.replace(/\s+/g, '-');
}

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      selectedTheme: R.nth(0, R.keys(constants.THEME_TITLES))
    };
  },

  selectTheme(theme) {
    this.setState({selectedTheme: theme});
  },

  render() {
    const placeData = this.props.placeData;

    if (!placeData || !placeData.data) {
      return (
        <div />
      );
    }

    const chartData = {
      labels: constants.DECADES,
      // reverse USAGE_TYPES so that the lines z-indices are in official order
      series: R.reverse(constants.USAGE_TYPES).map((type) => {
        return {
          name: titleize(type),
          meta: type.toLowerCase(),
          className: `series-${slugify(type.toLowerCase())}`,
          data: constants.DECADES.map((year) => {
            if (R.path(['data', this.state.selectedTheme, 'typeTotals', type], placeData)) {
              return placeData.data[this.state.selectedTheme].typeTotals[type][`Total_${year}`];
            }
            return 0;
          })
        };
      })
    };

    const legendEntries = constants.USAGE_TYPES.map((type) => {
      return {
        className: `series-${slugify(type)}`,
        display: titleize(type)
      };
    });

    const themeKeys = R.keys(constants.THEME_TITLES);

    return (
      <div>
        <div className="chart-header">
          <h4>{constants.THEME_TITLES[this.state.selectedTheme]} by Usage Type</h4>
          <ChartLegend entries={legendEntries} className="u-pull-right legend-types-by-decade" />
        </div>
        <div className="u-cf selector theme-selector">
          <span className="label">Select Theme:</span>
          <ul className="options">
          {
            themeKeys.map((theme, i) => {
              const themeTitle = constants.THEME_TITLES[theme];
              const isActive = this.state.selectedTheme === theme;
              if (isActive) {
                return (<li key={i} className="active">{themeTitle}</li>);
              }
              return (
                <li key={i}>
                  <button className="button" onClick={this.selectTheme.bind(this, theme)}>{themeTitle}</button>
                </li>
              );
            })
          }
          </ul>
        </div>
        <LineChart chartData={chartData} chartOptions={chartOptions} />
        <ChartDataTable className="u-full-width" chartData={chartData} showTotals />
      </div>
    );
  }
});