
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';

import PropTypes from '../utils/CustomPropTypes';
import PopulationChart from './charts/PopulationChart';

export default createReactClass({
  displayName: 'StatewideSummary',

  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    if (!props.viewData || R.isEmpty(R.keys(props.viewData))) {
      return (
        <div className="view-summary">
          <h2>TEXAS</h2>
          <Spinner name="double-bounce" fadeIn='none' />
        </div>
      );
    }

    return (
      <div className="view-summary">
        <h2>TEXAS</h2>
        <PopulationChart viewData={props.viewData} />
      </div>
    );
  },
});