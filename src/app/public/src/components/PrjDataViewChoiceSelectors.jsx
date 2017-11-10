
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';
import DecadeSelector from './DecadeSelector';
import DataViewChoiceActions from '../actions/DataViewChoiceActions';

const themesAndPopulation = R.append('population', constants.THEMES);

export default createReactClass({
  displayName: 'PrjDataViewChoiceSelectors',

  propTypes: {
    decade: PropTypes.oneOf(constants.DECADES).isRequired,
    theme: PropTypes.oneOf(themesAndPopulation).isRequired,
    hidePopulation: PropTypes.bool
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
  },
});
