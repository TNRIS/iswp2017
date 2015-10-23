
import React from 'react';
import Helmet from 'react-helmet';

import ViewHeader from './components/ViewHeader';

export default React.createClass({
  propTypes: {
    children: React.PropTypes.object
  },

  render() {
    return (
      <div>
        <Helmet titleTemplate="%s | 2017 Texas State Water Plan"/>
        <ViewHeader />
        {this.props.children}
      </div>
    );
  }
});
