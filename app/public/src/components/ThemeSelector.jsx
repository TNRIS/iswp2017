
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import hat from 'hat';
import classnames from 'classnames';

import constants from '../constants';

export default React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    includePopulation: React.PropTypes.bool
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

  clickTheme(theme) {
    this.setState({selectedTheme: theme});
    this.props.onSelect(theme);
  },

  selectThemeChange(event) {
    const theme = event.target.value;
    this.setState({selectedTheme: theme});
    this.props.onSelect(theme);
  },

  render() {
    const selectId = `select-${hat()}`;

    const themeKeys = this.props.includePopulation ?
      R.prepend('population', constants.THEMES)
      : constants.THEMES;

    const selectedTheme = this.state.selectedTheme;

    return (
      <div className="selector theme-selector">
        <div className="show-medium">
          {
            themeKeys.map((theme) => {
              const themeTitle = constants.THEME_TITLES[theme];
              return (
                <button key={`button-${theme}`}
                  className={classnames('button', {'active button-primary': theme === this.state.selectedTheme})}
                  onClick={this.clickTheme.bind(this, theme)}>
                  {themeTitle}
                </button>
              );
            })
          }
        </div>
        <div className="hide-medium">
          <label htmlFor={selectId}>Theme:</label>
          <select id={selectId} value={selectedTheme} onChange={this.selectThemeChange}>
            {
              themeKeys.map((theme) => {
                const themeTitle = constants.THEME_TITLES[theme];
                return (<option key={`option-${theme}`} value={theme}>{themeTitle}</option>);
              })
            }
          </select>
        </div>
      </div>
    );
  }

});