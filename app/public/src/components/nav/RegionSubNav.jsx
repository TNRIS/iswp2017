
import React from 'react';
import {Link} from 'react-router';

import constants from '../../constants';
import NavStateActions from '../../actions/NavStateActions';

export default React.createClass({
  selectSubnav(name) {
    NavStateActions.updateNavState(name);
  },

  render() {
    return (
      <ul className="subnav">
        <li>
          <a className="nav-back" onClick={this.selectSubnav.bind(this, 'default')}>Back</a>
        </li>
        {
          constants.REGIONS.map((region, i) => {
            return (
              <li key={i}>
                <Link to={`/region/${region}`} activeClassName={'active'}>Region {region}</Link>
              </li>
            );
          })
        }
      </ul>
    );
  }
});