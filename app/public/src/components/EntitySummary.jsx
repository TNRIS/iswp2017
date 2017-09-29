
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import EntitySummarySubhead from './EntitySummarySubhead';
import PopulationChart from './charts/PopulationChart';

function aggregateDescription(entityName) {
  if (entityName.indexOf(',') === -1) {
    return null;
  }

  const usageType = entityName.split(',')[0];
  return constants.USAGE_TYPE_DESCRIPTIONS[usageType.toUpperCase()];
}

export default createReactClass({
  displayName: 'EntitySummary',

  propTypes: {
    entityData: PropTypes.EntityData
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    if (!props.entityData || R.isEmpty(R.keys(props.entityData))) {
      return (
        <div className="view-summary">
          <Spinner name="double-bounce" fadeIn='none' />
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
        <div className="subhead">
          <EntitySummarySubhead entityId={props.entityData.entity.EntityId} />
        </div>
        {(() => {
          const desc = aggregateDescription(entityName);
          if (desc) {
            return (<p>{desc}</p>);
          }
          return (<PopulationChart viewData={props.entityData.data} />);
        })()}
      </div>
    );
  },
});