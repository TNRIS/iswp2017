
import React from 'react';
import {Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intersperse from 'intersperse';

import {formatCountyName} from '../utils/CountyNames';

export default React.createClass({
  propTypes: {
    sourceName: React.PropTypes.string
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {};
  },

  render() {
    const sourceName = this.props.sourceName;

    if (!this.props.sourceName) {
      return (<p/>);
    }

    if (sourceName.includes("|")) {
      const county = sourceName.split("|")[1].trim();

      const countyName = formatCountyName(county);

      return (
        <p>
          Ground Water Source in <Link to={`/county/${countyName}`} title={`View ${countyName} County`}>
            {countyName}</Link>
        </p>);
    }
    else {
      return (
        <p>
          Surface Water Source in <Link to="/statewide" title="View Texas">Texas</Link>
        </p>
      );
    }

    return (<div/>);
  }
});