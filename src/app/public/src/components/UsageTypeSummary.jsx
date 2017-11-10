
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';

import constants from '../constants';
import CustomPropTypes from '../utils/CustomPropTypes';
import UsageTypeIcon from './UsageTypeIcon';

export default createReactClass({
  displayName: 'UsageTypeSummary',

  propTypes: {
    viewData: CustomPropTypes.ViewData,
    usageType: PropTypes.string
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    if (!props.viewData || R.isEmpty(R.keys(props.viewData))) {
      return (
        <div className="view-summary">
          <Spinner name="double-bounce" fadeIn='none' />
        </div>
      );
    }

    return (
      <div className="view-summary usage-type-summary">
        <h2>
          <UsageTypeIcon type={props.usageType} />
          {props.usageType.toUpperCase()}
        </h2>
        <p>{constants.USAGE_TYPE_DESCRIPTIONS[props.usageType.toUpperCase()]}</p>
      </div>
    );
  },
});