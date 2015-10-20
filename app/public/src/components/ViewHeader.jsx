
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
      <div>
        <NavDrawer open={this.state.isDrawerOpen} onChange={this.onMenuChange} />
        <header className="header">
          <div className="u-pull-left">
            <a className="nav-drawer-toggle" href="" onClick={this.onMenuClick} >
              <MenuIcon />
            </a>
          </div>
          <div className="header-title wrapper">
            <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" className="logo" />
            <h1>Texas State Water Plan 2017</h1>
          </div>
        </header>
      </div>
    );
  }
});