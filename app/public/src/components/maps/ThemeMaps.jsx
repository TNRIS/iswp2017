
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Spinner from 'react-spinkit';

import ThemeMap from './ThemeMap';

export default React.createClass({
  propTypes: {
    placeData: React.PropTypes.object
  },

  mixins: [PureRenderMixin],

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
        <div className="row">
          <div className="six columns">
            <ThemeMap theme={"demands"} data={placeData.demands} />
          </div>
          <div className="six columns">
            <ThemeMap theme={"supplies"} data={placeData.supplies} />
          </div>
        </div>
        <div className="row">
          <div className="six columns">
            <ThemeMap theme={"needs"} data={placeData.needs} />
          </div>
          <div className="six columns">
            <ThemeMap theme={"strategies"} data={placeData.strategies} />
          </div>
        </div>
      </div>
    );
  }
});