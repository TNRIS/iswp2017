
import L from 'leaflet'; //eslint-disable-line
import React from 'react';
import {RouteHandler} from 'react-router';

import Map from './components/Map.jsx';
import f from './utils/ThemeDataFetcher';

f.fetch({theme: 'demands', year: '2010', type: 'summary'})
  .then((res) => {
    console.log(res);
  });


export default React.createClass({
  render() {
    return (
      <div className="james row">
        <h1>JAMES</h1>
        <RouteHandler/>
      </div>
    );
  }
});
