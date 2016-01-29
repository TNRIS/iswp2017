
import React from 'react';

import HomeIcon from '../../static/img/home.svg';
import HeaderNav from './HeaderNav';

export default React.createClass({
  render() {
    return (
      <header className="header">
        <div className="header-title-container">
          <div className="header-title wrapper">
            <h1>
              <a href="/" title="Home"><span className="first-line">DRAFT 2017</span><br/>Texas State Water Plan</a>
            </h1>
            <span className="by-the show-medium">by the</span>
            <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
              <img src="/public/static/img/twdb-logo-dark-bkgd-w200px-3c.png" className="logo" />
            </a>

            <div className="nav-container">
              <a className="button button-home" title="Home" href="/"><HomeIcon/></a>
              <a className="button" href="/about" title="About">About</a>
            </div>
          </div>
        </div>
        <HeaderNav />
      </header>
    );
  }
});