
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';

import PropTypes from '../../utils/CustomPropTypes';
import ThemeMap from './ThemeMap';

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData,
    decade: React.PropTypes.string
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      decade: '2020'
    };
  },

  render() {
    if (!this.props.placeData || !this.props.placeData.data) {
      return (
        <Spinner spinnerName="double-bounce" />
      );
    }

    const placeData = this.props.placeData;

    return (
      <div>
        <h4>Maps</h4>
        Select Decade: <strong>2020</strong> | 2040 | 2050 | 2060 | 2070
        <div className="row">
          <div className="six columns">
            <ThemeMap theme={"demands"} data={placeData.data.demands} boundary={placeData.boundary} />
          </div>
          <div className="six columns">
            <ThemeMap theme={"supplies"} data={placeData.data.supplies} boundary={placeData.boundary} />
          </div>
        </div>
        <div className="row">
          <div className="six columns">
            <ThemeMap theme={"needs"} data={placeData.data.needs} boundary={placeData.boundary} />
          </div>
          <div className="six columns">
            <ThemeMap theme={"strategies"} data={placeData.data.strategies} boundary={placeData.boundary} />
          </div>
        </div>
      </div>
    );
  }
});