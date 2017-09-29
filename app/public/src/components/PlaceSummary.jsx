
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import constants from '../constants';
import utils from '../utils';
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
    const viewName = utils.getViewName(props.type, props.typeId);
    const isLong = viewName.length > constants.LONG_NAME_THRESHOLD;

    if (!props.viewData || R.isEmpty(R.keys(props.viewData))) {
      return (
        <div className="view-summary">
          <Spinner spinnerName="double-bounce" noFadeIn />
        </div>
      );
    }

    return (
      <div className="view-summary">
        <h2 className={classnames({'long-name': isLong})}>{viewName}</h2>

        <div className="subhead">
          <PlaceSummarySubhead type={props.type} typeId={props.typeId} />
        </div>

        <PopulationChart viewData={props.viewData} />

      </div>
    );
  }
});
