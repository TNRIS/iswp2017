
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';

const themesAndPopulation = R.append('population', constants.THEMES);

export default React.createClass({
  propTypes: {
    theme: React.PropTypes.oneOf(themesAndPopulation)
  },

  mixins: [PureRenderMixin],

  render() {
    const units = this.props.theme === 'population' ? 'people'
      : 'acre-feet/year';

    return (
      <span className="units">({units})</span>
    );
  }
});
