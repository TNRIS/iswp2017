
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import ThemeMap from './ThemeMap';
import PrjThemeMap from './PrjThemeMap';
import Units from '../Units';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData,
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  render() {
    if (!this.props.placeData || !this.props.placeData.data) {
      return (<div />);
    }

    const placeData = this.props.placeData;
    const selectedDecade = this.props.decade;
    const selectedTheme = this.props.theme;
    const themeTitle = constants.THEME_TITLES[selectedTheme];

    if (placeData.project) {
      return (
        <div>
          <h4>
            Water User Groups - {selectedDecade} - Population Benefiting
          </h4>
          <div className="twelve columns">
            <PrjThemeMap
              theme={selectedTheme}
              data={placeData.data[selectedTheme]}
              decade={selectedDecade}
              project={placeData.project} />
          </div>
        </div>
      );
    }

    return (
      <div>
        <h4>
          Water User Groups - {selectedDecade} - {themeTitle}
          <Units theme={selectedTheme} />
        </h4>
        <div className="twelve columns">
          <ThemeMap
            theme={selectedTheme}
            data={placeData.data[selectedTheme]}
            boundary={placeData.boundary}
            decade={selectedDecade}
            entity={placeData.entity}
            projects={placeData.data['projects']} />
        </div>
      </div>
    );
  }
});