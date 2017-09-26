
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import SourceSummarySubhead from './SourceSummarySubhead';

export default createReactClass({
  displayName: 'SourceSummary',

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
      </div>
    );
  },
});