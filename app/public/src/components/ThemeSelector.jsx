
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';

export default React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      selectedTheme: this.props.value
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({selectedTheme: nextProps.value});
    }
  },

  selectTheme(theme) {
    this.setState({selectedTheme: theme});
    this.props.onSelect(theme);
  },

  render() {
    const themeKeys = R.keys(constants.THEME_TITLES);

    return (
      <div className="u-cf selector theme-selector">
        {
          themeKeys.map((theme, i) => {
            const themeTitle = constants.THEME_TITLES[theme];
            const isActive = this.state.selectedTheme === theme;
            if (isActive) {
              return (
                <button key={i} className="active button-primary">{themeTitle}</button>
              );
            }
            return (
              <button key={i} className="button" onClick={this.selectTheme.bind(this, theme)}>{themeTitle}</button>
            );
          })
        }
      </div>
    );
  }

});