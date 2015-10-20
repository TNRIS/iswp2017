
import React from 'react';
import Drawer from 'react-motion-drawer';

export default React.createClass({
  render() {
    return (
     <Drawer {...this.props} className="nav-drawer">
        <ul>
          <li>Home</li>
          <li>Regions</li>
          <li>Counties</li>
          <li>Water Use Type</li>
        </ul>
      </Drawer>
    );
  }
});