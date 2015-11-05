
import React from 'react';
import Drawer from 'react-motion-drawer';

import NavStateStore from '../../stores/NavStateStore';
import DefaultSubNav from './DefaultSubNav';
import RegionSubNav from './RegionSubNav';

export default React.createClass({
  getInitialState() {
    return NavStateStore.getState();
  },

  componentDidMount() {
    NavStateStore.listen(this.onChange);
  },

  componentWillUnmount() {
    NavStateStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  render() {
    const selectedSubNav = this.state.selectedSubNav;

    let subnavComponent;
    if (selectedSubNav === 'default') {
      subnavComponent = <DefaultSubNav />;
    }
    else if (selectedSubNav === 'regions') {
      subnavComponent = <RegionSubNav />;
    }

    return (
      <Drawer {...this.props} className="nav-drawer">
        {subnavComponent}
      </Drawer>
    );
  }
});