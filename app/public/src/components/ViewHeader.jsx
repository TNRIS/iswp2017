
import React from 'react';
import NavDrawer from './NavDrawer';
import MenuIcon from '../../static/img/menu.svg';

export default React.createClass({
  getInitialState() {
    return {
      isDrawerOpen: false
    };
  },

  onMenuClick(evt) {
    evt.preventDefault();
    this.setState({isDrawerOpen: true});
  },

  onMenuChange(isOpen) {
    this.setState({isDrawerOpen: isOpen});
    return;
  },

  render() {
    return (
      <header className="header">
        <NavDrawer open={this.state.isDrawerOpen} onChange={this.onMenuChange} />
        <div className="u-pull-left">
          <a className="nav-drawer-toggle" href="" onClick={this.onMenuClick} >
            <MenuIcon />
          </a>
        </div>
        <div className="header-title wrapper">
          <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
            <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" className="logo" />
          </a>
          <h1>DRAFT 2017 Texas State Water Plan</h1>
        </div>
      </header>
    );
  }
});