
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import SourceSummarySubhead from './SourceSummarySubhead';
import PopulationChart from './charts/PopulationChart';

function aggregateDescription(sourceName) {
  if (sourceName.indexOf(',') === -1) {
    return null;
  }

  const usageType = sourceName.split(',')[0];
  return constants.USAGE_TYPE_DESCRIPTIONS[usageType.toUpperCase()];
}

export default React.createClass({
  propTypes: {
    sourceData: PropTypes.SourceData
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    if (!props.sourceData || R.isEmpty(R.keys(props.sourceData))) {
      return (
        <div className="view-summary">
          <Spinner spinnerName="double-bounce" noFadeIn />
        </div>
      );
    }

    const sourceName = props.sourceData.boundary.features[0].properties.name;
    const isLong = sourceName.length > constants.LONG_NAME_THRESHOLD;

    return (
      <div className="view-summary src-summary">
        <h2 className={classnames({'long-name': isLong})}>
          {sourceName}
        </h2>
        <div className="subhead">
          <SourceSummarySubhead sourceName={sourceName} />
        </div>
        {/*
        {(() => {
          const desc = aggregateDescription(sourceName);
          if (desc) {
            return (<p>{desc}</p>);
          }
          return (<PopulationChart viewData={props.sourceData.data} />);
        })()}
      */}
      </div>
    );
  }
});