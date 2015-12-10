
import React from 'react';
import Select from 'react-select';
import ToggleDisplay from 'react-toggle-display';
import titleize from 'titleize';

import constants from '../constants';
import history from '../history';
import CountyNamesStore from '../stores/CountyNamesStore';
import EntityFetcher from '../utils/EntityFetcher';

function contains(str, search) {
  return str.toLowerCase().indexOf(search.toLowerCase()) > -1;
}

export default React.createClass({
  getInitialState() {
    return {
      navCategory: 'statewide',
      countyNames: CountyNamesStore.getState().countyNames
    };
  },

  componentDidMount() {
    CountyNamesStore.listen(this.onLoadCountyNames);
    CountyNamesStore.fetch();
    this.historyUnlistener = history.listen(this.onHistoryChange);
  },

  componentWillUnmount() {
    CountyNamesStore.unlisten(this.onLoadCountyNames);
    this.historyUnlistener();
  },

  onHistoryChange(loc) {
    let navCategory = 'statewide';
    if (contains(loc.pathname, '/entity')) {
      navCategory = 'entity';
    }
    else if (contains(loc.pathname, '/county')) {
      navCategory = 'county';
    }
    else if (contains(loc.pathname, '/region')) {
      navCategory = 'region';
    }
    this.setState({navCategory});
  },

  onLoadCountyNames(storeState) {
    this.setState({countyNames: storeState.countyNames});
  },

  onCountySelect(countyName) {
    history.pushState(null, `/county/${countyName}`);
  },

  onRegionSelect(region) {
    history.pushState(null, `/region/${region}`);
  },

  onEntitySelect(entityId) {
    history.pushState(null, `/entity/${entityId}`);
  },

  entitySearch(input, callback) {
    if (input.length < 3) {
      return callback(null, {options: []});
    }

    EntityFetcher.search(input)
      .then((entities) => {
        const options = entities.map((entity) => {
          return {value: entity.EntityId, label: entity.EntityName};
        });
        callback(null, {options});
      })
      .catch((err) => {
        callback(err);
      });
  },

  changeNavCategory(e) {
    const val = e.target.value;
    this.setState({navCategory: val});

    if (val === 'statewide') {
      history.pushState(null, '/statewide');
    }
  },

  render() {
    const regionSelectOptions = constants.REGIONS.map((region) => {
      return {value: region, label: `Region ${region}`};
    });

    let countySelectOptions = [];
    if (this.state.countyNames) {
      countySelectOptions = this.state.countyNames.map((name) => {
        return {value: titleize(name), label: titleize(name)};
      });
    }

    return (
      <div className="header-nav">
        <div className="wrapper">
          <label htmlFor="nav-category-select">View data for</label>
          <select onChange={this.changeNavCategory}
            value={this.state.navCategory}
            className="nav-category-select"
            id="nav-category-select">
            <option value="statewide">Statewide</option>
            <option value="region">Region</option>
            <option value="county">County</option>
            <option value="entity">Water User Group</option>
          </select>
          <ToggleDisplay show={this.state.navCategory === 'region'}>
            <div className="select-auto">
              <Select matchPos="start"
                placeholder="Select Region"
                ignoreCase
                options={regionSelectOptions}
                onChange={this.onRegionSelect} />
            </div>
          </ToggleDisplay>
          <ToggleDisplay show={this.state.navCategory === 'county'}>
            <div className="select-auto">
              <Select matchPos="start"
                placeholder="Select County"
                ignoreCase
                options={countySelectOptions}
                onChange={this.onCountySelect} />
            </div>
          </ToggleDisplay>
          <ToggleDisplay show={this.state.navCategory === 'entity'}>
            <div className="select-auto entity-select">
              <Select matchPos="start"
                placeholder="Find Water User Group"
                ignoreCase
                autoload={false}
                asyncOptions={this.entitySearch}
                options={countySelectOptions}
                onChange={this.onEntitySelect} />
            </div>
          </ToggleDisplay>
        </div>
      </div>
    );
  }
});