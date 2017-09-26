
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';

const themesAndPopulation = R.append('population', constants.THEMES);

export default createReactClass({
  displayName: 'Units',

  propTypes: {
    theme: PropTypes.oneOf(themesAndPopulation)
  },

  mixins: [PureRenderMixin],

  render() {
    const units = this.props.theme === 'population' ? 'people'
      : 'acre-feet/year';

    return (
      <span className="units">({units})</span>
    );
  },
});