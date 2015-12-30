
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';
import DecadeSelector from './DecadeSelector';
import ThemeSelector from './ThemeSelector';
import ViewChoiceActions from '../actions/ViewChoiceActions';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  onDecadeSelect(decade) {
    ViewChoiceActions.updateDecadeChoice(decade);
  },

  onThemeSelect(theme) {
    ViewChoiceActions.updateThemeChoice(theme);
  },

  render() {
    return (
      <div className="selectors">
        <div>
          <span className="inline-label show-medium">Decade: </span>
          <DecadeSelector
            value={this.props.decade}
            onSelect={this.onDecadeSelect} />
        </div>
        <div>
          <span className="inline-label show-medium">Theme: </span>
          <ThemeSelector
            value={this.props.theme}
            onSelect={this.onThemeSelect}
            includePopulation />
        </div>
      </div>
    );
  }

});