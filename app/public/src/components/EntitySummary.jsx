
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';

// import PlaceSummarySubhead from './PlaceSummarySubhead';
import PropTypes from '../utils/CustomPropTypes';
import PopulationChart from './charts/PopulationChart';

export default React.createClass({
  propTypes: {
    entityData: PropTypes.EntityData
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    if (!props.entityData || R.isEmpty(R.keys(props.entityData))) {
      return (
        <div className="view-summary">
          <Spinner spinnerName="double-bounce" noFadeIn />
        </div>
      );
    }

    return (
      <div className="view-summary">
        <h2>{props.entityData.entity.EntityName}</h2>
        <PopulationChart placeData={{data: props.entityData.data}} />
      </div>
    );
  }
});