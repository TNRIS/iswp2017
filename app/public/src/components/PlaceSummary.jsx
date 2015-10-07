import React from 'react';
import {PureRenderMixin} from 'react/addons';

export default React.createClass({
  propTypes: {
    theme: React.PropTypes.string,
    year: React.PropTypes.string,
    dataRows: React.PropTypes.array
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;
    let typeAndId = `${props.type}`;
    if (props.type === 'region') {
      typeAndId += ` ${props.typeId}`;
    }
    else if (props.type === 'county') {
      typeAndId = `${props.typeId} County`;
    }

    return (
      <div className="theme-summary">
        <h3>
          {props.year}<br/>
          {typeAndId.toUpperCase()}
        </h3>
        <strong>Total Demands:</strong> 1234<br/>
        <strong>Total Existing Supplies:</strong> 1234<br/>
        <strong>Total Need (Potential Shortage):</strong> 1234 (Visualize)<br/>
        <strong>Total Strategy Supplies:</strong> 1234
      </div>
    );
  }
});