
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';

// import PlaceSummarySubhead from './PlaceSummarySubhead';
import PropTypes from '../utils/CustomPropTypes';
import PopulationChart from './charts/PopulationChart';

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    if (!props.placeData || R.isEmpty(R.keys(props.placeData))) {
      return (
        <div className="view-summary">
          <h2>TEXAS</h2>
          <Spinner spinnerName="double-bounce" noFadeIn />
        </div>
      );
    }

    return (
      <div className="view-summary">
        <h2>TEXAS</h2>
        <PopulationChart placeData={{data: props.placeData}} />
      </div>
    );
  }
});