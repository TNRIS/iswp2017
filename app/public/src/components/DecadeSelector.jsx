
import R from 'ramda';
import React from 'react';

import constants from '../constants';

export default React.createClass({
  propTypes: {
    value: React.PropTypes.oneOf(constants.DECADES),
    onChange: React.PropTypes.func,
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.oneOf(constants.DECADES),
      requestChange: React.PropTypes.func.isRequired
    })
  },

  getDefaultProps() {
    return {
      value: R.nth(0, constants.DECADES),
      onChange: () => {},
      valueLink: null
    };
  },

  getValueLink(props) {
    return props.valueLink || {
      value: props.value,
      requestChange: props.onChange
    };
  },

  selectDecade(decade) {
    this.getValueLink(this.props).requestChange(decade);
  },

  render() {
    return (
      <div className="selector decade-selector">
        <span className="label">Select Decade:</span>
        <ul className="options">
          {
            constants.DECADES.map((decade, i) => {
              const isActive = this.props.value === decade;
              if (isActive) {
                return (<li key={i} className="active">{decade}</li>);
              }
              return (
                <li key={i}>
                  <button className="button" onClick={this.selectDecade.bind(this, decade)}>{decade}</button>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
});