
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

import {formatCountyName} from '../utils/CountyNames';

export default class SourceSummarySubhead extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const sourceName = this.props.sourceName;

    if (!this.props.sourceName) {
      return (<p/>);
    }

    if (sourceName.includes("|")) {
      const county = sourceName.split("|")[1].trim();

      const countyName = formatCountyName(county);

      return (
        <p>
          Groundwater Source in <Link to={`/county/${countyName}`} title={`View ${countyName} County`}>
            {countyName}</Link>
        </p>);
    }
    else {
      return (
        <p>
          Surface Water Source in <Link to="/statewide" title="View Texas">Texas</Link>
        </p>
      );
    }
  }
}

SourceSummarySubhead.propTypes = {
  sourceName: PropTypes.string
}