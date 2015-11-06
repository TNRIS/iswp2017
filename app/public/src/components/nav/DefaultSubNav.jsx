
import React from 'react';
import {Link} from 'react-router';

import NavStateActions from '../../actions/NavStateActions';

export default React.createClass({
  selectSubnav(name) {
    NavStateActions.updateNavState(name);
  },

  render() {
    return (
      <ul className="subnav">
        <li>
          <Link to={`/statewide`} activeClassName={'active'}>Statewide</Link>
        </li>
        <li>
          <a onClick={this.selectSubnav.bind(this, 'regions')}>Regions</a>
        </li>
        <li>
          <a onClick={this.selectSubnav.bind(this, 'counties')}>Counties</a>
        </li>

        <li><a>TODO: Entities</a></li>
        <li><a>TODO: Water Use Type</a></li>
      </ul>
    );
  }
});