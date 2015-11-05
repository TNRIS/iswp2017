
import React from 'react';
import {Link} from 'react-router';
import Drawer from 'react-motion-drawer';

export default React.createClass({
  render() {
    return (
     <Drawer {...this.props} className="nav-drawer">
        <ul className="main-nav-list">
          <li>
            <Link to={`/statewide`} activeClassName={'active'}>Statewide</Link>
          </li>
          <li>Regions</li>
          <li>Counties</li>
          <li>Entities</li>
          <li>Water Use Type</li>
        </ul>
      </Drawer>
    );
  }
});