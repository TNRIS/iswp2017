
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';
import history from '../history';
import utils from '../utils';
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

  getInitialState() {
    return {includePopulation: true};
  },

  componentDidMount() {
    this.historyUnlistener = history.listen(this.onHistoryChange);
  },

  componentWillUnmount() {
    this.historyUnlistener();
  },

  onHistoryChange(loc) {
    //we don't want to show population selection for any UsageType views
    // except for Municipal
    if (utils.stringContains(loc.pathname, '/usagetype') &&
      !utils.stringContains(loc.pathname, '/municipal')) {
      this.setState({includePopulation: false});
    }
    else {
      this.setState({includePopulation: true});
    }
  },

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
            includePopulation={this.state.includePopulation} />
        </div>
      </div>
    );
  }

});