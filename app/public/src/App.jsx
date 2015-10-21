
import React from 'react';
import ViewHeader from './components/ViewHeader';
import {RouteHandler} from 'react-router';

export default React.createClass({
  render() {
    return (
      <div>
        <ViewHeader />
        <RouteHandler/>
      </div>
    );
  }
});
