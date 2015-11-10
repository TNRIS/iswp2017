
import React from 'react';
import {Link} from 'react-router';
import Select from 'react-select';
import titleize from 'titleize';

import history from '../../history';
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

  onSelect(value) {
    history.pushState(null, `/county/${value}`);
  },

  goBack() {
    NavStateActions.updateNavState('default');
  },

  render() {
    if (!this.state.countyNames) {
      return (<div/>);
    }

    const selectOptions = this.state.countyNames.map((name) => {
      return {value: titleize(name), label: titleize(name)};
    });

    return (
      <div>
        <ul className="subnav">
          <li>
            <a className="nav-back" onClick={this.goBack}>Back</a>
          </li>
        </ul>
        <Select
          matchPos="start"
          placeholder="Select County"
          ignoreCase
          options={selectOptions}
          onChange={this.onSelect} />
      </div>
    );
  }
});