
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    theme: React.PropTypes.oneOf(themesAndPopulation).isRequired,
    viewName: React.PropTypes.string,
    type: React.PropTypes.oneOf([
      'statewide', 'region', 'county', 'entity', 'usagetype', 'source', 'project'
    ]).isRequired,
    typeId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  mixins: [PureRenderMixin],

  render() {
    const theme = this.props.theme;
    const themeTitle = constants.THEME_TITLES[theme];
    const href = this.props.type === 'statewide' ?
      `/download/statewide/${theme}`
      : `/download/${this.props.type}/${this.props.typeId}/${theme}`;

    let dlTitle = `${R.defaultTo('', this.props.viewName)} ${themeTitle}`;
    if (this.props.type == 'project') {
      dlTitle = `WMS Project`;
    }

    return (
      <a href={href} download target="_blank"
        className="download-data-link"
        title={`Download ${dlTitle} data`}>
        Download {dlTitle} data (Comma-Separated Values)
      </a>
    );
  }
});