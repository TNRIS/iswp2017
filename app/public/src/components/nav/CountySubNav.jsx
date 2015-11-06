
import React from 'react';
import {Link} from 'react-router';
import titleize from 'titleize';

import CountyNamesStore from '../../stores/CountyNamesStore';
import NavStateActions from '../../actions/NavStateActions';

export default React.createClass({
  getInitialState() {
    return CountyNamesStore.getState();
  },

  componentDidMount() {
    CountyNamesStore.listen(this.onLoadCountyNames);
    CountyNamesStore.fetch();
  },

  componentWillUnmount() {
    CountyNamesStore.unlisten(this.onLoadCountyNames);
  },

  onLoadCountyNames(state) {
    this.setState(state);
  },

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
          this.state.countyNames && this.state.countyNames.map((name, i) => {
            return (
              <li key={i}>
                <Link to={`/county/${titleize(name)}`} activeClassName={'active'}>
                  {titleize(name)} County
                </Link>
              </li>
            );
          })
        }
      </ul>
    );
  }
});