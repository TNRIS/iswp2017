
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';
import DecadeSelector from './DecadeSelector';
import PrjThemeSelector from './PrjThemeSelector';
import DataViewChoiceActions from '../actions/DataViewChoiceActions';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired,
    hidePopulation: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  onDecadeSelect(decade) {
    DataViewChoiceActions.updateDecadeChoice(decade);
  },

  onThemeSelect(theme) {
    DataViewChoiceActions.updateThemeChoice(theme);
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
          {/* this block was removed during the fall 2017 updates per WSI request (issue #232)
            <span className="inline-label show-medium">Theme: </span>
          <PrjThemeSelector
            value={this.props.theme}
            onSelect={this.onThemeSelect}
            includePopulation={!this.props.hidePopulation} /> */}
        </div>
      </div>
    );
  }

});