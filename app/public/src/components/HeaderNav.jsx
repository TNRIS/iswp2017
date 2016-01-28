
import React from 'react';
import Select from 'react-select';
import ToggleDisplay from 'react-toggle-display';
import titleize from 'titleize';

import constants from '../constants';
import history from '../history';
import CountyNamesStore from '../stores/CountyNamesStore';
import ViewStateStore from '../stores/ViewStateStore';
import EntityFetcher from '../utils/EntityFetcher';

export default React.createClass({
  getInitialState() {
    const viewState = ViewStateStore.getState().viewState;
    return {
      navCategory: viewState.view,
      countyNames: CountyNamesStore.getState().countyNames
    };
  },

  componentDidMount() {
    CountyNamesStore.listen(this.onLoadCountyNames);
    CountyNamesStore.fetch();
    ViewStateStore.listen(this.onViewStateChange);
  },

  componentWillUnmount() {
    CountyNamesStore.unlisten(this.onLoadCountyNames);
    ViewStateStore.unlisten(this.onViewStateChange);
  },

  onLoadCountyNames(storeState) {
    this.setState({countyNames: storeState.countyNames});
  },

  onViewStateChange(storeState) {
    this.setState({navCategory: storeState.viewState.view});
  },

  onCountySelect(countyName) {
    history.push({pathname: `/county/${countyName}`});
  },

  onRegionSelect(region) {
    history.push({pathname: `/region/${region}`});
  },

  onEntitySelect(entityId) {
    history.push({pathname: `/entity/${entityId}`});
  },

  onUsageTypeSelect(usageType) {
    history.push({pathname: `/usagetype/${usageType}`});
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
      history.push({pathname: '/statewide'});
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

    const usageTypeSelectOptions = constants.USAGE_TYPES.map((type) => {
      return {value: type.toLowerCase(), label: titleize(type)};
    });

    return (
      <div className="header-nav">
        <div className="wrapper">
          <label htmlFor="nav-category-select">View data for</label>
          <select onChange={this.changeNavCategory}
            value={this.state.navCategory}
            className="nav-category-select"
            id="nav-category-select">
            <option value="statewide">All of Texas</option>
            <option value="region">Planning Region</option>
            <option value="county">County</option>
            <option value="entity">Water User Group</option>
            <option value="usagetype">Usage Type</option>
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
              <Select
                placeholder="Find Water User Group"
                ignoreCase
                autoload={false}
                asyncOptions={this.entitySearch}
                options={countySelectOptions}
                onChange={this.onEntitySelect} />
            </div>
          </ToggleDisplay>
          <ToggleDisplay show={this.state.navCategory === 'usagetype'}>
            <div className="select-auto">
              <Select
                placeholder="Select Usage Type"
                ignoreCase
                options={usageTypeSelectOptions}
                onChange={this.onUsageTypeSelect} />
            </div>
          </ToggleDisplay>
        </div>
      </div>
    );
  }
});