
import React from 'react';
import ToggleDisplay from 'react-toggle-display';
import classnames from 'classnames';

import HeaderNav from './nav/HeaderNav';

// TODO: delete svg if removing
// import MenuIcon from '../../static/img/menu.svg';

export default React.createClass({
  getInitialState() {
    return {
      isNavOpen: false
    };
  },

  toggleNav() {
    this.setState({isNavOpen: !this.state.isNavOpen});
  },

  render() {
    return (
      <header className="header">
        <div className="header-title wrapper">
          <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
            <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" className="logo" />
          </a>
          <h1>DRAFT 2017 Texas State Water Plan</h1>
          <div className="nav-toggle-container">
            <button onClick={this.toggleNav}
              className={classnames('nav-toggle', {'on': this.state.isNavOpen})}>
              Navigate
            </button>
          </div>
        </div>
        <ToggleDisplay show={this.state.isNavOpen}>
          <HeaderNav />
        </ToggleDisplay>
      </header>
    );
  }
});