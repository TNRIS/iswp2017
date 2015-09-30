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
    if (props.typeId) {
      typeAndId += ` ${props.typeId}`;
    }

    return (
      <div className="theme-summary">
        <h3>
          {props.year} {props.theme.toUpperCase()}<br/>
          {typeAndId.toUpperCase()}
        </h3>
        <p>summary text and statistics summary text and statistics summary text and statistics summary text and statistics summary text and statistics summary text and statistics </p>
      </div>
    );
  }
});