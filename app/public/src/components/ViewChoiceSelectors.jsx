
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import DecadeSelector from './DecadeSelector';
import ThemeSelector from './ThemeSelector';
import ViewChoiceActions from '../actions/ViewChoiceActions';
import ViewChoiceStore from '../stores/ViewChoiceStore';

export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return ViewChoiceStore.getState();
  },

  componentDidMount() {
    ViewChoiceStore.listen(this.onChoiceChange);
  },

  componentWillUnmount() {
    ViewChoiceStore.unlisten(this.onChoiceChange);
  },

  onChoiceChange(state) {
    this.setState(state);
  },

  onDecadeSelect(decade) {
    ViewChoiceActions.updateDecadeChoice(decade);
  },

  onThemeSelect(theme) {
    ViewChoiceActions.updateThemeChoice(theme);
  },

  render() {
    return (
      <div>
        <DecadeSelector
          value={this.state.selectedDecade}
          onSelect={this.onDecadeSelect} />
        <ThemeSelector
          value={this.state.selectedTheme}
          onSelect={this.onThemeSelect}
          includePopulation />
      </div>
    );
  }

});