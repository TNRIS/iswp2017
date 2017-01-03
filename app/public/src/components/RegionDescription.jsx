
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
          {RegionDescriptions.description[region]} <a href={`http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-${region.toLowerCase()}`}>
            http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-{region.toLowerCase()}
          </a>. {RegionDescriptions.regionalLink[region]} <a href={`http://www.twdb.texas.gov/waterplanning/swp/2017/doc/2016_RegionalSummary_${region}.pdf`}>
            http://www.twdb.texas.gov/waterplanning/swp/2017/doc/2016_RegionalSummary_{region}.pdf
          </a>.
        </p>
      </div>
    );
  }
});