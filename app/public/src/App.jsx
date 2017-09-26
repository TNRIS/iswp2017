
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import HeaderNav from './components/HeaderNav';

class App extends React.Component {
  render() {
    return (
      <div>
        <Helmet titleTemplate="%s | 2017 Texas State Water Plan"/>
        <HeaderNav />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object
}

export default App;