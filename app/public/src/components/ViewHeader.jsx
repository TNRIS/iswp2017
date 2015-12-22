
import React from 'react';
import ToggleDisplay from 'react-toggle-display';
import classnames from 'classnames';

import HomeIcon from '../../static/img/home.svg';
import HeaderNav from './HeaderNav';

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
          <h1><a href="/" title="Home">DRAFT 2017 Texas State Water Plan</a></h1>
          <div className="nav-container">
            <a className="button button-home" title="Home" href="/"><HomeIcon/></a>
            <button onClick={this.toggleNav} title="Navigate"
              className={classnames('nav-toggle', {'on': this.state.isNavOpen})}>
              Navigate
            </button>
            <a className="button" href="/about" title="About">About</a>
          </div>
        </div>
        <ToggleDisplay show={this.state.isNavOpen}>
          <HeaderNav />
        </ToggleDisplay>
      </header>
    );
  }
});