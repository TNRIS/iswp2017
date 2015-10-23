
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';

export default React.createClass({
  propTypes: {
    entries: React.PropTypes.arrayOf(React.PropTypes.shape({
      className: React.PropTypes.string.isRequired,
      display: React.PropTypes.string.isRequired
    })).isRequired,
    className: React.PropTypes.string
  },

  mixins: [PureRenderMixin],


  render() {
    if (!this.props.entries || R.isEmpty(this.props.entries)) {
      return (<div></div>);
    }

    return (
      <div className={classnames("chart-legend", this.props.className)}>
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