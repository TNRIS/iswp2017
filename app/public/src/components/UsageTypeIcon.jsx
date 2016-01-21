
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';

import constants from '../constants';

import Irrigation from '../../static/img/icon-irrigation.svg';
import Municipal from '../../static/img/icon-municipal.svg';
import Manufacturing from '../../static/img/icon-manufacturing.svg';
import SteamElectricPower from '../../static/img/icon-steam-electric-power.svg';
import Livestock from '../../static/img/icon-livestock.svg';
import Mining from '../../static/img/icon-mining.svg';


export default React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(constants.USAGE_TYPES).isRequired,
    className: React.PropTypes.string
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    switch (props.type) {
    case 'IRRIGATION':
      return <Irrigation className={classnames("usage-type-icon icon-irrigation", props.className)} />;
    case 'MUNICIPAL':
      return <Municipal className={classnames("usage-type-icon icon-municipal", props.className)} />;
    case 'MANUFACTURING':
      return <Manufacturing className={classnames("usage-type-icon icon-manufacturing", props.className)} />;
    case 'STEAM ELECTRIC POWER':
      return <SteamElectricPower className={classnames("usage-type-icon icon-steam-electric-power", props.className)} />;
    case 'LIVESTOCK':
      return <Livestock className={classnames("usage-type-icon icon-livestock", props.className)} />;
    case 'MINING':
      return <Mining className={classnames("usage-type-icon icon-mining", props.className)} />;
    default:
      return <div />;
    }
  }
});