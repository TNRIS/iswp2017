import React from 'react';
import {PureRenderMixin} from 'react/addons';

export default React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    typeId: React.PropTypes.string,
    placeData: React.PropTypes.object
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
      <div className="place-summary">
        <h3>{typeAndId.toUpperCase()}</h3>
        <strong>Total Demands:</strong> 1234<br/>
        <strong>Total Existing Supplies:</strong> 1234<br/>
        <strong>Total Need (Potential Shortage):</strong> 1234 (Visualize)<br/>
        <strong>Total Strategy Supplies:</strong> 1234
      </div>
    );
  }
});