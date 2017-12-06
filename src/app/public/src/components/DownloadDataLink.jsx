
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';


import constants from '../constants';

const themesAndPopulation = R.append('population', constants.THEMES);

export default class DownloadDataLink extends React.PureComponent {
  render() {
    const theme = this.props.theme;
    const themeTitle = constants.THEME_TITLES[theme];
    const href = this.props.type === 'statewide' ?
      `/download/statewide/${theme}`
      : `/download/${this.props.type}/${this.props.typeId}/${theme}`;

    let dlTitle = `${R.defaultTo('', this.props.viewName)} ${themeTitle}`;
    // removed in fall 2017 updates
    // if (this.props.type == 'project') {
    //   dlTitle = `WMS Project`;
    // }
    return (
      <a href={href} download target="_blank"
        className="download-data-link"
        title={`Download ${dlTitle} data`}>
        Download {dlTitle} data (Comma-Separated Values)
      </a>
    );
  }
}

DownloadDataLink.propTypes = {
    theme: PropTypes.oneOf(themesAndPopulation).isRequired,
    viewName: PropTypes.string,
    type: PropTypes.oneOf([
      'statewide', 'region', 'county', 'entity', 'usagetype', 'source', 'project', 'wmstype', 'wms'
    ]).isRequired,
    typeId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
}
