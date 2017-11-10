
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';

export default createReactClass({
  displayName: 'ChartLegend',

  propTypes: {
    entries: PropTypes.arrayOf(PropTypes.shape({
      className: PropTypes.string.isRequired,
      display: PropTypes.string.isRequired
    })).isRequired,
    rectangle: PropTypes.bool,
    className: PropTypes.string
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
                  {(() => {
                    if (this.props.rectangle) {
                      return (<rect x="3" y="3" width="12" height="12" className={entry.className}></rect>);
                    }

                    return (<circle cx="8" cy="8" r="6" className={entry.className}></circle>);
                  })()}
                </svg>
                {entry.display}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});