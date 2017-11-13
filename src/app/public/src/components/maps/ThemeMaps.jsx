
import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';

import constants from '../../constants';
import CustomPropTypes from '../../utils/CustomPropTypes';
import ThemeMap from './ThemeMap';
import PrjThemeMap from './PrjThemeMap';
import Units from '../Units';

const themesAndPopulation = R.append('population', constants.THEMES);

export default class ThemeMaps extends React.Component {
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

    let projectsData = placeData.data['projects'];
    if (placeData.data.wugregion) {
      projectsData = placeData.data['wugregion'];
    }

    if (this.props.view === 'wms' || this.props.view === 'wmsType') {
        let mapTitle
        if (this.props.view === 'wms') {
            mapTitle = 'Water Management Strategy'
        } else if (this.props.view === 'wmsType') {
            mapTitle = 'Water Management Strategy Type'
        }
        return (
            <div>
              <h4>
                {mapTitle} - {selectedDecade} - {themeTitle}
                <Units theme={selectedTheme} />
              </h4>
              <div className="twelve columns">
                <ThemeMap
                  theme={selectedTheme}
                  data={placeData.data[selectedTheme]}
                  decade={selectedDecade}
                  projects={projectsData} />
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
            projects={projectsData} />
        </div>
      </div>
    );
  }
}

ThemeMaps.propTypes = {
  placeData: CustomPropTypes.PlaceData,
  decade: PropTypes.oneOf(constants.DECADES).isRequired,
  theme: PropTypes.oneOf(themesAndPopulation).isRequired,
  view: PropTypes.string
};
