
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import classnames from 'classnames';

export default React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

  mixins: [PureRenderMixin],

  render() {
    return (
      <div className={classnames("chart-data-table", this.props.className)}>
        TODO: ChartDataTable
      </div>
    );
  }
});