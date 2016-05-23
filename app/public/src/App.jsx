
import React from 'react';
import Helmet from 'react-helmet';

import HeaderNav from './components/HeaderNav';

export default React.createClass({
  propTypes: {
    children: React.PropTypes.object
  },

  render() {
    return (
      <div>
        <Helmet titleTemplate="%s | 2017 Texas State Water Plan"/>
        <HeaderNav />
        {this.props.children}
      </div>
    );
  }
});
