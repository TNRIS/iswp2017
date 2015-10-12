
import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';

export default React.createClass({
  propTypes: {
    entries: React.PropTypes.arrayOf(React.PropTypes.shape({
      className: React.PropTypes.string.isRequired,
      display: React.PropTypes.string.isRequired
    })).isRequired
  },

  mixins: [PureRenderMixin],


  render() {
    if (!this.props.entries || R.isEmpty(this.props.entries)) {
      return (<div></div>);
    }

    return (
      <div className="chart-legend">
        <ul>
          {this.props.entries.map((entry, i) => {
            return (
              <li key={i} className="legend-entry">
                <svg className="legend-marker">
                  <circle cx="7" cy="7" r="6" className={entry.className}></circle>
                </svg>
                {entry.display}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
});