
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import constants from '../constants';
import PlaceSummarySubhead from './PlaceSummarySubhead';
import PropTypes from '../utils/CustomPropTypes';
import PopulationChart from './charts/PopulationChart';

export default React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    typeId: React.PropTypes.string,
    viewData: PropTypes.ViewData
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;
    let typeAndId = `${props.typeId}`;

    if (props.type === 'region') {
      typeAndId = `Region ${props.typeId}`;
    }
    else if (props.type === 'county') {
      typeAndId += ' County';
    }

    typeAndId = typeAndId.toUpperCase();
    const isLong = typeAndId.length > constants.LONG_NAME_THRESHOLD;

    if (!props.viewData || R.isEmpty(R.keys(props.viewData))) {
      return (
        <div className="view-summary">
          <h2 className={classnames({'long-name': isLong})}>{typeAndId}</h2>

          <Spinner spinnerName="double-bounce" noFadeIn />
        </div>
      );
    }

    return (
      <div className="view-summary">
        <h2 className={classnames({'long-name': isLong})}>{typeAndId}</h2>

        {/* REMOVED, ref #122 and #56
          TODO: Fix once #56 is done
          <div className="subhead">
            <PlaceSummarySubhead type={props.type} typeId={props.typeId} />
          </div>
        */}

        <PopulationChart viewData={props.viewData} />

      </div>
    );
  }
});