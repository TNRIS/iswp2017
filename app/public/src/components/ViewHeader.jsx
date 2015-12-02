
import React from 'react';


// TODO: delete svg if removing
// import MenuIcon from '../../static/img/menu.svg';

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
        <div className="header-title wrapper">
          <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
            <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" className="logo" />
          </a>
          <h1>DRAFT 2017 Texas State Water Plan</h1>
          <div className="nav-toggle-container">
            <button className="nav-toggle">Navigate</button>
          </div>
        </div>
        <div className="header-nav wrapper">
          Put Nav Here
        </div>
      </header>
    );
  }
});