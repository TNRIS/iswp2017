import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class WmsSummarySubhead extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const wmsSponsorRegion = this.props.wmsSponsorRegion;
    return (
      <p>
        Water Management Strategy Sponsor Region{` `}
        <Link to={`/region/${wmsSponsorRegion}`} title={`View Sponsor Region ${wmsSponsorRegion}`}>{wmsSponsorRegion}</Link>
      </p>
    );
  }
}

  WmsSummarySubhead.propTypes = {
    wmsSponsorRegion: PropTypes.string
  }
