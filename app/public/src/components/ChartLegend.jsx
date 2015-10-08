
import React from 'react';
import {PureRenderMixin} from 'react/addons';

export default React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className="chart-legend">

      </div>
    );
  }
});