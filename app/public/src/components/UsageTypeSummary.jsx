
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import UsageTypeIcon from './UsageTypeIcon';

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData,
    usageType: React.PropTypes.string
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    if (!props.viewData || R.isEmpty(R.keys(props.viewData))) {
      return (
        <div className="view-summary">
          <Spinner spinnerName="double-bounce" noFadeIn />
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
  }
});