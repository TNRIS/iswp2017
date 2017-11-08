import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';

import constants from '../constants';
import DecadeSelector from './DecadeSelector';
import ThemeSelector from './ThemeSelector';
import DataViewChoiceActions from '../actions/DataViewChoiceActions';

const themesAndPopulation = R.append('population', constants.THEMES);

export default class DataViewChoiceSelectors extends React.PureComponent {
  onDecadeSelect(decade) {
    DataViewChoiceActions.updateDecadeChoice(decade);
  }

  onThemeSelect(theme) {
    DataViewChoiceActions.updateThemeChoice(theme);
  }

  render() {
    const themeSelector = () => {
        if (this.props.displayTheme) {
            return (
                <div>
                  <span className="inline-label show-medium">Theme:{" "}</span>
                  <ThemeSelector
                    value={this.props.theme}
                    onSelect={this.onThemeSelect}
                    includePopulation={!this.props.hidePopulation}/>
                </div>
            )
        }
    }
    return (
      <div className="selectors">
        <div>
          <span className="inline-label show-medium">Decade:{" "}</span>
          <DecadeSelector value={this.props.decade} onSelect={this.onDecadeSelect}/>
        </div>
        {themeSelector()}
      </div>
    );
  }
}

DataViewChoiceSelectors.propTypes = {
  decade: PropTypes
    .oneOf(constants.DECADES)
    .isRequired,
  theme: PropTypes
    .oneOf(themesAndPopulation)
    .isRequired,
  hidePopulation: PropTypes.bool,
  hideTheme: PropTypes.bool
}
