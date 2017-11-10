
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';
import titleize from 'titleize';

import constants from '../constants';
import UsageTypeIcon from './UsageTypeIcon';

export default createReactClass({
  displayName: 'UsageTypeChartLegend',

  propTypes: {
    className: PropTypes.string
  },

  mixins: [PureRenderMixin],

  render() {
    return (
      <div className={classnames("chart-legend", "usage-type-chart-legend", this.props.className)}>
        <ul>
          {constants.USAGE_TYPES.map((type) => {
            return (
              <li key={type} className="legend-entry">
                <UsageTypeIcon className="legend-marker" type={type} /> {titleize(type)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
});