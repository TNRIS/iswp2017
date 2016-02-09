
import React from 'react';
import constants from '../constants';
import RegionDescriptions from '../utils/RegionDescriptions';

export default React.createClass({
  propTypes: {
    region: React.PropTypes.oneOf(constants.REGIONS).isRequired
  },

  render() {
    const region = this.props.region;
    return (
      <div>
        <p>
          {RegionDescriptions[region]} <a href={`http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-${region.toLowerCase()}`}>
            http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-{region.toLowerCase()}
          </a>
        </p>
      </div>
    );
  }
});