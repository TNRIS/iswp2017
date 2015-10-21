
import React from 'react';
import {RouteHandler} from 'react-router';
import Helmet from 'react-helmet';

import ViewHeader from './components/ViewHeader';

export default React.createClass({
  render() {
    return (
      <div>
        <Helmet titleTemplate="%s | 2017 Texas State Water Plan"/>
        <ViewHeader />
        <RouteHandler/>
      </div>
    );
  }
});
