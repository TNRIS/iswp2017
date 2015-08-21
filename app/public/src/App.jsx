
import React from 'react';
import Locations from './components/Locations.jsx';
import Map from './components/Map.jsx';

import L from 'leaflet';

const App = React.createClass({
  getInitialState() {
    return null;
  },

  componentDidMount() {
  },

  componentWillUnmount() {
  },

  render() {
    return (
      <div className="row">
        <div className="four columns">
          <Locations />
        </div>
        <div className="eight columns">
          <Map />
        </div>
      </div>
    );
  }
});


React.render(
  <App />,
  document.getElementById('reactApp')
);
