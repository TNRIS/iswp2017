import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';

import WMSTypes from '../constants/WMSTypes';
import CustomPropTypes from '../utils/CustomPropTypes';
import WmsTypeIcon from './WmsTypeIcon';

export default class WmsTypeSummary extends React.PureComponent {

  render() {
    const props = this.props;
    const wmsType = props.wmsType.toUpperCase();

    if (!props.wmsTypeData || R.isEmpty(R.keys(props.wmsTypeData))) {
      return (
        <div className="view-summary">
          <Spinner name="double-bounce" fadeIn='none' />
        </div>
      );
    }

    return (
      <div className="view-summary usage-type-summary">
        <h2>
          <WmsTypeIcon type={wmsType} />
          {wmsType}
        </h2>
        <p>{WMSTypes.WMS_TYPE_DESCRIPTIONS[wmsType]}</p>
      </div>
    );
  }
}

WmsTypeSummary.propTypes = {
    data: CustomPropTypes.ViewData,
    wmsType: PropTypes.string
}
