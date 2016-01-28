
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';
import DecadeSelector from './DecadeSelector';
import ThemeSelector from './ThemeSelector';
import DataViewChoiceActions from '../actions/DataViewChoiceActions';
import ViewStateStore from '../stores/ViewStateStore';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    decade: React.PropTypes.oneOf(constants.DECADES).isRequired,
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      includePopulation: this.shouldIncludePopulation(ViewStateStore.getState().viewState)
    };
  },

  componentDidMount() {
    ViewStateStore.listen(this.onViewStateChange);
  },

  componentWillUnmount() {
    ViewStateStore.unlisten(this.onViewStateChange);
  },

  onViewStateChange(storeState) {
    this.setState({includePopulation: this.shouldIncludePopulation(storeState.viewState)});
  },

  onDecadeSelect(decade) {
    DataViewChoiceActions.updateDecadeChoice(decade);
  },

  onThemeSelect(theme) {
    DataViewChoiceActions.updateThemeChoice(theme);
  },

  shouldIncludePopulation(viewState) {
    return !(viewState.view === 'usagetype' && viewState.id !== 'municipal');
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