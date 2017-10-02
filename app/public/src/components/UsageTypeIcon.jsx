
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classnames from 'classnames';

import Irrigation from '../../static/img/icon-irrigation.svg';
import Municipal from '../../static/img/icon-municipal.svg';
import Manufacturing from '../../static/img/icon-manufacturing.svg';
import SteamElectricPower from '../../static/img/icon-steam-electric-power.svg';
import Livestock from '../../static/img/icon-livestock.svg';
import Mining from '../../static/img/icon-mining.svg';

export default createReactClass({
  displayName: 'UsageTypeIcon',

  propTypes: {
    type: PropTypes.string.isRequired,
    className: PropTypes.string
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;

    switch (props.type.toUpperCase()) {
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
  },
});