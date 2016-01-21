
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';
// import {slugify} from '../utils'; //todo: wrap in class

import Irrigation from '../../static/img/icon-irrigation.svg';
import Municipal from '../../static/img/icon-municipal.svg';
import Manufacturing from '../../static/img/icon-manufacturing.svg';
import SteamElectricPower from '../../static/img/icon-steam-electric-power.svg';
import Livestock from '../../static/img/icon-livestock.svg';
import Mining from '../../static/img/icon-mining.svg';

const typeIcons = {
  'IRRIGATION': <Irrigation className="usage-type-icon icon-irrigation" />,
  'MUNICIPAL': <Municipal className="usage-type-icon icon-municipal" />,
  'MANUFACTURING': <Manufacturing className="usage-type-icon icon-manufacturing" />,
  'STEAM ELECTRIC POWER': <SteamElectricPower className="usage-type-icon icon-steam-electric-power" />,
  'LIVESTOCK': <Livestock className="usage-type-icon icon-livestock" />,
  'MINING': <Mining className="usage-type-icon icon-mining" />
};


export default React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(constants.USAGE_TYPES).isRequired
  },

  mixins: [PureRenderMixin],

  render() {
    return typeIcons[this.props.type];
  }
});