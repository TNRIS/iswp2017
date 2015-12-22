
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import PopulationChart from './charts/PopulationChart';

function aggregateDescription(entityName) {
  const categories = R.keys(constants.COUNTY_AGGREGATE_DESCS);
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    if (entityName.indexOf(category) === 0) {
      return constants.COUNTY_AGGREGATE_DESCS[category];
    }
  }
  return null;
}

export default React.createClass({
  propTypes: {
    entityData: PropTypes.EntityData
  },

  mixins: [PureRenderMixin],

  //TODO: Include "Entity in County/Region" - Will need API to support
  render() {
    const props = this.props;

    if (!props.entityData || R.isEmpty(R.keys(props.entityData))) {
      return (
        <div className="view-summary">
          <Spinner spinnerName="double-bounce" noFadeIn />
        </div>
      );
    }

    const entityName = props.entityData.entity.EntityName;
    const isLong = entityName.length > constants.LONG_NAME_THRESHOLD;

    return (
      <div className="view-summary">
        <h2 className={classnames({'long-name': isLong})}>
          {entityName}
        </h2>
        {(() => {
          const desc = aggregateDescription(entityName);
          if (desc) {
            return (<p>{desc}</p>);
          }
          return (<PopulationChart viewData={props.entityData.data} />);
        })()}
      </div>
    );
  }
});